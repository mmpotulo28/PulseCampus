import { Card } from "@heroui/react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip as ChartTooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const COLORS = ["#6366f1", "#f59e42"];

export interface ThreadInsightsProps {
	yesVotes: number;
	noVotes: number;
	totalMembers: number;
}

export default function ThreadInsights({ yesVotes, noVotes, totalMembers }: ThreadInsightsProps) {
	const data = [
		{ name: "Yes", value: yesVotes },
		{ name: "No", value: noVotes },
	];
	const engagement = Math.round(((yesVotes + noVotes) / totalMembers) * 100);

	return (
		<Card className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:bg-zinc-800 flex flex-col gap-6 border-2 border-primary/20">
			<h3 className="text-lg font-bold mb-2 flex items-center gap-2">
				<ChartBarIcon className="h-6 w-6 text-primary" />
				Thread Insights
			</h3>
			<div className="flex flex-col gap-4">
				<div>
					<span className="font-semibold">Engagement:</span>
					<span className="ml-2 text-primary text-lg">{engagement}%</span>
				</div>
				<div>
					<span className="font-semibold">Vote Distribution:</span>
					<div className="h-40 w-full">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									label
									cx="50%"
									cy="50%"
									data={data}
									dataKey="value"
									nameKey="name"
									outerRadius={60}>
									{data.map((_entry, idx) => (
										<Cell
											key={`cell-${idx}`}
											fill={COLORS[idx % COLORS.length]}
										/>
									))}
								</Pie>
								<ChartTooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div>
					<span className="font-semibold">Votes Over Time:</span>
					{/* Dummy time series data */}
					<div className="h-32 w-full">
						<ResponsiveContainer>
							<BarChart
								data={[
									{
										name: "Day 1",
										Yes: Math.round(yesVotes * 0.3),
										No: Math.round(noVotes * 0.2),
									},
									{
										name: "Day 2",
										Yes: Math.round(yesVotes * 0.5),
										No: Math.round(noVotes * 0.5),
									},
									{ name: "Day 3", Yes: yesVotes, No: noVotes },
								]}>
								<XAxis dataKey="name" />
								<YAxis />
								<Bar dataKey="Yes" fill="#6366f1" />
								<Bar dataKey="No" fill="#f59e42" />
								<ChartTooltip />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</Card>
	);
}
