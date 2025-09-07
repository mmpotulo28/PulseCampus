import { NextRequest } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	console.log("Received request for userId:", userId);

	// Authenticate request
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return Response.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
				user: null,
			},
			{ status: 401 },
		);
	}

	try {
		const user = await clerkClient.users.getUser(userId as string);

		return Response.json(
			{
				error: false,
				message: "User found.",
				user,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching user:", error);

		return Response.json(
			{
				error: true,
				message: "User not found.",
				user: null,
			},
			{ status: 404 },
		);
	}
}
