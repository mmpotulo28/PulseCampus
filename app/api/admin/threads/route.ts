import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
	try {
		const threads = await prisma.threads.findMany();
		return NextResponse.json({ threads });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
	}
}
