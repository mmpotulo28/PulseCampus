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
	const group_id = searchParams.get("group_id");

	const cacheKey = group_id ? `threads_${group_id}` : "threads_all";

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		let query = supabase.from("threads").select("*");

		if (group_id) {
			query = query.eq("group_id", group_id);
		}

		const { data, error } = await query;

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ threads: data }), "EX", CACHE_DURATION);

		return NextResponse.json({ threads: data });
	} catch (err) {
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
	const { group_id, title, description, vote_type, deadline } = body;

	if (!group_id || !title || !description || !vote_type || !deadline) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	const payload = {
		group_id,
		creator_id: auth.userId,
		title,
		description,
		status: "Open",
		total_members: 1,
		vote_type,
		deadline,
	};

	const { data, error } = await supabase.from("threads").insert([payload]).select("id");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Invalidate cache for threads
	const cacheKey = group_id ? `threads_${group_id}` : "threads_all";

	await redis.del(cacheKey);

	return NextResponse.json({ threadId: data[0].id });
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
	const thread_id = searchParams.get("thread_id");

	if (!thread_id) {
		return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
	}

	const { error } = await supabase.from("threads").delete().eq("id", thread_id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Invalidate cache for threads
	await redis.del("threads_all");

	return NextResponse.json({ message: "Thread deleted successfully" });
}
