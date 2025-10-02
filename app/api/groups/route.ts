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
	const orgId = searchParams.get("orgId");

	if (!orgId) {
		return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
	}

	const cacheKey = `groups_${orgId}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Prisma
		const groups = await prisma.groups.findMany({
			where: { orgId: orgId },
			orderBy: { createdAt: "desc" },
		});

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ groups }), "EX", CACHE_DURATION);

		return NextResponse.json({ groups });
	} catch (err) {
		console.error("Error fetching groups:", err);

		return NextResponse.json({ error: "Error fetching groups" }, { status: 500 });
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
	const { orgId, name, description, isPublic, activity } = body;

	if (!orgId || !name || !description) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	try {
		const now = new Date();
		const group = await prisma.groups.create({
			data: {
				orgId: orgId,
				name,
				description,
				owner: auth.userId,
				isPublic: isPublic ?? false,
				members: 1,
				activity: activity ?? 0,
				membersList: [{ name: auth.userId, role: "Admin", userId: auth.userId }],
				createdAt: now,
			},
		});

		// Invalidate cache for groups by org
		const cacheKey = `groups_${orgId}`;

		await redis.del(cacheKey);

		return NextResponse.json({ group });
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
	const groupId = searchParams.get("groupId");

	if (!groupId) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	try {
		// Find group to get orgId for cache invalidation
		const group = await prisma.groups.findUnique({ where: { id: groupId } });

		if (!group) {
			return NextResponse.json({ error: "Group not found" }, { status: 404 });
		}

		await prisma.groups.delete({ where: { id: groupId } });

		// Invalidate cache for groups by org
		await redis.del(`groups_${group.orgId}`);

		return NextResponse.json({ message: "Group deleted successfully" });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
