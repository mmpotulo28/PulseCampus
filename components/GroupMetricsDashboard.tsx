import { Card, Chip, Divider, Tooltip, Spinner } from "@heroui/react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import {
	UserGroupIcon,
	FireIcon,
	ChatBubbleLeftRightIcon,
	StarIcon,
	ArrowTrendingUpIcon,
	ClockIcon,
} from "@heroicons/react/24/solid";
import { FaRegCommentDots, FaVoteYea } from "react-icons/fa";
import { useGroupMetrics } from "@/hooks/useGroupMetrics";

const COLORS = ["#6366f1", "#f59e42", "#17c964", "#06b6d4", "#ef4444"];

export default function GroupMetricsDashboard({ groupId }: { groupId: string }) {
	const metrics = useGroupMetrics(groupId);
	const {
		loading,
		error,
		pulseScore,
		activeMembers,
		heatmap,
		topThreads,
		recentComments,
		threads,
		votes,
		comments,
	} = metrics;

	const heatmapData = Object.entries(heatmap || {}).map(([day, count]) => ({
		day,
		count,
	}));

	const voteDistribution = [
		{ name: "Votes", value: votes ? votes.length : 0 },
		{ name: "Comments", value: comments ? comments.length : 0 },
	];

	return (
		<Card className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col gap-8 border-2 border-primary/20">
			<h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
				<FireIcon className="h-7 w-7 text-primary" />
				Group Engagement Dashboard
			</h3>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner size="sm" color="secondary" />
					<span>Loading metrics...</span>
				</div>
			) : error ? (
				<div className="text-danger text-sm">{error}</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Stat Cards */}
					<Card className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-primary/20 to-background/80 shadow border-0">
						<UserGroupIcon className="h-8 w-8 text-success" />
						<span className="text-lg font-semibold">Active Members</span>
						<span className="text-3xl font-bold text-success">{activeMembers}</span>
					</Card>
					<Card className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-secondary/20 to-background/80 shadow border-0">
						<ChatBubbleLeftRightIcon className="h-8 w-8 text-secondary" />
						<span className="text-lg font-semibold">Threads</span>
						<span className="text-3xl font-bold text-secondary">{threads.length}</span>
					</Card>
					<Card className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-info/20 to-background/80 shadow border-0">
						<FaRegCommentDots className="h-8 w-8 text-info" />
						<span className="text-lg font-semibold">Comments</span>
						<span className="text-3xl font-bold text-info">{comments.length}</span>
					</Card>
					<Card className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-warning/20 to-background/80 shadow border-0">
						<StarIcon className="h-8 w-8 text-warning" />
						<span className="text-lg font-semibold">Pulse Score</span>
						<span className="text-3xl font-bold text-warning">{pulseScore}%</span>
					</Card>
				</div>
			)}
			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Vote Distribution Pie Chart */}
					<Card className="p-4 flex flex-col items-center bg-gradient-to-br from-primary/10 to-background/80 border-0 shadow">
						<span className="font-semibold mb-2 flex items-center gap-2">
							<FaVoteYea className="h-5 w-5 text-primary" /> Vote vs Comment
							Distribution
						</span>
						<div className="h-48 w-full">
							<ResponsiveContainer>
								<PieChart>
									<Pie
										data={voteDistribution}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={70}
										label>
										{voteDistribution.map((entry, idx) => (
											<Cell
												key={`cell-${idx}`}
												fill={COLORS[idx % COLORS.length]}
											/>
										))}
									</Pie>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</Card>
					{/* Voting Heatmap Bar Chart */}
					<Card className="p-4 flex flex-col items-center bg-gradient-to-br from-secondary/10 to-background/80 border-0 shadow">
						<span className="font-semibold mb-2 flex items-center gap-2">
							<ArrowTrendingUpIcon className="h-5 w-5 text-secondary" /> Voting
							Activity Heatmap
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
				</div>
			)}
			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
					{/* Top Threads */}
					<Card className="p-4 bg-gradient-to-br from-success/10 to-background/80 border-0 shadow">
						<span className="font-semibold mb-2 flex items-center gap-2">
							<ChatBubbleLeftRightIcon className="h-5 w-5 text-success" /> Top Threads
						</span>
						<ul className="mt-2 space-y-2">
							{topThreads.map((t) => (
								<li key={t.id} className="flex items-center gap-2">
									<Chip color="primary" size="sm" variant="flat">
										{t.title}
									</Chip>
									<span className="text-xs text-default-400">
										{t.voteCount} votes
									</span>
								</li>
							))}
						</ul>
					</Card>
					{/* Recent Activity Timeline */}
					<Card className="p-4 bg-gradient-to-br from-info/10 to-background/80 border-0 shadow">
						<span className="font-semibold mb-2 flex items-center gap-2">
							<ClockIcon className="h-5 w-5 text-info" /> Recent Activity
						</span>
						<ul className="mt-2 space-y-2">
							{recentComments.map((c) => (
								<li key={c.id} className="flex items-center gap-2">
									<FaRegCommentDots className="h-4 w-4 text-secondary" />
									<span className="text-xs text-default-400">
										{c.name}: {c.text.slice(0, 40)}...
									</span>
									<span className="text-xs text-default-300 ml-auto">
										{c.created_at
											? new Date(c.created_at).toLocaleString()
											: ""}
									</span>
								</li>
							))}
						</ul>
					</Card>
				</div>
			)}
		</Card>
	);
}
