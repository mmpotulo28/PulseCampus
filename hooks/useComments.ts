import type { IComment } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { createClient, REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useComments(threadId: string) {
	const [comments, setComments] = useState<IComment[]>([]);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [commentsError, setCommentsError] = useState<string | null>(null);

	const [addCommentLoading, setAddCommentLoading] = useState(false);
	const [addCommentError, setAddCommentError] = useState<string | null>(null);
	const [addCommentSuccess, setAddCommentSuccess] = useState<string | null>(null);

	const { user } = useUser();

	const fetchComments = useCallback(async () => {
		setCommentsLoading(true);
		setCommentsError(null);

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
			.order("created_at", { ascending: false });

		console.log("Fetched comments:", data, error); // Debug log

		if (error) setCommentsError(error.message);
		setComments(data || []);
		setCommentsLoading(false);
	}, [threadId]);

	useEffect(() => {
		if (threadId) fetchComments();
	}, [threadId, fetchComments]);

	// Subscribe to realtime changes on comments table for this thread
	useEffect(() => {
		if (!threadId) return;
		const channel = supabase
			.channel("public:comments", {
				config: {
					presence: { enabled: false },
				},
			})
			.on(
				REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
				{
					event: "*",
					schema: "public",
					table: "comments",
				},
				(payload) => {
					// On any change, refetch comments
					console.log("Realtime comment change:", payload); // Debug log
					fetchComments();
				},
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [threadId, fetchComments]);

	const addComment = useCallback(
		async (text: string) => {
			setAddCommentLoading(true);
			setAddCommentError(null);
			setAddCommentSuccess(null);

			if (!user?.id) {
				setAddCommentError("You must be signed in to comment.");
				setAddCommentLoading(false);

				return;
			}
			if (!threadId) {
				setAddCommentError("No thread selected.");
				setAddCommentLoading(false);

				return;
			}
			if (!text || text.length < 2) {
				setAddCommentError("Comment is too short.");
				setAddCommentLoading(false);

				return;
			}

			const { error, data } = await supabase
				.from("comments")
				.insert([
					{
						thread_id: threadId,
						user_id: user.id,
						text,
						name: user.fullName || "Anonymous",
					},
				])
				.select();

			if (error) {
				setAddCommentError(error.message);
			} else {
				setAddCommentSuccess("Comment added!");
				setComments((prev) => [...prev, ...data] as IComment[]); // Optimistic update
			}
			setAddCommentLoading(false);
		},
		[user, threadId],
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
