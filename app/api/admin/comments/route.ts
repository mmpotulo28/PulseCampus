import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const comments = await prisma.comments.findMany();

		return NextResponse.json({ comments });
	} catch (error) {
		console.error(error);

		return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
	}
}
