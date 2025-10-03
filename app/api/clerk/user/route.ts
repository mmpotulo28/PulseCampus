 
import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@clerk/nextjs/server";
import redis from "@/lib/config/redis";

const CACHE_DURATION = 300; // Cache duration in seconds (5 minutes)

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function formatProfile(clerkUser: any) {
	return {
		name:
			`${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}` ||
			clerkUser?.username ||
			"Unknown",
		role: clerkUser?.publicMetadata?.role || "Member",
		location: clerkUser?.publicMetadata?.location || "",
		avatar: clerkUser?.imageUrl || "",
		isVerified: clerkUser?.publicMetadata?.verified || false,
		email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
		course: clerkUser?.publicMetadata?.course || "",
		yearOfStudy: clerkUser?.publicMetadata?.yearOfStudy || "",
		skills: Array.isArray(clerkUser?.publicMetadata?.skills)
			? clerkUser?.publicMetadata?.skills
			: [],
		interests: Array.isArray(clerkUser?.publicMetadata?.interests)
			? clerkUser?.publicMetadata?.interests
			: [],
	};
}

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

	const cacheKey = `user_${userId}`;

	try {
		// Check Redis cache
		const cachedResponse = await redis.get(cacheKey);

		if (cachedResponse) {
			const cacheData = JSON.parse(cachedResponse);

			return NextResponse.json(
				{
					error: false,
					message: "User found in cache.",
					...cacheData,
				},
				{ status: 200 },
			);
		}
		const user = await clerkClient.users.getUser(userId as string);

		// Cache the response in Redis
		await redis.set(
			cacheKey,
			JSON.stringify({ user, profile: formatProfile(user) }),
			"EX",
			CACHE_DURATION,
		);

		return NextResponse.json(
			{
				error: false,
				message: "User found.",
				user,
				profile: formatProfile(user),
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
				profile: null,
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
