import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { IThread, IUser } from "@/types";

// Setup your Supabase client
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	{
		db: {
			schema: "pulse",
		},
	},
);

export type VotingType = "yesno" | "multiple" | "ranked";

export interface VoteOption {
	id: string;
	label: string;
}

export interface UseVotingOptions {
	threadId: string;
	user: IUser;
	votingType: VotingType;
	options?: VoteOption[]; // for multiple/ranked
	anonymous?: boolean;
	weighted?: boolean;
}

export function useVoting({
	threadId,
	user,
	votingType,
	options = [
		{ id: "yes", label: "Yes" },
		{ id: "no", label: "No" },
	],
	anonymous = false,
	weighted = false,
}: UseVotingOptions) {
	const [votes, setVotes] = useState<Record<string, number>>({});
	const [userVote, setUserVote] = useState<string | string[] | null>(null);

	// Fetch votes states
	const [votingFetchLoading, setVotingFetchLoading] = useState(false);
	const [votingFetchMessage, setVotingFetchMessage] = useState<string | null>(null);
	const [votingFetchError, setVotingFetchError] = useState<string | null>(null);

	// Create vote states
	const [votingCreateLoading, setVotingCreateLoading] = useState(false);
	const [votingCreateMessage, setVotingCreateMessage] = useState<string | null>(null);
	const [votingCreateError, setVotingCreateError] = useState<string | null>(null);

	const [consensus, setConsensus] = useState<{
		agreement: number;
		engagement: number;
		reached: boolean;
	}>({ agreement: 0, engagement: 0, reached: false });

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
		try {
			const { data, error } = await supabase
				.from("votes")
				.select("*")
				.eq("threadId", threadId);

			if (error) {
				setVotingFetchError(error.message);
				setVotingFetchLoading(false);
				return;
			}

			if (data) {
				const voteCounts: Record<string, number> = {};
				data.forEach((v: any) => {
					const value = weighted ? v.weight || 1 : 1;
					if (Array.isArray(v.vote)) {
						v.vote.forEach((opt: string) => {
							voteCounts[opt] = (voteCounts[opt] || 0) + value;
						});
					} else {
						voteCounts[v.vote] = (voteCounts[v.vote] || 0) + value;
					}
				});
				setVotes(voteCounts);
				// setVotingFetchMessage("Votes fetched successfully.");
			}
		} catch (err: any) {
			console.error(err);
			setVotingFetchError(err.message || "Failed to fetch votes.");
		}
		setVotingFetchLoading(false);
	}, [threadId, weighted]);

	// Fetch votes in real-time
	useEffect(() => {
		fetchVotes();

		const channel = supabase
			.channel("votes")
			.on("postgres_changes", { event: "*", schema: "pulse", table: "votes" }, () => {
				fetchVotes();
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [fetchVotes]);

	// Submit vote
	const submitVote = useCallback(
		async (vote: string | string[]) => {
			setVotingCreateLoading(true);
			setVotingCreateMessage(null);
			setVotingCreateError(null);
			try {
				console.log("Submitting vote:", {
					threadId,
					userId: anonymous ? null : user.id,
					vote,
					weight: weighted ? getUserWeight(user) : 1,
				});
				const payload: any = {
					threadId,
					userId: anonymous ? null : user.id,
					vote,
					weight: weighted ? getUserWeight(user) : 1,
				};
				const { error } = await supabase.from("votes").upsert([payload]);
				if (error) {
					setVotingCreateError(error.message);
				} else {
					setUserVote(vote);
					setVotingCreateMessage("Vote submitted successfully.");
				}
			} catch (err: any) {
				console.error(err);
				setVotingCreateError(err.message || "Failed to submit vote.");
			}
			setVotingCreateLoading(false);
		},
		[threadId, user, anonymous, weighted],
	);

	// Consensus detection
	useEffect(() => {
		const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
		const yesVotes = votes["yes"] || 0;
		const agreement = totalVotes ? (yesVotes / totalVotes) * 100 : 0;
		const engagement = threadId
			? (totalVotes / (options.length > 2 ? options.length : 2)) * 100
			: 0;
		const reached = agreement >= 70 && engagement >= 50;
		setConsensus({ agreement, engagement, reached });
	}, []);

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
function getUserWeight(user: IUser): number {
	switch (user.role) {
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
