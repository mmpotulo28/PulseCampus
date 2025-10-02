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
	const groupId = searchParams.get("groupId");

	const cacheKey = groupId ? `threads_${groupId}` : "threads_all";

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		let threads;

		if (groupId) {
			threads = await prisma.threads.findMany({
				where: { groupId: groupId },
				orderBy: { createdAt: "desc" },
			});
		} else {
			threads = await prisma.threads.findMany({
				orderBy: { createdAt: "desc" },
			});
		}

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ threads }), "EX", CACHE_DURATION);

		return NextResponse.json({ threads });
	} catch (err: any) {
		console.error("Error fetching threads:", err);

		return NextResponse.json({ error: "Error fetching threads" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
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

	const body = await req.json();
	const { groupId, title, description, voteType, deadline } = body;

	if (!groupId || !title || !description || !voteType || !deadline) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	try {
		const thread = await prisma.threads.create({
			data: {
				groupId: groupId,
				creatorId: auth.userId,
				title,
				description,
				status: "Open",
				totalMembers: 1,
				voteType: voteType,
				deadline,
				createdAt: new Date(),
			},
			select: { id: true },
		});

		// Invalidate cache for threads
		const cacheKey = groupId ? `threads_${groupId}` : "threads_all";

		await redis.del(cacheKey);

		return NextResponse.json({ threadId: thread.id });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
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

	try {
		// Find thread to get groupId for cache invalidation
		const thread = await prisma.threads.findUnique({ where: { id: threadId } });

		if (!thread) {
			return NextResponse.json({ error: "Thread not found" }, { status: 404 });
		}

		await prisma.threads.delete({ where: { id: threadId } });

		// Invalidate cache for threads
		const cacheKey = thread.groupId ? `threads_${thread.groupId}` : "threads_all";

		await redis.del(cacheKey);

		return NextResponse.json({ message: "Thread deleted successfully" });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
