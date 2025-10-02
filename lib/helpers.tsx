/** consensus interface
 * 	agreement: number;
	engagement: number;
	reached: boolean;
	yesVotes: number;
	noVotes: number;
	totalVotes: number;
 */

import { IConsensus, INomination, IVote } from "@/types";

export const calculateVoteCounts = (votes: IVote[]): Record<string, number> => {
	const voteCounts: Record<string, number> = {};

	votes.forEach((v) => {
		voteCounts[v.vote] = (voteCounts[v.vote] || 0) + 1;
	});

	return voteCounts;
};

export const calculateYNConsensus = (votes?: IVote[], nominations?: INomination[]): IConsensus => {
	const yesVotes = votes?.filter((v) => v.vote === "yes").length || 0;
	const noVotes = votes?.filter((v) => v.vote === "no").length || 0;

	const totalVotes = yesVotes + noVotes;
	const agreement = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
	const engagement = totalVotes > 0 ? (totalVotes / (nominations?.length || 0)) * 100 : 0;
	const reached = agreement >= 50;

	return {
		agreement,
		engagement,
		reached,
		voteCounts: { yes: yesVotes, no: noVotes },
		totalVotes,
	};
};

export const calculateMCQConsensus = (votes?: IVote[], nominations?: INomination[]): IConsensus => {
	const voteCounts = calculateVoteCounts(votes || []);
	const totalVotes = votes?.length || 0;
	const maxVotes = Math.max(...Object.values(voteCounts), 0);
	const agreement = totalVotes > 0 ? (maxVotes / totalVotes) * 100 : 0;
	const engagement = totalVotes > 0 ? (totalVotes / (nominations?.length || 0)) * 100 : 0;
	const reached = agreement >= 70 && engagement >= 50;

	return {
		agreement,
		engagement,
		reached,
		voteCounts,
		totalVotes,
	};
};
