import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import type { IThread, IVote, IComment } from "@/types";

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
	const [groupMetricsState, setGroupMetricsState] = useState<{
		threads: IThread[];
		votes: IVote[];
		comments: IComment[];
		dataLoading: boolean;
		dataError: string | null;
	}>({ threads: [], votes: [], comments: [], dataLoading: false, dataError: null });

	useEffect(() => {
		async function fetchMetrics() {
			setGroupMetricsState((prev) => ({ ...prev, dataLoading: true, dataError: null }));

			try {
				const { data } = await axios.get(`/api/groups/group/metrics`, {
					params: { group_id: groupId },
				});

				setGroupMetricsState({
					threads: data.threads || [],
					votes: data.votes || [],
					comments: data.comments || [],
					dataLoading: false,
					dataError: null,
				});
			} catch (err: any) {
				setGroupMetricsState((prev) => ({
					...prev,
					dataLoading: false,
					dataError: err.response?.data?.error || "Failed to fetch group metrics",
				}));
			}
		}

		if (groupId) {
			fetchMetrics();
		}
	}, [groupId]);

	const loading = groupMetricsState.dataLoading;
	const error = groupMetricsState.dataError;

	const activeMembers = useMemo(() => {
		if (loading) return 0;

		return new Set([
			...(groupMetricsState.votes?.map((v: IVote) => v.user_id) || []),
			...(groupMetricsState.comments?.map((c: IComment) => c.user_id) || []),
		]).size;
	}, [groupMetricsState.votes, groupMetricsState.comments, loading]);

	const pulseScore = useMemo(() => {
		if (loading || groupMetricsState.threads.length === 0) return 0;

		return Math.round(
			(((groupMetricsState.votes?.length || 0) + (groupMetricsState.comments?.length || 0)) /
				(groupMetricsState.threads.length * Math.max(activeMembers, 1))) *
				100,
		);
	}, [
		groupMetricsState.votes,
		groupMetricsState.comments,
		groupMetricsState.threads.length,
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

		return groupMetricsState.threads
			.map((t) => ({
				...t,
				voteCount:
					groupMetricsState.votes?.filter((v: IVote) => v.thread_id === t.id).length || 0,
			}))
			.sort((a, b) => b.voteCount - a.voteCount)
			.slice(0, 3);
	}, [groupMetricsState.threads, groupMetricsState.votes, loading]);

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
		threads: groupMetricsState.threads,
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
