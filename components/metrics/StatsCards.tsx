import { UserGroupIcon, ChatBubbleLeftRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import { FaRegCommentDots } from "react-icons/fa";

import { IThread } from "@/types";

export const StatsCard = ({
	icon,
	label,
	value,
	subtext,
	color = "primary",
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	subtext?: string;
	color?: string;
}) => (
	<Card
		className={`flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-${color}/20 to-background/80 shadow shadow-${color}-500`}
		radius="md"
		shadow="lg">
		{icon}
		<span className="text-lg font-semibold">{label}</span>
		<span className={`text-3xl font-bold text-${color}`}>{value}</span>
		{subtext && <span className="text-xs text-default-400">{subtext}</span>}
	</Card>
);

// --- StatCards ---
export function StatCards({
	activeMembers,
	threadsCount,
	totalComments,
	pulseScore,
	avgVotesPerThread,
}: {
	activeMembers: number;
	threadsCount: number;
	totalComments: number;
	mostActiveCommenterId: string;
	mostActiveCommenterCount: number;
	pulseScore: number;
	avgVotesPerThread: string;
	topVotedThread: { thread: IThread | null; count: number };
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<StatsCard
				color="primary"
				icon={<UserGroupIcon className="h-8 w-8 text-danger" />}
				label="Active Members"
				value={activeMembers}
			/>

			<StatsCard
				color="secondary"
				icon={<ChatBubbleLeftRightIcon className="h-8 w-8 text-secondary" />}
				label="Threads"
				value={threadsCount}
			/>

			<StatsCard
				color="warning"
				icon={<FaRegCommentDots className="h-8 w-8 text-warning" />}
				label="Total Comments"
				value={totalComments}
			/>

			<StatsCard
				color="primary"
				icon={<StarIcon className="h-8 w-8 text-primary" />}
				label="Pulse Score"
				subtext={`Avg votes/thread: ${avgVotesPerThread}`}
				value={`${pulseScore}%`}
			/>
		</div>
	);
}
