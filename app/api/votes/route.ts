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
	const threadId = searchParams.get("threadId");

	if (!threadId) {
		return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
	}

	try {
		const votes = await prisma.votes.findMany({
			where: { threadId: threadId },
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json({ votes });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

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
	const { threadId, vote, weight } = body;

	if (!threadId || !vote) {
		return NextResponse.json({ error: "Thread ID and vote are required" }, { status: 400 });
	}

	try {
		const existingVote = await prisma.votes.findFirst({
			where: {
				threadId: threadId,
				userId: auth.userId,
			},
		});

		if (existingVote) {
			await prisma.votes.update({
				where: { id: existingVote.id },
				data: {
					vote,
					weight: weight || 1,
					updatedAt: new Date(),
				},
			});
		} else {
			await prisma.votes.create({
				data: {
					threadId: threadId,
					userId: auth.userId,
					vote,
					weight: weight || 1,
					createdAt: new Date(),
				},
			});
		}

		return NextResponse.json({ message: "Vote submitted successfully" });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
