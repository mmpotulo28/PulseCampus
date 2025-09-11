import { Spinner } from "@heroui/react";

import { RecentActivityTimeline } from "./metrics/RecentActivity";
import { StatCards } from "./metrics/StatsCards";
import { TopThreadsList } from "./metrics/TopThreads";
import { VoteDistributionChart, VotingHeatmapChart } from "./metrics/VotingDistributionCharts";

import { useGroupMetrics } from "@/hooks/useGroupMetrics";

// --- Main Dashboard ---
function GroupMetricsDashboard({ groupId }: { groupId: string }) {
	const metrics = useGroupMetrics(groupId);
	const {
		loading,
		error,
		pulseScore,
		activeMembers,
		topThreads,
		recentComments,
		threads,
		voteDistribution,
		heatmapData,
		avgVotesPerThread,
		mostActiveCommenterId,
		mostActiveCommenterCount,
		totalComments,
		topVotedThread,
	} = metrics;

	return (
		<div className="flex flex-col gap-8">
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading metrics...</span>
				</div>
			) : error ? (
				<div className="text-danger text-sm">{error}</div>
			) : (
				<StatCards
					activeMembers={activeMembers}
					avgVotesPerThread={avgVotesPerThread || "0"}
					mostActiveCommenterCount={mostActiveCommenterCount || 0}
					mostActiveCommenterId={mostActiveCommenterId || ""}
					pulseScore={pulseScore}
					threadsCount={threads.length}
					topVotedThread={topVotedThread || { thread: null, count: 0 }}
					totalComments={totalComments || 0}
				/>
			)}

			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<VoteDistributionChart voteDistribution={voteDistribution || []} />
					<VotingHeatmapChart heatmapData={heatmapData || []} />
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
