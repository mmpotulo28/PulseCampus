import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { IThread } from "@/types";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useThreads(groupId?: string) {
	const [threads, setThreads] = useState<IThread[]>([]);
	const [threadsLoading, setThreadsLoading] = useState(false);
	const [threadsError, setThreadsError] = useState<string | null>(null);

	// single thread states
	const [thread, setThread] = useState<IThread | null>(null);
	const [threadLoading, setThreadLoading] = useState(false);
	const [threadError, setThreadError] = useState<string | null>(null);

	const fetchThreads = useCallback(async () => {
		setThreadsLoading(true);
		setThreadsError(null);

		try {
			let query = supabase.from("threads").select("*");
			if (groupId) query = query.eq("group_id", groupId);
			const { data, error } = await query;
			if (error) throw error;
			setThreads(data || []);
		} catch (err: any) {
			console.error("Error fetching threads:", err);
			setThreadsError(err.message || "Failed to fetch threads");
		} finally {
			setThreadsLoading(false);
		}
	}, [groupId]);

	useEffect(() => {
		fetchThreads();
	}, [fetchThreads, groupId]);

	const getThread = useCallback(
		async (threadId: string) => {
			setThreadLoading(true);
			setThreadError(null);
			try {
				const { data, error } = await supabase
					.from("threads")
					.select("*")
					.eq("id", threadId)
					.single();
				if (error) {
					throw error;
				}
				setThread(data || null);
			} catch (err: any) {
				console.error("Error fetching thread:", err);
				setThreadError(err.message || "Failed to fetch thread");
			} finally {
				setThreadLoading(false);
			}
		},
		[supabase],
	);

	return { threads, threadsLoading, threadsError, getThread, thread, threadLoading, threadError };
}
