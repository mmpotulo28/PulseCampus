import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { IComment } from "@/types";

export function useComments(threadId: string) {
	const [comments, setComments] = useState<IComment[]>([]);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [commentsError, setCommentsError] = useState<string | null>(null);

	const [addCommentLoading, setAddCommentLoading] = useState(false);
	const [addCommentError, setAddCommentError] = useState<string | null>(null);
	const [addCommentSuccess, setAddCommentSuccess] = useState<string | null>(null);

	const fetchComments = useCallback(async () => {
		setCommentsLoading(true);
		setCommentsError(null);

		if (!threadId) {
			setComments([]);
			setCommentsLoading(false);
			setCommentsError("No threadId provided");

			return;
		}

		try {
			const { data } = await axios.get(`/api/comments`, {
				params: { thread_id: threadId },
			});
			setComments(data.comments || []);
		} catch (err: any) {
			setCommentsError(err.response?.data?.error || "Failed to fetch comments");
		}
		setCommentsLoading(false);
	}, [threadId]);

	useEffect(() => {
		if (threadId) fetchComments();
	}, [threadId, fetchComments]);

	const addComment = useCallback(
		async (text: string, name?: string) => {
			setAddCommentLoading(true);
			setAddCommentError(null);
			setAddCommentSuccess(null);

			try {
				if (!threadId) {
					throw new Error("No thread selected.");
				}
				if (!text || text.length < 2) {
					throw new Error("Comment is too short.");
				}

				const { data } = await axios.post("/api/comments", {
					thread_id: threadId,
					text,
					name,
				});

				console.log("Comment added:", data.comment);

				setAddCommentSuccess("Comment added successfully.");
				fetchComments();
			} catch (err: any) {
				setAddCommentError(err.response?.data?.error || "Failed to add comment");
			}
			setAddCommentLoading(false);
		},
		[threadId, fetchComments],
	);

	return {
		comments,
		commentsLoading,
		commentsError,
		fetchComments,
		addComment,
		addCommentLoading,
		addCommentError,
		addCommentSuccess,
	};
}
