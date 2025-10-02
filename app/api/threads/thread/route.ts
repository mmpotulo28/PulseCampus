import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";
import { prisma } from "@/lib/db";

const CACHE_DURATION = 60; // Cache duration in seconds (1 minute)

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

	const cacheKey = `thread_${threadId}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Prisma
		const thread = await prisma.threads.findUnique({
			where: { id: threadId },
		});

		if (!thread) {
			return NextResponse.json({ error: "Thread not found" }, { status: 404 });
		}

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ thread }), "EX", CACHE_DURATION);

		return NextResponse.json({ thread });
	} catch (err) {
		console.error("Error fetching thread:", err);

		return NextResponse.json({ error: "Error fetching thread" }, { status: 500 });
	}
}
