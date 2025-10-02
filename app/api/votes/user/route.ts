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

	const votes = await prisma.votes.findMany({
		where: {
			userId: userId,
		},
	});

	if (!votes) {
		return NextResponse.json(
			{ error: "Failed to retrieve votes, no user votes found" },
			{ status: 404 },
		);
	}

	return NextResponse.json({ votes });
}
