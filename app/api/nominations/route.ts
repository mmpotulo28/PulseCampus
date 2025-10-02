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
		const nominations = await prisma.nominations.findMany({
			where: { threadId: threadId },
			orderBy: { createdAt: "asc" },
		});

		return NextResponse.json({ nominations });
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
	const { threadId, name, userId, email, label } = body;

	if (!threadId || !name || !userId || !email || !label) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}

	try {
		const nomination = await prisma.nominations.create({
			data: {
				threadId: threadId,
				name,
				userId: userId,
				email,
				label,
				createdAt: new Date(),
			},
		});

		return NextResponse.json({ nomination });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
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
	const nominationId = searchParams.get("nominationId");

	if (!nominationId) {
		return NextResponse.json({ error: "Nomination ID is required" }, { status: 400 });
	}

	try {
		await prisma.nominations.delete({
			where: { id: nominationId },
		});

		return NextResponse.json({ message: "Nomination deleted successfully" });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
