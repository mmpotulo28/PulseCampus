import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const nominations = await prisma.nominations.findMany();

		return NextResponse.json({ nominations });
	} catch (error) {
		console.error(error);

		return NextResponse.json({ error: "Failed to fetch nominations" }, { status: 500 });
	}
}
