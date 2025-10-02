import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { IThread, IVote, IComment } from "@/types";
import useSWR from "swr";

export interface IGroupMetrics {
	threads: IThread[];
	votes: IVote[];
	comments: IComment[];
	activeMembers: number;
	pulseScore: number;
	heatmap?: Record<string, number>;
	topThreads: (IThread & { voteCount: number })[];
	recentComments: IComment[];
	heatmapData?: { day: string; count: number }[];
	voteDistribution?: { name: string; value: number }[];
	avgVotesPerThread?: string;
	topVotedThread?: { thread: IThread | null; count: number };
	totalComments?: number;
	mostActiveCommenterId?: string;
	mostActiveCommenterCount?: number;
	totalVotes?: number;
}

const initialMetrics: IGroupMetrics = {
	threads: [],
	votes: [],
	comments: [],
	activeMembers: 0,
	pulseScore: 0,
	heatmap: undefined,
	topThreads: [],
	recentComments: [],
};

export function useGroupMetrics(
	groupId: string,
): IGroupMetrics & { loading: boolean; error: string | null } {
	const [votes, setVotes] = useState<IVote[]>([]);
	const [comments, setComments] = useState<IComment[]>([]);
	const [threads, setThreads] = useState<IThread[]>([]);

	// swr fetcher
	const fetcher = async (url: string) => {
		const { data } = await axios.get(url, {
			params: { groupId: groupId },
		});

		return data;
	};

	const {
		data: groupMetricsData = initialMetrics,
		isLoading: loading,
		error,
	} = useSWR(groupId ? `/api/groups/group/metrics` : null, fetcher);

	useEffect(() => {
		if (groupMetricsData) {
			setVotes(groupMetricsData.votes || []);
			setComments(groupMetricsData.comments || []);
			setThreads(groupMetricsData.threads || []);
		}
	}, [groupMetricsData]);

	// DERIVED METRICS
	const activeMembers = useMemo(() => {
		if (loading) return 0;

		return new Set([
			...(votes.map((v: IVote) => v.userId) || []),
			...(comments.map((c: IComment) => c.userId) || []),
		]).size;
	}, [votes, comments, loading]);

	const pulseScore = useMemo(() => {
		if (loading || threads.length === 0) return 0;

		return Math.round(
			(((votes.length || 0) + (comments?.length || 0)) /
				(threads.length * Math.max(activeMembers, 1))) *
				10,
		);
	}, [votes, comments, threads.length, activeMembers, loading]);

	const heatmap = useMemo(() => {
		if (loading) return {};
		const map: Record<string, number> = {};

		votes.forEach((v: IVote) => {
			if (v.createdAt) {
				const day = new Date(v.createdAt).toLocaleDateString();

				map[day] = (map[day] || 0) + 1;
			}
		});

		return map;
	}, [votes, loading]);

	const topThreads = useMemo(() => {
		if (loading) return [];

		return threads
			.map((t: IThread) => ({
				...t,
				voteCount: votes.filter((v: IVote) => v.threadId === t.id).length || 0,
			}))
			.sort((a: { voteCount: number }, b: { voteCount: number }) => b.voteCount - a.voteCount)
			.slice(0, 3);
	}, [threads, votes, loading]);

	const recentComments = useMemo(() => {
		if (loading) return [];

		return (
			comments
				?.sort(
					(a: IComment, b: IComment) =>
						new Date(b.createdAt || "").getTime() -
						new Date(a.createdAt || "").getTime(),
				)
				.slice(0, 5) || []
		);
	}, [comments, loading]);

	// CALCULATED METRICS
	const heatmapData = useMemo(() => {
		if (!heatmap) return [];

		return Object.entries(heatmap || {}).map(([day, count]) => ({
			day,
			count,
		}));
	}, [heatmap]);

	const voteDistribution = useMemo(() => {
		if (!votes || !comments) return [];

		return [
			{ name: "Votes", value: votes.length },
			{ name: "Comments", value: comments.length },
		];
	}, [votes, comments]);

	const totalVotes = votes.length || 0;
	const totalComments = comments?.length || 0;

	const avgVotesPerThread = threads?.length > 0 ? (totalVotes / threads.length).toFixed(2) : "0";

	const topVotedThread = useMemo(() => {
		return threads?.length > 0
			? threads.reduce<{ thread: IThread | null; count: number }>(
					(max, t) => {
						const count = votes.filter((v) => v.threadId === t.id).length || 0;

						return count > max.count ? { thread: t, count } : max;
					},
					{ thread: null, count: 0 },
				)
			: { thread: null, count: 0 };
	}, [threads, votes]);

	const commenterCounts = useMemo(() => {
		return (
			comments?.reduce(
				(acc, c) => {
					acc[c.userId] = (acc[c.userId] || 0) + 1;

					return acc;
				},
				{} as Record<string, number>,
			) || {}
		);
	}, [comments]);

	const mostActiveCommenterId = useMemo(
		() =>
			Object.keys(commenterCounts).reduce((maxId, id) => {
				return commenterCounts[id] > (commenterCounts[maxId] || 0) ? id : maxId;
			}, ""),
		[commenterCounts],
	);

	const mostActiveCommenterCount = commenterCounts[mostActiveCommenterId] || 0;

	const groupMetrics: IGroupMetrics & {
		loading: boolean;
		error: string | null;
	} = {
		threads: threads,
		votes: votes,
		comments: comments,
		activeMembers,
		pulseScore,
		heatmap,
		topThreads,
		recentComments,
		loading,
		error,
		heatmapData,
		voteDistribution,
		avgVotesPerThread,
		topVotedThread,
		totalComments,
		mostActiveCommenterId,
		mostActiveCommenterCount,
		totalVotes,
	};

	return groupMetrics;
}
