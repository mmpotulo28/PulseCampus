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
	const groupId = searchParams.get("groupId");

	if (!groupId) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	try {
		const group = await prisma.groups.findUnique({
			where: { id: groupId },
		});

		if (!group) {
			return NextResponse.json({ error: "Group not found" }, { status: 404 });
		}

		return NextResponse.json({ group });
	} catch (error) {
		console.error("Error retrieving group:", error);

		return NextResponse.json({ error: "Error retrieving group" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return NextResponse.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
			},
			{ status: 401 },
		);
	}

	const { searchParams } = new URL(req.url);
	const groupId = searchParams.get("groupId");

	if (!groupId) {
		return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
	}

	try {
		const updates = await req.json();

		await prisma.groups.update({
			where: { id: groupId },
			data: updates,
		});

		return NextResponse.json({ message: "Group updated successfully." });
	} catch (error) {
		console.error("Error updating group:", error);

		return NextResponse.json({ error: "Failed to update group." }, { status: 500 });
	}
}
