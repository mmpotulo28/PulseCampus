import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
	BarChart,
	XAxis,
	YAxis,
	Bar,
} from "recharts";

import { GRAPH_COLORS } from "@/lib/colors";
import { Vote } from "lucide-react";

// --- VoteDistributionChart ---
export function VoteDistributionChart({
	voteDistribution,
}: {
	voteDistribution: { name: string; value: number }[];
}) {
	return (
		<Card className="p-4 flex flex-col items-center bg-default-50" shadow="lg">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<Vote className="h-5 w-5 text-primary" /> Vote vs Comment Distribution
			</span>
			<div className="h-48 w-full">
				<ResponsiveContainer>
					<PieChart>
						<Pie
							label
							cx="50%"
							cy="50%"
							data={voteDistribution}
							dataKey="value"
							nameKey="name"
							outerRadius={70}>
							{voteDistribution.map((_, idx) => (
								<Cell
									key={`cell-${idx}`}
									fill={GRAPH_COLORS[idx % GRAPH_COLORS.length]}
								/>
							))}
						</Pie>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}

// --- VotingHeatmapChart ---
export function VotingHeatmapChart({
	heatmapData,
}: {
	heatmapData: { day: string; count: number }[];
}) {
	return (
		<Card className="p-4 flex flex-col items-center bg-default-50">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<ArrowTrendingUpIcon className="h-5 w-5 text-secondary" /> Voting Activity Heatmap
			</span>
			<div className="h-48 w-full">
				<ResponsiveContainer>
					<BarChart data={heatmapData}>
						<XAxis dataKey="day" />
						<YAxis />
						<Bar dataKey="count" fill="#6366f1" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
