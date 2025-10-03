import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
	try {
		const votes = await prisma.votes.findMany();
		return NextResponse.json({ votes });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
	}
}
