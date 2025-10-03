import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
	try {
		const groups = await prisma.groups.findMany();
		return NextResponse.json({ groups });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
	}
}
