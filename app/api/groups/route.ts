import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";

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
	const org_id = searchParams.get("org_id");

	if (!org_id) {
		return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
	}

	const cacheKey = `groups_${org_id}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);
		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		const { data, error } = await supabase.from("groups").select("*").eq("org_id", org_id);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ groups: data }), "EX", CACHE_DURATION);

		return NextResponse.json({ groups: data });
	} catch (err) {
		console.error("Error fetching groups:", err);
		return NextResponse.json({ error: "Error fetching groups" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return Response.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
				user: null,
			},
			{ status: 401 },
		);
	}

	const body = await req.json();
	const { org_id, name, description, is_public, activity } = body;

	if (!org_id || !name || !description) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	const payload = {
		org_id,
		name,
		description,
		owner: auth.userId,
		is_public: is_public || false,
		members: 1,
		activity: activity || 0,
		members_list: JSON.stringify([{ name: auth.userId, role: "Admin" }]),
	};

	const { data, error } = await supabase.from("groups").insert([payload]).select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Invalidate cache for groups
	const cacheKey = `groups_${org_id}`;
	await redis.del(cacheKey);

	return NextResponse.json({ group: data[0] });
}

export async function DELETE(req: NextRequest) {
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return Response.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
				user: null,
			},
			{ status: 401 },
		);
	}
	const { searchParams } = new URL(req.url);
	const group_id = searchParams.get("group_id");

	if (!group_id) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	const { error } = await supabase.from("groups").delete().eq("id", group_id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Invalidate cache for groups
	await redis.del(`groups_${group_id}`);

	return NextResponse.json({ message: "Group deleted successfully" });
}
