import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";
import { prisma } from "@/lib/db";

const CACHE_DURATION = 300; // Cache duration in seconds (5 minutes)

export async function GET(req: NextRequest) {
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return NextResponse.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
				user: null,
			},
			{ status: 401 },
		);
	}

	const { searchParams } = new URL(req.url);
	const threadId = searchParams.get("threadId");

	if (!threadId) {
		return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
	}

	const cacheKey = `thread_metrics_${threadId}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		const [thread, votes, comments, nominations] = await Promise.all([
			prisma.threads.findUnique({ where: { id: threadId } }),
			prisma.votes.findMany({ where: { threadId: threadId } }),
			prisma.comments.findMany({ where: { threadId: threadId } }),
			prisma.nominations.findMany({ where: { threadId: threadId } }),
		]);

		if (!thread) {
			return NextResponse.json({ error: "Thread not found" }, { status: 404 });
		} else if (!votes) {
			return NextResponse.json({ error: "Votes not found" }, { status: 404 });
		} else if (!comments) {
			return NextResponse.json({ error: "Comments not found" }, { status: 404 });
		} else if (!nominations) {
			return NextResponse.json({ error: "Nominations not found" }, { status: 404 });
		}

		const consensus =
			thread.voteType === "mcq"
				? nominations.map((nom) => ({
						nominee: nom.name,
						voteCount: votes.filter((v) => v.vote === nom.id).length,
					}))
				: null;

		const recentVotes = votes
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 5);

		const recentComments = comments
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 5);

		const topNominees =
			thread.voteType === "mcq"
				? nominations
						.map((nom) => ({
							nominee: nom.name,
							voteCount: votes.filter((v) => v.vote === nom.id).length,
						}))
						.sort((a, b) => b.voteCount - a.voteCount)
						.slice(0, 5)
				: null;

		const responseData = {
			thread,
			metrics: {
				totalVotes: votes.length,
				totalComments: comments.length,
				totalNominations: nominations.length,
				consensus,
				recentVotes,
				recentComments,
				topNominees: topNominees,
			},
			votes,
			comments,
			nominations,
		};

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_DURATION);

		return NextResponse.json(responseData);
	} catch (error) {
		console.error("Error loading thread metrics:", error);

		return NextResponse.json({ error: "Error loading thread metrics" }, { status: 500 });
	}
}
