import { useEffect, useState } from "react";
import supabase from "@/lib/db";
import axios from "axios";

export function useProfile(userId: string) {
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function fetchProfile() {
			setLoading(true);
			try {
				// Fetch Clerk user info securely
				if (!userId) throw new Error("Invalid user ID");
				const { data } = await axios.get(`/api/clerk/user?userId=${userId}`);
				const clerkUser = data?.user;

				if (!clerkUser) throw new Error(data?.message || "User not found");

				// Fetch votes/comments/groups from Supabase in parallel
				const [votesRes, commentsRes, groupsRes] = await Promise.all([
					supabase.from("votes").select("*").eq("user_id", userId),
					supabase.from("comments").select("*").eq("user_id", userId),
					supabase
						.from("groups")
						.select("*")
						.contains("members_list", [
							{ name: clerkUser?.fullName, role: clerkUser?.publicMetadata?.role },
						]),
				]);

				const votes = votesRes.data || [];
				const comments = commentsRes.data || [];
				const groups = groupsRes.data || [];

				const unsafeMeta = clerkUser?.unsafeMetadata || {};
				const profileData = {
					name: clerkUser?.fullName || clerkUser?.username || "Unknown",
					role: clerkUser?.publicMetadata?.role || "Member",
					location: clerkUser?.publicMetadata?.location || "",
					avatar: clerkUser?.imageUrl || "",
					isVerified: clerkUser?.publicMetadata?.verified || false,
					email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
					course: unsafeMeta.course || "",
					yearOfStudy: unsafeMeta.yearOfStudy || "",
					skills: Array.isArray(unsafeMeta.skills) ? unsafeMeta.skills : [],
					interests: Array.isArray(unsafeMeta.interests) ? unsafeMeta.interests : [],
					socialLinks: [
						...(clerkUser?.publicMetadata?.linkedin
							? [
									{
										platform: "linkedin",
										url: clerkUser.publicMetadata.linkedin,
										icon: "linkedin",
									},
								]
							: []),
						...(clerkUser?.publicMetadata?.twitter
							? [
									{
										platform: "twitter",
										url: clerkUser.publicMetadata.twitter,
										icon: "twitter",
									},
								]
							: []),
						...(clerkUser?.emailAddresses?.[0]?.emailAddress
							? [
									{
										platform: "email",
										url: `mailto:${clerkUser.emailAddresses[0].emailAddress}`,
										icon: "mail",
									},
								]
							: []),
					],
					totalVotes: votes.length,
					totalComments: comments.length,
					totalGroups: groups.length,
				};

				if (!cancelled) setProfile(profileData);
			} catch (err: any) {
				console.error("Error fetching profile:", err);
				if (!cancelled) setProfile(null);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		if (userId) fetchProfile();

		return () => {
			cancelled = true;
		};
	}, [userId]);

	return { profile, loading };
}
