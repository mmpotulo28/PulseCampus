import type { INomination } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
		if (!threadId) {
			setNominations([]);
			setLoading(false);

			return;
		}
		const { data, error } = await supabase
			.from("nominations")
			.select("*")
			.eq("thread_id", threadId)
			.order("created_at", { ascending: true });

		if (error) setError(error.message);
		setNominations(data || []);
		setLoading(false);
	}, [threadId]);

	useEffect(() => {
		if (threadId) fetchNominations();
	}, [threadId, fetchNominations]);

	const addNomination = useCallback(
		async ({ nomination, threadId }: { nomination: INomination; threadId: string }) => {
			const targetThreadId = threadId || threadId;

			if (!targetThreadId || !nomination) return;

			setAddNominationLoading(true);
			setAddNominationError(null);
			setAddNominationSuccess(null);

			try {
				const { error, data } = await supabase
					.from("nominations")
					.insert([
						{
							thread_id: targetThreadId,
							name: nomination.name,
							user_id: nomination.user_id,
							email: nomination.email,
							label: nomination.label,
						},
					])
					.select();

				if (error) setAddNominationError(error.message);
				if (data) setNominations((prev) => [...prev, ...data]);
				setAddNominationSuccess("Nomination added");
			} catch (error) {
				console.error("Error adding nomination:", error);
				setAddNominationError("Failed to add nomination");
			} finally {
				setAddNominationLoading(false);
			}
		},
		[threadId],
	);

	const removeNomination = useCallback(async (nominationId: string) => {
		const { error } = await supabase.from("nominations").delete().eq("id", nominationId);

		if (error) setError(error.message);
		setNominations((prev) => prev.filter((n) => n.id !== nominationId));
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
