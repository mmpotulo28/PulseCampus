import { useEffect, useState } from "react";
import axios from "axios";

export function useProfile(userId: string) {
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// update profile states
	const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
	const [updateProfileError, setUpdateProfileError] = useState<string | null>(null);
	const [updateProfileSuccess, setUpdateProfileSuccess] = useState<string | null>(null);

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
					course: clerkUser?.publicMetadata?.course || "",
					yearOfStudy: clerkUser?.publicMetadata?.yearOfStudy || "",
					skills: Array.isArray(clerkUser?.publicMetadata?.skills)
						? clerkUser?.publicMetadata?.skills
						: [],
					interests: Array.isArray(clerkUser?.publicMetadata?.interests)
						? clerkUser?.publicMetadata?.interests
						: [],
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

	const updateProfile = async (updates: any) => {
		setUpdateProfileLoading(true);
		setUpdateProfileError(null);
		setUpdateProfileSuccess(null);

		try {
			await axios.put(`/api/clerk/user`, updates);
			setProfile((prev: any) => ({ ...prev, ...updates }));
			setUpdateProfileSuccess("Profile updated successfully");
		} catch (error) {
			console.error("Error updating profile:", error);
			setUpdateProfileError("Failed to update profile");
		} finally {
			setUpdateProfileLoading(false);
		}
	};

	return {
		profile,
		loading,
		updateProfile,
		updateProfileLoading,
		updateProfileError,
		updateProfileSuccess,
	};
}
