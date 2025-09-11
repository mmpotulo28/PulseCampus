import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import type { IThread, IVote, IComment, IConsensus, INomination } from "@/types";
import useSWR from "swr";

export interface ThreadMetrics {
	thread: IThread | null;
	votes: IVote[];
	comments: IComment[];
	totalVotes: number;
	totalComments: number;
	uniqueVoters: number;
	uniqueCommenters: number;
	engagementScore: number;
	consensus: IConsensus;
	recentComments: IComment[];
	recentVotes: IVote[];
	topNominees: { option: string; count: number }[];
	winningNominee: string | null;
	loading: boolean;
	error: string | null;
}

export function useThreadMetrics(threadId: string) {
	const [thread, setThread] = useState<IThread | null>(null);
	const [votes, setVotes] = useState<IVote[]>([]);
	const [comments, setComments] = useState<IComment[]>([]);
	const [nominations, setNominations] = useState<INomination[]>([]);
	const [loading, setLoading] = useState(true);

	// swr fetcher
	const fetcher = async (url: string) => {
		const { data } = await axios.get(url, {
			params: { thread_id: threadId },
		});

		return data || null;
	};

	const { data: threadMetricsData = null, error } = useSWR(
		threadId ? `/api/threads/metrics` : null,
		fetcher,
	);

	useEffect(() => {
		if (threadMetricsData) {
			setThread(threadMetricsData.thread || null);
			setVotes(threadMetricsData.votes || []);
			setComments(threadMetricsData.comments || []);
			setNominations(threadMetricsData.nominations || []);
		}
		setLoading(false);
	}, [threadMetricsData]);

	const totalVotes = votes.length;
	const totalComments = comments.length;
	const uniqueVoters = useMemo(() => new Set(votes.map((v) => v.user_id)).size, [votes]);
	const uniqueCommenters = useMemo(
		() => new Set(comments.map((c) => c.user_id)).size,
		[comments],
	);

	const engagementScore = useMemo(() => {
		const members = thread?.totalMembers || 1;

		return Math.round(((totalVotes + totalComments) / members) * 100);
	}, [totalVotes, totalComments, thread]);

	const nomineeCounts = useMemo(() => {
		const counts: Record<string, number> = {};

		votes.forEach((v) => {
			const nominee = nominations.find((n) => n.id === v.vote);

			if (Array.isArray(v.vote)) {
				v.vote.forEach((opt) => {
					counts[nominee?.name || opt] =
						(counts[nominee?.name || opt] || 0) + (v.weight || 1);
				});
			} else {
				counts[nominee?.name || v.vote] =
					(counts[nominee?.name || v.vote] || 0) + (v.weight || 1);
			}
		});

		return counts;
	}, [votes, nominations]);

	const topNominees = useMemo(() => {
		return Object.entries(nomineeCounts)
			.map(([option, count]) => ({ option, count: count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	}, [nomineeCounts]);

	const winningNominee = useMemo(() => {
		if (!thread || thread.status?.toLowerCase() !== "closed" || !topNominees.length) {
			return null;
		}

		return topNominees[0].option;
	}, [thread, topNominees]);

	const consensus = useMemo(() => {
		const total = Object.values(nomineeCounts).reduce((a, b) => a + b, 0);
		const maxVotes = Math.max(...Object.values(nomineeCounts), 0);
		const agreement = total ? (maxVotes / total) * 100 : 0;
		const engagement = thread?.voteOptions?.length
			? (total / thread.voteOptions.length) * 100
			: 0;
		const reached = agreement >= 70 && engagement >= 50;

		return {
			agreement,
			engagement,
			reached,
			yesVotes: nomineeCounts["yes"] || 0,
			noVotes: nomineeCounts["no"] || 0,
			totalVotes: total,
		};
	}, [nomineeCounts, thread]);

	const recentComments = useMemo(
		() =>
			comments
				.slice()
				.sort(
					(a, b) =>
						new Date(b.created_at || "").getTime() -
						new Date(a.created_at || "").getTime(),
				)
				.slice(0, 5),
		[comments],
	);

	const recentVotes = useMemo(
		() =>
			votes
				.slice()
				.sort(
					(a, b) =>
						new Date(b.created_at || "").getTime() -
						new Date(a.created_at || "").getTime(),
				)
				.slice(0, 5),
		[votes],
	);

	return {
		thread,
		votes,
		comments,
		totalVotes,
		totalComments,
		uniqueVoters,
		uniqueCommenters,
		engagementScore,
		consensus,
		recentComments,
		recentVotes,
		topNominees,
		winningNominee,
		loading,
		error,
	};
}
