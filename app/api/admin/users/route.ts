import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET(_req: NextRequest) {
	try {
		const users = await clerkClient.users.getUserList();
		const formatted = users.data.map((u: any) => ({
			id: u.id,
			name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || "Unknown",
			email: u.emailAddresses?.[0]?.emailAddress || "",
			role: u.publicMetadata?.role || "Member",
		}));
		return NextResponse.json({ users: formatted });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}
