import { useState } from "react";
import axios from "axios";
import useSWR from "swr";

export function useProfile(userId: string) {
	// swr
	const fetcher = async (url: string) => {
		const { data } = await axios.get(url, {
			params: { userId },
		});

		return data || null;
	};

	const {
		data: user,
		isLoading: loading,
		mutate,
	} = useSWR(userId ? `/api/clerk/user` : null, fetcher);

	console.log("useProfile - user:", user);

	// update profile states
	const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
	const [updateProfileError, setUpdateProfileError] = useState<string | null>(null);
	const [updateProfileSuccess, setUpdateProfileSuccess] = useState<string | null>(null);

	const updateProfile = async (updates: any) => {
		setUpdateProfileLoading(true);
		setUpdateProfileError(null);
		setUpdateProfileSuccess(null);

		try {
			await axios.put(`/api/clerk/user`, updates);
			await mutate(); // revalidate SWR data
			setUpdateProfileSuccess("Profile updated successfully");
		} catch (error) {
			console.error("Error updating profile:", error);
			setUpdateProfileError("Failed to update profile");
		} finally {
			setUpdateProfileLoading(false);
		}
	};

	return {
		profile: user?.profile,
		user,
		loading,
		updateProfile,
		updateProfileLoading,
		updateProfileError,
		updateProfileSuccess,
	};
}
