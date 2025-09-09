import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

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

	if (!group_id) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	try {
		const { data: group, error } = await supabase
			.from("groups")
			.select("*")
			.eq("id", group_id)
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ group });
	} catch (error) {
		console.error("Error retrieving group:", error);
		return NextResponse.json({ error: "Error retrieving group" }, { status: 500 });
	}
}
