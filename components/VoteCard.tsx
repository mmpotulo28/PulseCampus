import { Button, Card } from "@heroui/react";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { useVoting } from "@/hooks/useVoting";
import type { IThread } from "@/types";

export interface VoteCardProps {
	thread: IThread;
	disabled?: boolean;
}

export default function VoteCard({ thread, disabled = false }: VoteCardProps) {
	const controls = useAnimation();
	const [paused, setPaused] = useState(false);

	const {
		votes,
		userVote,
		submitVote,
		consensus,
		votingFetchLoading,
		votingFetchMessage,
		votingFetchError,
		votingCreateLoading,
		votingCreateMessage,
		votingCreateError,
	} = useVoting({
		thread_id: thread.id || "",
		anonymous: false,
		weighted: true,
	});

	const handlePause = () => {
		setPaused(true);
		controls.stop();
	};

	const handleResume = () => {
		setPaused(false);
		controls.start({
			rotate: [10, -10, 10],
			transition: {
				repeat: Infinity,
				repeatType: "loop",
				duration: 2,
				ease: "easeInOut",
			},
		});
	};

	return (
		<motion.div
			animate={controls}
			initial={{ rotate: 10 }}
			onMouseEnter={handlePause}
			onMouseLeave={handleResume}
			onFocus={handlePause}
			onBlur={handleResume}
			className="mx-auto origin-top w-full max-w-xs">
			<Card className="p-6 rounded-2xl shadow-xl bg-background border border-primary/20">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="font-bold text-primary">Student Vote</span>
						<span className="bg-primary text-background px-2 py-1 rounded-full text-xs">
							Live
						</span>
					</div>
					<div className="font-semibold text-lg mt-2">{thread.title}</div>
					<div className="flex gap-2 mt-4">
						<Button
							isLoading={votingCreateLoading}
							className="bg-primary text-background rounded-full font-semibold hover:bg-secondary transition"
							onPress={() => submitVote("yes")}>
							{votingCreateLoading && userVote === "yes" ? "Voting..." : "Yes"}
						</Button>

						<Button
							isLoading={votingCreateLoading}
							className="bg-background border border-primary px-4 py-2 rounded-full font-semibold text-primary hover:bg-primary hover:text-background transition"
							onPress={() => submitVote("no")}>
							{votingCreateLoading && userVote === "no" ? "Voting..." : "No"}
						</Button>
					</div>
					<div className="mt-4 flex items-center gap-2 text-xs text-default-500">
						<span className="rounded-full w-2 h-2 bg-success inline-block" />
						<span>Real-time results</span>
					</div>
					{votingFetchLoading && (
						<div className="mt-2 text-xs text-default-600">Loading votes...</div>
					)}
					{votingFetchError && (
						<div className="mt-2 text-xs text-danger">{votingFetchError}</div>
					)}
					{votingFetchMessage && (
						<div className="mt-2 text-xs text-success">{votingFetchMessage}</div>
					)}

					<div className="mt-2 text-xs text-default-600">
						Yes: {votes.voteCounts["yes"] || 0} | No: {votes.voteCounts["no"] || 0}
					</div>

					{votingCreateError && (
						<div className="mt-2 text-xs text-danger">{votingCreateError}</div>
					)}
					{votingCreateMessage && (
						<div className="mt-2 text-xs text-success">{votingCreateMessage}</div>
					)}
					{consensus && (
						<div className="mt-2 text-xs">
							Consensus: {consensus.reached ? "Reached" : "Not reached"} (
							{Math.round(consensus.agreement)}% agreement,{" "}
							{Math.round(consensus.engagement)}% engagement)
						</div>
					)}
				</div>
			</Card>
		</motion.div>
	);
}
