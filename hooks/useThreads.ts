import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { IThread } from "@/types";

export function useThreads(groupId?: string) {
	const [threads, setThreads] = useState<IThread[]>([]);
	const [threadsLoading, setThreadsLoading] = useState(false);
	const [threadsError, setThreadsError] = useState<string | null>(null);

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const [thread, setThread] = useState<IThread | null>(null);
	const [threadLoading, setThreadLoading] = useState(false);
	const [threadError, setThreadError] = useState<string | null>(null);

	const fetchThreads = useCallback(async () => {
		setThreadsLoading(true);
		setThreadsError(null);

		try {
			const { data } = await axios.get(`/api/threads`, {
				params: { group_id: groupId },
			});

			setThreads(data.threads || []);
		} catch (err: any) {
			setThreadsError(err.response?.data?.error || "Failed to fetch threads");
		}
		setThreadsLoading(false);
	}, [groupId]);

	useEffect(() => {
		fetchThreads();
	}, [fetchThreads, groupId]);

	const getThread = useCallback(async (threadId: string) => {
		setThreadLoading(true);
		setThreadError(null);

		try {
			const { data } = await axios.get(`/api/threads/thread`, {
				params: { thread_id: threadId },
			});

			setThread(data.thread || null);
		} catch (err: any) {
			setThreadError(err.response?.data?.error || "Failed to fetch thread");
		}
		setThreadLoading(false);
	}, []);

	const createThread = async (
		title: string,
		description: string,
		voteType: "yesno" | "mcq" = "yesno",
		deadline?: string,
	) => {
		setCreateLoading(true);
		setCreateError(null);
		setCreateSuccess(null);

		try {
			if (!groupId) {
				throw new Error("No group selected.");
			}
			if (title.length < 5) {
				throw new Error("Title must be at least 5 characters.");
			}
			if (description.length < 10) {
				throw new Error("Description must be at least 10 characters.");
			}
			if (!deadline) {
				throw new Error("Deadline is required.");
			}

			const { data } = await axios.post("/api/threads", {
				group_id: groupId,
				title,
				description,
				vote_type: voteType,
				deadline,
			});

			console.log("Thread created:", data.thread);
			setCreateSuccess("Thread created successfully.");
			fetchThreads();
		} catch (err: any) {
			setCreateError(err.response?.data?.error || "Failed to create thread");
		}
		setCreateLoading(false);
	};

	const deleteThread = useCallback(
		async (threadId: string) => {
			setDeleting(true);
			setDeleteError(null);
			setDeleteSuccess(null);

			try {
				await axios.delete(`/api/threads`, {
					params: { thread_id: threadId },
				});

				setDeleteSuccess("Thread deleted successfully.");
				fetchThreads();
			} catch (err: any) {
				setDeleteError(err.response?.data?.error || "Failed to delete thread");
			}
			setDeleting(false);
		},
		[fetchThreads],
	);

	return {
		threads,
		threadsLoading,
		threadsError,
		createThread,
		createLoading,
		createError,
		createSuccess,
		deleteThread,
		deleting,
		deleteError,
		deleteSuccess,
		thread,
		threadLoading,
		threadError,
		getThread,
	};
}
