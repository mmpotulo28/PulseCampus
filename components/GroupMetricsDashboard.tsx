import { Card, Chip, Spinner } from "@heroui/react";
import { useMemo } from "react";
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
import type { IThread } from "@/types";
import {
	UserGroupIcon,
	ChatBubbleLeftRightIcon,
	StarIcon,
	ArrowTrendingUpIcon,
	ClockIcon,
} from "@heroicons/react/24/solid";
import { FaRegCommentDots, FaVoteYea } from "react-icons/fa";
import { useGroupMetrics } from "@/hooks/useGroupMetrics";

const COLORS = ["#6366f1", "#f59e42", "#17c964", "#06b6d4", "#ef4444"];

const StatsCard = ({
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
function StatCards({
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

// --- VoteDistributionChart ---
function VoteDistributionChart({
	voteDistribution,
}: {
	voteDistribution: { name: string; value: number }[];
}) {
	return (
		<Card shadow="lg" className="p-4 flex flex-col items-center bg-default-50">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<FaVoteYea className="h-5 w-5 text-primary" /> Vote vs Comment Distribution
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
								<Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
function VotingHeatmapChart({ heatmapData }: { heatmapData: { day: string; count: number }[] }) {
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

// --- TopThreadsList ---
function TopThreadsList({ topThreads }: { topThreads: (IThread & { voteCount: number })[] }) {
	return (
		<Card className="p-4 bg-gradient-to-br from-success/20 to-background/80 border-0 shadow">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-5 w-5 text-success" /> Top Threads
			</span>
			<ul className="mt-2 space-y-2">
				{topThreads.map((t) => (
					<li key={t.id} className="flex items-center gap-2">
						<Chip color="primary" size="sm" variant="flat">
							{t.title}
						</Chip>
						<span className="text-xs text-default-400">{t.voteCount} votes</span>
					</li>
				))}
			</ul>
		</Card>
	);
}

// --- RecentActivityTimeline ---
function RecentActivityTimeline({ recentComments }: { recentComments: any[] }) {
	return (
		<Card className="p-4 bg-gradient-to-br from-primary/20 to-background/80 border-0 shadow">
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
							{c.created_at ? new Date(c.created_at).toLocaleString() : ""}
						</span>
					</li>
				))}
			</ul>
		</Card>
	);
}

// --- Main Dashboard ---
function GroupMetricsDashboard({ groupId }: { groupId: string }) {
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

	// Memoized derived data
	const heatmapData = useMemo(
		() =>
			Object.entries(heatmap || {}).map(([day, count]) => ({
				day,
				count,
			})),
		[heatmap],
	);

	const voteDistribution = useMemo(
		() => [
			{ name: "Votes", value: votes ? votes.length : 0 },
			{ name: "Comments", value: comments ? comments.length : 0 },
		],
		[votes, comments],
	);

	const totalVotes = votes?.length || 0;
	const totalComments = comments?.length || 0;
	const avgVotesPerThread = threads.length > 0 ? (totalVotes / threads.length).toFixed(2) : "0";
	const topVotedThread = useMemo(() => {
		return threads.length > 0
			? threads.reduce<{ thread: IThread | null; count: number }>(
					(max, t) => {
						const count = votes?.filter((v) => v.thread_id === t.id).length || 0;
						return count > max.count ? { thread: t, count } : max;
					},
					{ thread: null, count: 0 },
				)
			: { thread: null, count: 0 };
	}, [threads, votes]);

	const commenterCounts = useMemo(() => {
		return (
			comments?.reduce(
				(acc, c) => {
					acc[c.user_id] = (acc[c.user_id] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			) || {}
		);
	}, [comments]);
	const mostActiveCommenterId = useMemo(
		() =>
			Object.keys(commenterCounts).reduce((maxId, id) => {
				return commenterCounts[id] > (commenterCounts[maxId] || 0) ? id : maxId;
			}, ""),
		[commenterCounts],
	);
	const mostActiveCommenterCount = commenterCounts[mostActiveCommenterId] || 0;

	return (
		<div className="flex flex-col gap-8">
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner size="sm" color="secondary" />
					<span>Loading metrics...</span>
				</div>
			) : error ? (
				<div className="text-danger text-sm">{error}</div>
			) : (
				<StatCards
					activeMembers={activeMembers}
					threadsCount={threads.length}
					totalComments={totalComments}
					mostActiveCommenterId={mostActiveCommenterId}
					mostActiveCommenterCount={mostActiveCommenterCount}
					pulseScore={pulseScore}
					avgVotesPerThread={avgVotesPerThread}
					topVotedThread={topVotedThread}
				/>
			)}

			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<VoteDistributionChart voteDistribution={voteDistribution} />
					<VotingHeatmapChart heatmapData={heatmapData} />
				</div>
			)}
			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
					<TopThreadsList topThreads={topThreads} />
					<RecentActivityTimeline recentComments={recentComments} />
				</div>
			)}
		</div>
	);
}

export default GroupMetricsDashboard;
