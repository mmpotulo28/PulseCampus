import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
	try {
		const comments = await prisma.comments.findMany();
		return NextResponse.json({ comments });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
	}
}
