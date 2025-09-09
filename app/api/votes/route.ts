import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
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

	const { data, error } = await supabase.from("votes").select("*").eq("thread_id", thread_id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ votes: data });
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
	const { thread_id, vote, weight } = body;

	if (!thread_id || !vote) {
		return NextResponse.json({ error: "Thread ID and vote are required" }, { status: 400 });
	}

	const payload = {
		thread_id,
		user_id: auth.userId,
		vote,
		weight: weight || 1,
	};

	const { error } = await supabase.from("votes").upsert([payload]);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ message: "Vote submitted successfully" });
}
