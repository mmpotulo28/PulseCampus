import type { IThread, IVote, IComment } from "@/types";

import { useMemo, useState, useEffect } from "react";

import { useCache } from "@/hooks/useCache";
import { useThreads } from "@/hooks/useThreads";
import supabase from "@/lib/db";

export interface GroupMetrics {
	threads: IThread[];
	votes: IVote[];
	comments: IComment[];
	activeMembers: number;
	pulseScore: number;
	heatmap: Record<string, number>;
	topThreads: (IThread & { voteCount: number })[];
	recentComments: IComment[];
}

export function useGroupMetrics(
	groupId: string,
): GroupMetrics & { loading: boolean; error: string | null } {
	// Get all threads for the group
	const { threads, threadsLoading, threadsError } = useThreads(groupId);
	const { getCache, setCache } = useCache(120000); // 2 min cache
	const cacheKey = `metric_${groupId}`;

	const [groupMetricsState, setGroupMetricsState] = useState<{
		votes: IVote[];
		comments: IComment[];
		dataLoading: boolean;
		dataError: string | null;
	}>({ votes: [], comments: [], dataLoading: false, dataError: null });

	const fetchAllData = useMemo(() => {
		return async (threads: IThread[]) => {
			if (threads.length > 0) {
				setGroupMetricsState((prev) => ({ ...prev, dataLoading: true }));
				// Try cache first
				const cached = getCache<{ votes: IVote[]; comments: IComment[] }>(cacheKey);

				if (cached) {
					setGroupMetricsState({
						votes: cached.votes || [],
						comments: cached.comments || [],
						dataLoading: false,
						dataError: null,
					});

					return;
				}
				try {
					const { data: votesData, error: votesError } = await supabase
						.from("votes")
						.select("*")
						.in(
							"thread_id",
							threads.map((t) => t.id),
						);
					const { data: commentsData, error: commentsError } = await supabase
						.from("comments")
						.select("*")
						.in(
							"thread_id",
							threads.map((t) => t.id),
						);

					setGroupMetricsState({
						votes: votesData || [],
						comments: commentsData || [],
						dataLoading: false,
						dataError: votesError?.message || commentsError?.message || null,
					});
					setCache(cacheKey, {
						votes: votesData || [],
						comments: commentsData || [],
					});
				} catch (err: any) {
					console.error("Error fetching metrics data:", err);
					setGroupMetricsState((prev) => ({
						...prev,
						dataLoading: false,
						dataError: "Error loading metrics data",
					}));
				}
			} else {
				setGroupMetricsState({
					votes: [],
					comments: [],
					dataLoading: false,
					dataError: null,
				});
			}
		};
	}, [getCache, setCache, cacheKey]);

	useEffect(() => {
		fetchAllData(threads);
	}, [threads, cacheKey]);

	const loading = threadsLoading || groupMetricsState.dataLoading;
	const error = threadsError || groupMetricsState.dataError;

	const activeMembers = useMemo(() => {
		if (loading) return 0;

		return new Set([
			...(groupMetricsState.votes?.map((v: IVote) => v.user_id) || []),
			...(groupMetricsState.comments?.map((c: IComment) => c.user_id) || []),
		]).size;
	}, [groupMetricsState.votes, groupMetricsState.comments, loading]);

	const pulseScore = useMemo(() => {
		if (loading || threads.length === 0) return 0;

		return Math.round(
			(((groupMetricsState.votes?.length || 0) + (groupMetricsState.comments?.length || 0)) /
				(threads.length * Math.max(activeMembers, 1))) *
				100,
		);
	}, [
		groupMetricsState.votes,
		groupMetricsState.comments,
		threads.length,
		activeMembers,
		loading,
	]);

	const heatmap = useMemo(() => {
		if (loading) return {};
		const map: Record<string, number> = {};

		groupMetricsState.votes?.forEach((v: IVote) => {
			if (v.created_at) {
				const day = new Date(v.created_at).toLocaleDateString();

				map[day] = (map[day] || 0) + 1;
			}
		});

		return map;
	}, [groupMetricsState.votes, loading]);

	const topThreads = useMemo(() => {
		if (loading) return [];

		return threads
			.map((t) => ({
				...t,
				voteCount:
					groupMetricsState.votes?.filter((v: IVote) => v.thread_id === t.id).length || 0,
			}))
			.sort((a, b) => b.voteCount - a.voteCount)
			.slice(0, 3);
	}, [threads, groupMetricsState.votes, loading]);

	const recentComments = useMemo(() => {
		if (loading) return [];

		return (
			groupMetricsState.comments
				?.sort(
					(a, b) =>
						new Date(b.created_at || "").getTime() -
						new Date(a.created_at || "").getTime(),
				)
				.slice(0, 5) || []
		);
	}, [groupMetricsState.comments, loading]);

	const groupMetrics: GroupMetrics & {
		loading: boolean;
		error: string | null;
	} = {
		threads,
		votes: groupMetricsState.votes,
		comments: groupMetricsState.comments,
		activeMembers,
		pulseScore,
		heatmap,
		topThreads,
		recentComments,
		loading,
		error,
	};

	return groupMetrics;
}
