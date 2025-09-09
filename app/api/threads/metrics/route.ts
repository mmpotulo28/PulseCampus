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
	const thread_id = searchParams.get("thread_id");

	if (!thread_id) {
		return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
	}

	const cacheKey = `thread_metrics_${thread_id}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			return NextResponse.json(JSON.parse(cachedResponse));
		}

		// Fetch data from Supabase
		const [
			{ data: threadData, error: threadError },
			{ data: votesData, error: votesError },
			{ data: commentsData, error: commentsError },
			{ data: nominationsData, error: nominationsError },
		] = await Promise.all([
			supabase.from("threads").select("*").eq("id", thread_id).single(),
			supabase.from("votes").select("*").eq("thread_id", thread_id),
			supabase.from("comments").select("*").eq("thread_id", thread_id),
			supabase.from("nominations").select("*").eq("thread_id", thread_id),
		]);

		if (threadError || votesError || commentsError || nominationsError) {
			return NextResponse.json(
				{
					error:
						threadError?.message ||
						votesError?.message ||
						commentsError?.message ||
						nominationsError?.message ||
						"Error loading thread metrics",
				},
				{ status: 500 },
			);
		}

		const responseData = {
			thread: threadData,
			votes: votesData,
			comments: commentsData,
			nominations: nominationsData,
		};

		// Cache the response in Redis
		await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_DURATION);

		return NextResponse.json(responseData);
	} catch (error) {
		console.error("Error loading thread metrics:", error);

		return NextResponse.json({ error: "Error loading thread metrics" }, { status: 500 });
	}
}
