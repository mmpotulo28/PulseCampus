import type { IThread } from "@/types";

import { useMemo } from "react";
import { Spinner } from "@heroui/react";

import { RecentActivityTimeline } from "./metrics/RecentActivity";
import { StatCards } from "./metrics/StatsCards";
import { TopThreadsList } from "./metrics/TopThreads";
import {
  VoteDistributionChart,
  VotingHeatmapChart,
} from "./metrics/VotingDistributionCharts";

import { useGroupMetrics } from "@/hooks/useGroupMetrics";

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
  const avgVotesPerThread =
    threads.length > 0 ? (totalVotes / threads.length).toFixed(2) : "0";
  const topVotedThread = useMemo(() => {
    return threads.length > 0
      ? threads.reduce<{ thread: IThread | null; count: number }>(
          (max, t) => {
            const count =
              votes?.filter((v) => v.thread_id === t.id).length || 0;

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
          <Spinner color="secondary" size="sm" />
          <span>Loading metrics...</span>
        </div>
      ) : error ? (
        <div className="text-danger text-sm">{error}</div>
      ) : (
        <StatCards
          activeMembers={activeMembers}
          avgVotesPerThread={avgVotesPerThread}
          mostActiveCommenterCount={mostActiveCommenterCount}
          mostActiveCommenterId={mostActiveCommenterId}
          pulseScore={pulseScore}
          threadsCount={threads.length}
          topVotedThread={topVotedThread}
          totalComments={totalComments}
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
