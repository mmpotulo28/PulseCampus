import { useState, useEffect, useCallback } from "react";
import { createClient, REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import type { IConsensus, IUseVotingOptions, IVote, IVoteWithCounts, IVoteOption } from "@/types";
import { useUser } from "@clerk/nextjs";
import supabase from "@/lib/db";

export function useVoting({
	thread_id,
	options = [
		{ id: "yes", label: "Yes" },
		{ id: "no", label: "No" },
	],
	anonymous = false,
	weighted = false,
}: IUseVotingOptions) {
	const { user } = useUser();
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
		yesVotes: 0,
		noVotes: 0,
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

	// Stable fetchVotes function
	const fetchVotes = useCallback(async () => {
		setVotingFetchLoading(true);
		setVotingFetchMessage(null);
		setVotingFetchError(null);

		if (!thread_id) {
			setVotes({ votes: [], voteCounts: {} });
			setVotingFetchLoading(false);
			setVotingFetchError("No thread_id provided");
			return;
		}

		try {
			const { data, error } = (await supabase
				.from("votes")
				.select("*")
				.eq("thread_id", thread_id)) as { data: IVote[] | null; error: any };

			if (error) {
				setVotingFetchError(error.message || "errored");
				setVotingFetchLoading(false);
				return;
			}

			if (data) {
				// Process votes
				const voteCounts: Record<string, number> = {};
				data.forEach((v: IVote) => {
					const value = weighted ? v.weight || 1 : 1;
					if (Array.isArray(v.vote)) {
						v.vote.forEach((opt: string) => {
							voteCounts[opt] = (voteCounts[opt] || 0) + value;
						});
					} else {
						voteCounts[v.vote] = (voteCounts[v.vote] || 0) + value;
					}
				});

				setVotes({ votes: data, voteCounts });
				// setVotingFetchMessage("Votes fetched successfully.");
			}
		} catch (err: any) {
			setVotingFetchError(err.message || "errored");
		}
		setVotingFetchLoading(false);
	}, [thread_id, weighted]);

	useEffect(() => {
		if (thread_id && user) {
			fetchVotes();
		}
	}, [thread_id, user, fetchVotes]);

	// Fetch votes in real-time
	useEffect(() => {
		fetchVotes();

		let channel: any;
		try {
			channel = supabase
				.channel("public:votes", {
					config: {
						presence: {
							enabled: true,
							key: user?.id || "anonymous",
						},
					},
				})
				.on(
					REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
					{
						event: "*",
						schema: "public",
						table: "votes",
					},
					() => {
						fetchVotes();
					},
				)
				.subscribe();
		} catch (error) {
			// ignore
		}

		return () => {
			if (channel) {
				channel.unsubscribe();
			}
		};
	}, []);

	// Submit vote
	const submitVote = useCallback(
		async (vote: string | string[]) => {
			setVotingCreateLoading(true);
			setVotingCreateMessage(null);
			setVotingCreateError(null);

			try {
				if (!thread_id) throw new Error("Thread ID is required.");
				if (!user && !anonymous) throw new Error("User must be logged in to vote.");

				const payload: IVote = {
					thread_id,
					user_id: anonymous ? null : user?.id || null,
					vote,
					weight: weighted ? getUserWeight(user) : 1,
				};

				const { error } = await supabase.from("votes").upsert([payload]);
				if (error) {
					setVotingCreateError(error.message || "errored");
				} else {
					setUserVote(vote);
					setVotingCreateMessage("Vote submitted successfully.");
				}
			} catch (err: any) {
				setVotingCreateError(err.message || "errored");
			}
			setVotingCreateLoading(false);
		},
		[thread_id, user, anonymous, weighted],
	);

	// Consensus detection for MCQ: agreement = max option %; engagement = total votes / options
	useEffect(() => {
		const totalVotes = Object.values(votes?.voteCounts || {}).reduce((a, b) => a + b, 0);
		const yesVotes = votes?.voteCounts["yes"] || 0;
		const noVotes = votes?.voteCounts["no"] || 0;
		const maxVotes = Math.max(...Object.values(votes?.voteCounts || {}), 0);
		const agreement = totalVotes ? (maxVotes / totalVotes) * 100 : 0;
		const engagement = thread_id ? (totalVotes / (voteOptions.length || 1)) * 100 : 0;
		const reached = agreement >= 70 && engagement >= 50;
		setConsensus({ agreement, engagement, reached, yesVotes, noVotes, totalVotes });
	}, [votes?.voteCounts, thread_id, votes.votes, voteOptions.length]);

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

// Example weighted voting logic (role-based)
function getUserWeight(user: any): number {
	switch (user?.publicMetadata?.role) {
		case "President":
		case "Chair":
			return 2;
		case "Treasurer":
		case "Secretary":
			return 1.5;
		default:
			return 1;
	}
}
