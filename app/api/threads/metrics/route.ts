import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";
import { prisma } from "@/lib/db";
import { IConsensus, IThreadMetrics, IVote, IComment, INomination } from "@/types";
import { calculateMCQConsensus, calculateYNConsensus } from "@/lib/helpers";

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

		// Fetch data from Prisma
		const [thread, votes, comments, nominations] = await Promise.all([
			prisma.threads.findUnique({ where: { id: threadId } }),
			prisma.votes.findMany({ where: { threadId: threadId } }),
			prisma.comments.findMany({ where: { threadId: threadId } }),
			prisma.nominations.findMany({ where: { threadId: threadId } }),
		]);

		if (!thread) {
			return NextResponse.json({ error: "Thread not found" }, { status: 404 });
		}

		let consensus: IConsensus;

		if (thread.voteType === "mcq") {
			consensus = calculateMCQConsensus(votes, nominations);
		} else {
			consensus = calculateYNConsensus(votes, nominations);
		}

		const recentVotes: IVote[] = votes
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 5);

		const recentComments: IComment[] = comments
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 5);

		const uniqueCommenters = [...new Map(comments.map((c) => [c.userId, c])).values()];

		const uniqueVoters = [...new Map(votes.map((v) => [v.userId, v])).values()];

		let topNominees: INomination[] | undefined = undefined;
		let winningNominee: INomination | undefined = undefined;

		if (thread.voteType === "mcq") {
			const nomineeVotes = nominations.map((nom) => ({
				nominee: nom,
				voteCount: votes.filter((v) => v.vote === nom.id).length,
			}));

			topNominees = nomineeVotes
				.sort((a, b) => b.voteCount - a.voteCount)
				.slice(0, 5)
				.map((nv) => nv.nominee);

			winningNominee =
				nomineeVotes.length > 0
					? nomineeVotes.reduce((prev, curr) =>
							curr.voteCount > prev.voteCount ? curr : prev,
						).nominee
					: undefined;
		}

		const metrics: IThreadMetrics = {
			totalVotes: votes.length,
			totalComments: comments.length,
			consensus,
			recentVotes,
			recentComments,
			uniqueCommenters,
			uniqueVoters,
			totalNominations: nominations.length,
			topNominees,
			winningNominee,
		};

		const responseData = {
			thread,
			metrics,
		};

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_DURATION);

		return NextResponse.json(responseData);
	} catch (error) {
		console.error("Error loading thread metrics:", error);

		return NextResponse.json({ error: "Error loading thread metrics" }, { status: 500 });
	}
}
