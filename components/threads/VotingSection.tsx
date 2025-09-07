import type { INomination, IThread, IVoteWithCounts } from "@/types";

import { Card, Divider, Progress } from "@heroui/react";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import MultipleVoteInsights from "./MultipleVoteInsights";

import VoteCard from "@/components/threads/VoteCard";
import MultipleVoteCard from "@/components/threads/MultipleVoteCard";

interface VotingSectionProps {
  thread: IThread;
  votes: IVoteWithCounts;
  nominations?: INomination[];
}

export default function VotingSection({
  thread,
  votes,
  nominations,
}: VotingSectionProps) {
  const totalVotes = Object.values(votes.voteCounts).reduce((a, b) => a + b, 0);
  const isMCQ = thread.vote_type === "mcq";

  console.log("VotingSection votes:", isMCQ);

  return (
    <Card className="p-6 rounded-2xl shadow-lg bg-background flex flex-col gap-6 border border-secondary/20 mt-6">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <ChartBarIcon className="h-6 w-6 text-primary" />
        Vote on this Proposal
      </h2>
      <div className="flex gap-4 mt-2">
        {isMCQ ? (
          <MultipleVoteCard thread={thread} />
        ) : (
          <VoteCard thread={thread} />
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-default-500">
        <span className="rounded-full w-2 h-2 bg-success inline-block" />
        <span>Real-time results</span>
      </div>
      <div className="mt-2 text-xs text-default-600">
        {isMCQ && thread.voteOptions
          ? thread.voteOptions.map((opt) => (
              <span key={opt.id} className="mr-2">
                {opt.label}: {votes.voteCounts[opt.id] || 0}
              </span>
            ))
          : `Yes: ${votes.voteCounts["yes"] || 0} | No: ${votes.voteCounts["no"] || 0}`}
      </div>
      <Divider className="my-2" />
      {!isMCQ && (
        <div>
          <Progress
            className="mb-2"
            color="primary"
            label="Yes votes"
            value={
              totalVotes
                ? Math.round((votes.voteCounts.yes / totalVotes) * 100)
                : 0
            }
          />
          <Progress
            className="mb-2"
            color="secondary"
            label="No votes"
            value={
              totalVotes
                ? Math.round((votes.voteCounts.no / totalVotes) * 100)
                : 0
            }
          />
        </div>
      )}
      {isMCQ && nominations && (
        <MultipleVoteInsights nominations={nominations} votes={votes} />
      )}
    </Card>
  );
}
