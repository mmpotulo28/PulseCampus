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
	const user_id = searchParams.get("user_id");

	if (!user_id) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	try {
		const { data: groups, error } = await supabase.from("groups").select("*");

		if (error) {
			throw new Error(error.message);
		}

		// Filter groups where the user is in the members_list
		const userGroups = groups.filter((group) => {
			const members = JSON.parse(group.members_list || "[]");

			return members.some((member: { name: string }) => member.name === user_id);
		});

		return NextResponse.json({ groups: userGroups });
	} catch (err) {
		console.error("Error fetching groups for user:", err);

		return NextResponse.json({ error: "Failed to fetch groups for user." }, { status: 500 });
	}
}
