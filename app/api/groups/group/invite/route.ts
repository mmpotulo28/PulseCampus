import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

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
	const { groupId, userIds } = body;

	if (!groupId || !Array.isArray(userIds) || userIds.length === 0) {
		return NextResponse.json({ error: "Group ID and user IDs are required." }, { status: 400 });
	}

	try {
		const updates = userIds.map((userId) => ({
			groupId,
			userId,
			name: "Invited User", // Replace with actual name if available
			role: "member", // Replace with actual role if needed
		}));

		const group = await prisma.groups.update({
			where: { id: groupId },
			data: {
				membersList: {
					push: updates,
				},
			},
			select: { id: true },
		});

		if (!group) {
			return NextResponse.json({ error: "Group not found." }, { status: 404 });
		}

		return NextResponse.json({ message: "Users invited successfully." });
	} catch (error) {
		console.error("Error inviting users to group:", error);

		return NextResponse.json({ error: "Error inviting users to group." }, { status: 500 });
	}
}
