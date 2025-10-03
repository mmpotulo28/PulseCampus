import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const votes = await prisma.votes.findMany();

		return NextResponse.json({ votes });
	} catch (error) {
		console.error(error);

		return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
	}
}
