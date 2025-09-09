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
	const group_id = searchParams.get("group_id");

	if (!group_id) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	try {
		const { data: threads, error: threadsError } = await supabase
			.from("threads")
			.select("*")
			.eq("group_id", group_id);

		if (threadsError) {
			return NextResponse.json({ error: threadsError.message }, { status: 500 });
		}

		const threadIds = threads.map((thread) => thread.id);

		const [{ data: votes, error: votesError }, { data: comments, error: commentsError }] =
			await Promise.all([
				supabase.from("votes").select("*").in("thread_id", threadIds),
				supabase.from("comments").select("*").in("thread_id", threadIds),
			]);

		if (votesError || commentsError) {
			return NextResponse.json(
				{
					error: votesError?.message || commentsError?.message || "Error loading metrics",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json({ threads, votes, comments });
	} catch (error) {
		console.error("Error loading group metrics:", error);

		return NextResponse.json({ error: "Error loading group metrics" }, { status: 500 });
	}
}
