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
	const [threadMetrics, setThreadMetrics] = useState<any>({});
	const [loading, setLoading] = useState(true);

	// swr fetcher
	const fetcher = async (url: string) => {
		const { data } = await axios.get(url, {
			params: { threadId: threadId },
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
			setThreadMetrics(threadMetricsData.metrics || {});
		}
		setLoading(false);
	}, [threadMetricsData]);

	const totalVotes = votes.length;
	const totalComments = comments.length;
	const uniqueVoters = useMemo(() => new Set(votes.map((v) => v.userId)).size, [votes]);
	const uniqueCommenters = useMemo(() => new Set(comments.map((c) => c.userId)).size, [comments]);

	const engagementScore = useMemo(() => {
		const members = thread?.totalMembers || 1;

		return Math.round(((totalVotes + totalComments) / members) * 100);
	}, [totalVotes, totalComments, thread]);

	return {
		thread,
		votes,
		comments,
		nominations,
		totalVotes,
		totalComments,
		uniqueVoters,
		uniqueCommenters,
		engagementScore,
		...threadMetrics,
		loading,
		error,
	};
}
