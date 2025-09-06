import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { IComment } from "@/types";
import { error } from "console";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useComments(threadId: string) {
	const [comments, setComments] = useState<IComment[]>([]);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [commentsError, setCommentsError] = useState<string | null>(null);

	// create comment states
	const [addCommentsLoading, setAddCommentsLoading] = useState(false);
	const [addCommentsError, setAddCommentsError] = useState<string | null>(null);

	const fetchComments = useCallback(async () => {
		setCommentsLoading(true);
		setCommentsError(null);

		console.log("fetchComments called with threadId:", threadId); // Debug log

		if (!threadId) {
			setComments([]);
			setCommentsLoading(false);
			setCommentsError("No threadId provided");
			return;
		}

		const { data, error } = await supabase
			.from("comments")
			.select("*")
			.eq("thread_id", threadId)
			.order("created_at", { ascending: true });
		if (error) setCommentsError(error.message);
		setComments(data || []);
		setCommentsLoading(false);
	}, [threadId]);

	useEffect(() => {
		if (threadId) fetchComments();
	}, [threadId, fetchComments]);

	const addComment = useCallback(
		async (userId: string, text: string) => {
			setAddCommentsLoading(true);
			setAddCommentsError(null);

			const { error } = await supabase
				.from("comments")
				.insert([{ thread_id: threadId, user_id: userId, text }]);
			if (error) setAddCommentsError(error.message);

			await fetchComments();
			setAddCommentsLoading(false);
		},
		[threadId, fetchComments],
	);

	return {
		comments,
		commentsLoading,
		commentsError,
		fetchComments,

		addCommentsLoading,
		addCommentsError,
		addComment,
	};
}
