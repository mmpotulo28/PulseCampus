import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";

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
	const thread_id = searchParams.get("thread_id");

	if (!thread_id) {
		return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
	}

	const cacheKey = `thread_${thread_id}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		const { data, error } = await supabase
			.from("threads")
			.select("*")
			.eq("id", thread_id)
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify({ thread: data }), "EX", CACHE_DURATION);

		return NextResponse.json({ thread: data });
	} catch (err) {
		console.error("Error fetching thread:", err);

		return NextResponse.json({ error: "Error fetching thread" }, { status: 500 });
	}
}
