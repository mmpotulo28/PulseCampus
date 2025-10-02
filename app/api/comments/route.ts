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
		const comments = await prisma.comments.findMany({
			where: { threadId: threadId },
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json({ comments });
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
	const { threadId, text, name } = body;

	if (!threadId || !text) {
		return NextResponse.json({ error: "Thread ID and text are required" }, { status: 400 });
	}

	try {
		await prisma.comments.create({
			data: {
				threadId: threadId,
				userId: auth.userId,
				text,
				name: name || "Anonymous",
				createdAt: new Date(),
			},
		});
		return NextResponse.json({ message: "Comment added successfully" });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
