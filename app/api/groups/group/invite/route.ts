import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

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
	const { group_id, user_ids } = body;

	if (!group_id || !Array.isArray(user_ids) || user_ids.length === 0) {
		return NextResponse.json({ error: "Group ID and user IDs are required." }, { status: 400 });
	}

	try {
		const updates = user_ids.map((userId) => ({ group_id, user_id: userId }));

		const { error } = await supabase.from("group_members").upsert(updates);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: "Users invited successfully." });
	} catch (error) {
		console.error("Error inviting users to group:", error);
		return NextResponse.json({ error: "Error inviting users to group." }, { status: 500 });
	}
}
