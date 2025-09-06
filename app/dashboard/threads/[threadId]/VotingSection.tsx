import { Card, Divider, Progress, Button } from "@heroui/react";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import type { IThread, IVoteWithCounts } from "@/types";
import VoteCard from "@/components/VoteCard";

interface VotingSectionProps {
	thread: IThread;
	votes: IVoteWithCounts;
}

export default function VotingSection({ thread, votes }: VotingSectionProps) {
	const totalVotes = votes.voteCounts.yes + votes.voteCounts.no;
	return (
		<Card className="p-6 rounded-2xl shadow-lg bg-background dark:bg-zinc-900 flex flex-col gap-6 border border-secondary/20 mt-6">
			<h2 className="text-lg font-bold mb-2 flex items-center gap-2">
				<ChartBarIcon className="h-6 w-6 text-primary" />
				Vote on this Proposal
			</h2>
			<div className="flex gap-4 mt-2">
				<VoteCard thread={thread} />
			</div>
			<div className="mt-4 flex items-center gap-2 text-xs text-default-500">
				<span className="rounded-full w-2 h-2 bg-success inline-block" />
				<span>Real-time results</span>
			</div>
			<div className="mt-2 text-xs text-default-600">
				Yes: {votes.voteCounts["yes"] || 0} | No: {votes.voteCounts["no"] || 0}
			</div>
			<Divider className="my-2" />
			<div>
				<Progress
					value={totalVotes ? Math.round((votes.voteCounts.yes / totalVotes) * 100) : 0}
					label="Yes votes"
					className="mb-2"
					color="primary"
				/>
				<Progress
					value={totalVotes ? Math.round((votes.voteCounts.no / totalVotes) * 100) : 0}
					label="No votes"
					className="mb-2"
					color="secondary"
				/>
			</div>
		</Card>
	);
}
