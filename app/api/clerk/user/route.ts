import { NextRequest, NextResponse } from "next/server";
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
		return NextResponse.json(
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

		return NextResponse.json(
			{
				error: false,
				message: "User found.",
				user,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching user:", error);

		return NextResponse.json(
			{
				error: true,
				message: "User not found.",
				user: null,
			},
			{ status: 404 },
		);
	}
}

export async function PUT(req: NextRequest) {
	const auth = getAuth(req);

	if (!auth || !auth.userId) {
		return NextResponse.json(
			{
				error: true,
				message: "Unauthorized: You must be signed in to access this resource.",
			},
			{ status: 401 },
		);
	}

	try {
		const updates = await req.json();

		console.log("Received PUT request to update user profile", updates);

		await clerkClient.users.updateUser(auth.userId, {
			publicMetadata: {
				role: updates.role,
				location: updates.location,
				course: updates.course,
				yearOfStudy: updates.yearOfStudy,
				skills: updates.skills,
				interests: updates.interests,
			},
		});

		return NextResponse.json({ message: "Profile updated successfully." }, { status: 200 });
	} catch (error) {
		console.error("Error updating user profile:", error);

		return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
	}
}
