import { useState, useCallback } from "react";
import axios from "axios";
import type { IThread, IUseThreads } from "@/types";
import useSWR from "swr";

export function useThreads(groupId?: string): IUseThreads {
	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const [thread, setThread] = useState<IThread | null>(null);
	const [threadLoading, setThreadLoading] = useState(false);
	const [threadError, setThreadError] = useState<string | null>(null);

	const threadsFetcher = useCallback(
		async (url: string) => {
			const { data } = await axios.get(url, {
				params: { groupId: groupId },
			});

			return data.threads || [];
		},
		[groupId],
	);

	const {
		data: threads = [],
		error: threadsError,
		isLoading: threadsLoading,
		mutate: fetchThreads,
	} = useSWR(groupId ? `/api/threads?groupId=${groupId}` : `/api/threads`, threadsFetcher);

	const getThread = useCallback(async (threadId: string) => {
		setThreadLoading(true);
		setThreadError(null);

		try {
			// first check if the thread is already in the threads list
			const existingThread = threads?.find((t: IThread) => t.id === threadId);

			if (existingThread) {
				setThread(existingThread);
				setThreadLoading(false);

				return;
			}

			const { data } = await axios.get(`/api/threads/thread`, {
				params: { threadId: threadId },
			});

			setThread(data.thread || null);
		} catch (err: any) {
			setThreadError(err.response?.data?.error || "Failed to fetch thread");
		}
		setThreadLoading(false);
	}, []);

	const createThread = async ({ title, description, voteType, deadline }: IThread) => {
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
				groupId: groupId,
				title,
				description,
				voteType: voteType,
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
					params: { threadId: threadId },
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
