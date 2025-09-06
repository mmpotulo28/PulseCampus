import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { IThread } from "@/types";
import { useUser } from "@clerk/nextjs";
import { usePermissions } from "./usePermissions";

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

	const { user } = useUser();
	const { isAdmin, isExco, isMember } = usePermissions();

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

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

	const createThread = async (title: string, description: string) => {
		setCreateLoading(true);
		setCreateError(null);
		setCreateSuccess(null);

		if (!isAdmin) {
			setCreateError("Only organization admins can create threads.");
			setCreateLoading(false);
			return;
		}
		if (!groupId) {
			setCreateError("No group selected.");
			setCreateLoading(false);
			return;
		}
		if (title.length < 5) {
			setCreateError("Title must be at least 5 characters.");
			setCreateLoading(false);
			return;
		}
		if (description.length < 10) {
			setCreateError("Description must be at least 10 characters.");
			setCreateLoading(false);
			return;
		}
		if (threads.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
			setCreateError("A thread with this title already exists in the group.");
			setCreateLoading(false);
			return;
		}
		try {
			const { error } = await supabase.from("threads").insert([
				{
					group_id: groupId,
					creator_id: user?.id,
					title,
					description,
					status: "Open",
					total_members: 1,
				},
			]);
			if (error) throw error;
			setCreateSuccess("Thread created successfully.");
			await fetchThreads();
		} catch (err: any) {
			setCreateError(err.message || "Failed to create thread");
		} finally {
			setCreateLoading(false);
		}
	};

	const updateThread = useCallback(
		async (
			threadId: string,
			updates: { title?: string; description?: string; status?: string },
		) => {
			try {
				const { error } = await supabase.from("threads").update(updates).eq("id", threadId);
				if (error) throw error;
				await fetchThreads();
				await getThread(threadId);
			} catch (err: any) {
				console.error("Error updating thread:", err);
			}
		},
		[fetchThreads, getThread],
	);

	const deleteThread = useCallback(
		async (threadId: string) => {
			try {
				const { error } = await supabase.from("threads").delete().eq("id", threadId);
				if (error) throw error;
				await fetchThreads();
			} catch (err: any) {
				console.error("Error deleting thread:", err);
			}
		},
		[fetchThreads],
	);

	return {
		threads,
		threadsLoading,
		threadsError,
		getThread,
		thread,
		threadLoading,
		threadError,
		createThread,
		createLoading,
		createError,
		createSuccess,
		isAdmin,
		updateThread,
		deleteThread,
	};
}
