import { motion } from "framer-motion";
import { Tooltip, Card } from "@heroui/react";
import { StarIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { MessageCircleMore, Vote } from "lucide-react";

const metricCards = [
	{
		label: "Votes",
		icon: <Vote className="h-6 w-6 text-primary" />,
		color: "primary",
		key: "totalVotes",
		tooltip: "Total number of votes cast on this thread.",
	},
	{
		label: "Comments",
		icon: <MessageCircleMore className="h-6 w-6 text-secondary" />,
		color: "secondary",
		key: "totalComments",
		tooltip: "Total number of comments posted.",
	},
	{
		label: "Unique Voters",
		icon: <UserGroupIcon className="h-6 w-6 text-success" />,
		color: "success",
		key: "uniqueVoters",
		tooltip: "Number of distinct users who voted.",
	},
	{
		label: "Unique Commenters",
		icon: <MessageCircleMore className="h-6 w-6 text-warning" />,
		color: "warning",
		key: "uniqueCommenters",
		tooltip: "Number of distinct users who commented.",
	},
	{
		label: "Engagement",
		icon: <StarIcon className="h-6 w-6 text-info" />,
		color: "info",
		key: "engagementScore",
		tooltip: "Engagement score: (votes + comments) / members.",
		suffix: "%",
	},
	{
		label: "Consensus",
		icon: <ChartBarIcon className="h-6 w-6 text-primary" />,
		color: "primary",
		key: "consensus",
		tooltip: "Consensus percentage (agreement).",
		suffix: "%",
	},
];

export default function ThreadMetricsGrid({ metrics }: { metrics: any }) {
	const { engagementScore, consensus } = metrics;

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0, y: 40 },
				visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
			}}
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
			{metricCards.map((card) => (
				<motion.div
					key={card.label}
					whileInView={"visible"}
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					}}>
					<Tooltip content={card.tooltip}>
						<Card
							className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl shadow-lg bg-gradient-to-br from-${card.color}/20 to-background/20 border-0`}>
							{card.icon}
							<span className="text-md font-semibold">{card.label}</span>
							<span className={`text-2xl font-bold text-${card.color}`}>
								{card.key === "consensus"
									? consensus.agreement.toFixed(1) + (card.suffix || "")
									: card.key === "engagementScore"
										? engagementScore + (card.suffix || "")
										: typeof metrics[card.key as keyof typeof metrics] ===
													"number" ||
											  typeof metrics[card.key as keyof typeof metrics] ===
													"string"
											? String(metrics[card.key as keyof typeof metrics])
											: ""}
							</span>
						</Card>
					</Tooltip>
				</motion.div>
			))}
		</motion.div>
	);
}
