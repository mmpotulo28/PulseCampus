import { Card } from "@heroui/react";
import ThreadInsights from "@/components/ThreadInsights";
import type { IVoteWithCounts, IThread } from "@/types";

interface InsightsPanelProps {
	votes: IVoteWithCounts;
	thread: IThread;
}

export default function InsightsPanel({ votes, thread }: InsightsPanelProps) {
	return (
		<ThreadInsights
			yesVotes={votes?.voteCounts.yes}
			noVotes={votes?.voteCounts.no}
			totalMembers={thread?.totalMembers || 0}
		/>
	);
}
