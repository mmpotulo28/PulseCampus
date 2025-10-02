import type { IConsensus, IUseVotingOptions, IVoteWithCounts, IVoteOption } from "@/types";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useVoting({
	threadId,
	options = [
		{ id: "yes", label: "Yes" },
		{ id: "no", label: "No" },
	],
	weighted = false,
}: IUseVotingOptions) {
	const [voteOptions, setVoteOptions] = useState<IVoteOption[]>(options);
	const [votes, setVotes] = useState<IVoteWithCounts>({
		votes: [],
		voteCounts: {},
	});
	const [userVote, setUserVote] = useState<string | string[] | null>(null);

	const [votingFetchLoading, setVotingFetchLoading] = useState(false);
	const [votingFetchMessage, setVotingFetchMessage] = useState<string | null>(null);
	const [votingFetchError, setVotingFetchError] = useState<string | null>(null);

	const [votingCreateLoading, setVotingCreateLoading] = useState(false);
	const [votingCreateMessage, setVotingCreateMessage] = useState<string | null>(null);
	const [votingCreateError, setVotingCreateError] = useState<string | null>(null);

	const [consensus, setConsensus] = useState<IConsensus>({
		agreement: 0,
		engagement: 0,
		reached: false,
		voteCounts: { yes: 0, no: 0 },
		totalVotes: 0,
	});

	// clear all messages and errors after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setVotingFetchMessage(null);
			setVotingFetchError(null);
			setVotingCreateMessage(null);
			setVotingCreateError(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	const fetchVotes = useCallback(async () => {
		setVotingFetchLoading(true);
		setVotingFetchMessage(null);
		setVotingFetchError(null);

		if (!threadId) {
			setVotes({ votes: [], voteCounts: {} });
			setVotingFetchLoading(false);
			setVotingFetchError("No threadId provided");

			return;
		}

		try {
			const { data } = await axios.get(`/api/votes`, {
				params: { threadId },
			});

			const voteCounts: Record<string, number> = {};

			data.votes.forEach((v: any) => {
				const value = weighted ? v.weight || 1 : 1;

				if (Array.isArray(v.vote)) {
					v.vote.forEach((opt: string) => {
						voteCounts[opt] = (voteCounts[opt] || 0) + value;
					});
				} else {
					voteCounts[v.vote] = (voteCounts[v.vote] || 0) + value;
				}
			});

			setVotes({ votes: data.votes, voteCounts });
		} catch (err: any) {
			setVotingFetchError(err.response?.data?.error || "Failed to fetch votes");
		}
		setVotingFetchLoading(false);
	}, [threadId, weighted]);

	useEffect(() => {
		if (threadId) {
			fetchVotes();
		}
	}, [threadId, fetchVotes]);

	const submitVote = useCallback(
		async (vote: string | string[]) => {
			setVotingCreateLoading(true);
			setVotingCreateMessage(null);
			setVotingCreateError(null);

			try {
				if (!threadId) throw new Error("Thread ID is required.");

				await axios.post("/api/votes", {
					threadId,
					vote,
					weight: weighted ? 1 : undefined,
				});

				setUserVote(vote);
				setVotingCreateMessage("Vote submitted successfully.");
			} catch (err: any) {
				setVotingCreateError(err.response?.data?.error || "Failed to submit vote");
			}
			setVotingCreateLoading(false);
		},
		[threadId, weighted],
	);

	useEffect(() => {
		const totalVotes = Object.values(votes?.voteCounts || {}).reduce((a, b) => a + b, 0);
		const yesVotes = votes?.voteCounts["yes"] || 0;
		const noVotes = votes?.voteCounts["no"] || 0;
		const maxVotes = Math.max(...Object.values(votes?.voteCounts || {}), 0);
		const agreement = totalVotes ? (maxVotes / totalVotes) * 100 : 0;
		const engagement = threadId ? (totalVotes / (voteOptions.length || 1)) * 100 : 0;
		const reached = agreement >= 70 && engagement >= 50;

		setConsensus({
			agreement,
			engagement,
			reached,
			voteCounts: { yes: yesVotes, no: noVotes },
			totalVotes,
		});
	}, [votes?.voteCounts, threadId, votes.votes, voteOptions.length]);

	return {
		votes,
		userVote,
		submitVote,
		consensus,
		voteOptions,
		setVoteOptions,
		votingFetchLoading,
		votingFetchMessage,
		votingFetchError,
		votingCreateLoading,
		votingCreateMessage,
		votingCreateError,
	};
}
