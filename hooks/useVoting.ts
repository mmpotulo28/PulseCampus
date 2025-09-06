import { useState, useEffect, useCallback, use } from "react";
import { createClient, REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import type { IConsensus, IUseVotingOptions, IVote, IVoteWithCounts } from "@/types";
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
	const [votes, setVotes] = useState<IVoteWithCounts>({
		votes: [],
		voteCounts: {
			yes: 0,
			no: 0,
		},
	});
	const [userVote, setUserVote] = useState<string | string[] | null>(null);

	// Fetch votes states
	const [votingFetchLoading, setVotingFetchLoading] = useState(false);
	const [votingFetchMessage, setVotingFetchMessage] = useState<string | null>(null);
	const [votingFetchError, setVotingFetchError] = useState<string | null>(null);

	// Create vote states
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
				console.error("Supabase fetch error:", error); // Added for debugging
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
			console.error("FetchVotes exception:", err); // Added for debugging
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
					(payload) => {
						console.log(
							"Votes changed, refetching...",
							JSON.stringify(payload, null, 2),
						);
						fetchVotes();
					},
				)
				.subscribe();

			console.log("Subscribed to votes channel:", channel);
		} catch (error) {
			console.error("Error subscribing to votes channel:", error);
		}

		return () => {
			if (channel) {
				channel.unsubscribe();
				console.log("Unsubscribed from votes channel");
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
				console.log("Submitting vote:", payload);

				const { error } = await supabase.from("votes").upsert([payload]);
				if (error) {
					console.error("Supabase submit error:", error); // Added for debugging
					setVotingCreateError(error.message || "errored");
				} else {
					setUserVote(vote);
					setVotingCreateMessage("Vote submitted successfully.");
				}

				// fetchVotes();
			} catch (err: any) {
				console.error("SubmitVote exception:", err); // Added for debugging
				setVotingCreateError(err.message || "errored");
			}
			setVotingCreateLoading(false);
		},
		[thread_id, user, anonymous, weighted],
	);

	// Consensus detection
	useEffect(() => {
		const totalVotes = Object.values(votes?.voteCounts || {}).reduce((a, b) => a + b, 0);
		const yesVotes = (votes?.voteCounts && votes?.voteCounts["yes"]) || 0;
		const noVotes = (votes?.voteCounts && votes?.voteCounts["no"]) || 0;
		const agreement = totalVotes ? (yesVotes / totalVotes) * 100 : 0;
		const engagement = thread_id
			? (totalVotes / (options.length > 2 ? options.length : 2)) * 100
			: 0;
		const reached = agreement >= 70 && engagement >= 50;
		setConsensus({ agreement, engagement, reached, yesVotes, noVotes, totalVotes });
	}, [votes?.voteCounts, thread_id, votes.votes]);

	return {
		votes,
		userVote,
		submitVote,
		consensus,
		// Fetch votes states
		votingFetchLoading,
		votingFetchMessage,
		votingFetchError,
		// Create vote states
		votingCreateLoading,
		votingCreateMessage,
		votingCreateError,
	};
}

// Example weighted voting logic (role-based)
function getUserWeight(user: any): number {
	switch (user.publicMetadata?.role) {
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
