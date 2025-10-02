import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

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
	const userId = searchParams.get("userId");

	if (!userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	try {
		const groups = await prisma.groups.findMany();

		if (!groups) {
			throw new Error("Failed to fetch groups, no groups found.");
		}

		// Filter groups where the user is in the membersList
		const userGroups = groups.filter((group) => {
			const members = group.membersList;

			return members.some((member: { name: string }) => member.name === userId);
		});

		return NextResponse.json({ groups: userGroups });
	} catch (err) {
		console.error("Error fetching groups for user:", err);

		return NextResponse.json({ error: "Failed to fetch groups for user." }, { status: 500 });
	}
}
