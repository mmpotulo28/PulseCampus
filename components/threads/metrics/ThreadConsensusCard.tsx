import { Card } from "@heroui/react";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function ThreadConsensusCard({ consensus }: { consensus: any }) {
	return (
		<Card className="mb-6 p-6 rounded-xl shadow bg-gradient-to-br from-primary/5 to-background/80 border-0">
			<div className="flex flex-wrap gap-4 items-center justify-between">
				<div className="flex gap-2 items-center">
					<ChartBarIcon className="h-5 w-5 text-primary" />
					<span className="font-semibold">Consensus reached:</span>
					<span
						className={`font-bold ${consensus.reached ? "text-success" : "text-danger"}`}>
						{consensus.reached ? "Yes" : "No"}
					</span>
				</div>
				<div className="flex gap-4 text-xs text-default-400">
					<span>Yes votes: {consensus.yesVotes}</span>
					<span>No votes: {consensus.noVotes}</span>
					<span>Total votes: {consensus.totalVotes}</span>
				</div>
			</div>
		</Card>
	);
}
