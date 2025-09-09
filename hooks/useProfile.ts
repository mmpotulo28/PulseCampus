import { useEffect, useState } from "react";
import axios from "axios";

export function useProfile(userId: string) {
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function fetchProfile() {
			setLoading(true);
			try {
				if (!userId) throw new Error("Invalid user ID");
				const { data: clerkData } = await axios.get(`/api/clerk/user`, {
					params: { userId },
				});
				const clerkUser = clerkData?.user;

				if (!clerkUser) throw new Error(clerkData?.message || "User not found");

				const { data: votesData } = await axios.get(`/api/votes/user`, {
					params: { user_id: userId },
				});
				const { data: commentsData } = await axios.get(`/api/comments/user`, {
					params: { user_id: userId },
				});
				const { data: groupsData } = await axios.get(`/api/groups/user`, {
					params: { user_id: userId },
				});

				const profileData = {
					name:
						`${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}` ||
						clerkUser?.username ||
						"Unknown",
					role: clerkUser?.publicMetadata?.role || "Member",
					location: clerkUser?.publicMetadata?.location || "",
					avatar: clerkUser?.imageUrl || "",
					isVerified: clerkUser?.publicMetadata?.verified || false,
					email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
					course: clerkUser?.unsafeMetadata?.course || "",
					yearOfStudy: clerkUser?.unsafeMetadata?.yearOfStudy || "",
					skills: Array.isArray(clerkUser?.unsafeMetadata?.skills)
						? clerkUser?.unsafeMetadata?.skills
						: [],
					interests: Array.isArray(clerkUser?.unsafeMetadata?.interests)
						? clerkUser?.unsafeMetadata?.interests
						: [],
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
					totalVotes: votesData?.votes?.length || 0,
					totalComments: commentsData?.comments?.length || 0,
					totalGroups: groupsData?.groups?.length || 0,
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
