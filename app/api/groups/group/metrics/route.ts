import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";
import { prisma } from "@/lib/db";
import { IThread } from "@/types";

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
	const groupId = searchParams.get("groupId");

	if (!groupId) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	const cacheKey = `group_metrics_${groupId}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		const threads = await prisma.threads.findMany({
			where: {
				groupId: groupId,
			},
		});

		if (!threads) {
			return NextResponse.json(
				{ error: "Failed to retrieve threads, no threads found" },
				{ status: 500 },
			);
		}

		const threadIds = threads
			.map((thread: IThread) => thread.id)
			.filter((id): id is string => typeof id === "string");

		if (threadIds.length === 0) {
			return NextResponse.json(
				{ error: "No threads found for the specified group" },
				{ status: 404 },
			);
		}

		const [votes, comments] = await Promise.all([
			prisma.votes.findMany({
				where: {
					threadId: {
						in: threadIds.length > 0 ? threadIds : ["0"],
					},
				},
			}),
			prisma.comments.findMany({
				where: {
					threadId: {
						in: threadIds,
					},
				},
			}),
		]);

		if (!votes || !comments) {
			return NextResponse.json(
				{
					error: "Failed to retrieve votes or comments",
				},
				{ status: 404 },
			);
		}

		const responseData = { threads, votes, comments };

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_DURATION);

		return NextResponse.json(responseData);
	} catch (error) {
		console.error("Error loading group metrics:", error);

		return NextResponse.json({ error: "Error loading group metrics" }, { status: 500 });
	}
}
