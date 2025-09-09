import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { INomination } from "@/types";

export function useNominations(threadId: string) {
	const [nominations, setNominations] = useState<INomination[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// add nomination states
	const [addNominationLoading, setAddNominationLoading] = useState(false);
	const [addNominationError, setAddNominationError] = useState<string | null>(null);
	const [addNominationSuccess, setAddNominationSuccess] = useState<string | null>(null);

	const fetchNominations = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const { data } = await axios.get(`/api/nominations`, {
				params: { thread_id: threadId },
			});
			setNominations(data.nominations || []);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to fetch nominations");
		}
		setLoading(false);
	}, [threadId]);

	useEffect(() => {
		if (threadId) {
			fetchNominations();
		}
	}, [threadId, fetchNominations]);

	const addNomination = useCallback(
		async (nomination: INomination) => {
			setAddNominationLoading(true);
			setAddNominationError(null);
			setAddNominationSuccess(null);

			try {
				const { data } = await axios.post("/api/nominations", {
					...nomination,
					thread_id: threadId,
				});

				setNominations((prev) => [...prev, data.nomination]);
				setAddNominationSuccess("Nomination added successfully.");
			} catch (err: any) {
				setAddNominationError(err.response?.data?.error || "Failed to add nomination");
			}
			setAddNominationLoading(false);
		},
		[threadId],
	);

	const removeNomination = useCallback(async (nominationId: string) => {
		try {
			await axios.delete(`/api/nominations`, {
				params: { nomination_id: nominationId },
			});

			setNominations((prev) => prev.filter((n) => n.id !== nominationId));
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to delete nomination");
		}
	}, []);

	return {
		nominations,
		loading,
		error,
		fetchNominations,
		removeNomination,
		setNominations,

		// add nomination states
		addNomination,
		addNominationLoading,
		addNominationError,
		addNominationSuccess,
	};
}
