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

	const { data, error } = await supabase
		.from("nominations")
		.select("*")
		.eq("thread_id", thread_id)
		.order("created_at", { ascending: true });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ nominations: data });
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
	const { thread_id, name, user_id, email, label } = body;

	if (!thread_id || !name || !user_id || !email || !label) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	const payload = {
		thread_id,
		name,
		user_id,
		email,
		label,
	};

	const { data, error } = await supabase.from("nominations").insert([payload]).select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ nomination: data[0] });
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
	const nomination_id = searchParams.get("nomination_id");

	if (!nomination_id) {
		return NextResponse.json({ error: "Nomination ID is required" }, { status: 400 });
	}

	const { error } = await supabase.from("nominations").delete().eq("id", nomination_id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ message: "Nomination deleted successfully" });
}
