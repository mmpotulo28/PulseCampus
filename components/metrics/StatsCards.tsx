import { IThread } from "@/types";
import { UserGroupIcon, ChatBubbleLeftRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import { FaRegCommentDots } from "react-icons/fa";

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
		shadow="lg"
		radius="md">
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
	mostActiveCommenterId,
	mostActiveCommenterCount,
	pulseScore,
	avgVotesPerThread,
	topVotedThread,
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
				label="Active Members"
				value={activeMembers}
				icon={<UserGroupIcon className="h-8 w-8 text-danger" />}
			/>

			<StatsCard
				color="secondary"
				label="Threads"
				value={threadsCount}
				icon={<ChatBubbleLeftRightIcon className="h-8 w-8 text-secondary" />}
			/>

			<StatsCard
				color="warning"
				label="Total Comments"
				value={totalComments}
				icon={<FaRegCommentDots className="h-8 w-8 text-warning" />}
			/>

			<StatsCard
				color="primary"
				label="Pulse Score"
				value={`${pulseScore}%`}
				icon={<StarIcon className="h-8 w-8 text-primary" />}
				subtext={`Avg votes/thread: ${avgVotesPerThread}`}
			/>
		</div>
	);
}
