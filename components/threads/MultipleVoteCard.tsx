import { Button, Card, Progress, Divider } from "@heroui/react";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { useVoting } from "@/hooks/useVoting";
import { useNominations } from "@/hooks/useNominations";
import type { IThread } from "@/types";

export interface MultipleVoteCardProps {
	thread: IThread;
	disabled?: boolean;
}

export default function MultipleVoteCard({ thread, disabled = false }: MultipleVoteCardProps) {
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
		options: [], // options will be set from nominations
		anonymous: false,
		weighted: true,
	});

	const {
		nominations,
		loading: nominationsLoading,
		error: nominationsError,
		fetchNominations,
	} = useNominations(thread.id || "");

	const [selectedNomineeId, setSelectedNomineeId] = useState<string | null>(null);

	useEffect(() => {
		if (thread.id) fetchNominations();
	}, [thread.id, fetchNominations]);

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

	const handleVote = (nomineeId: string) => {
		if (!nomineeId) return;
		submitVote(nomineeId);
		setSelectedNomineeId(nomineeId);
	};

	return (
		<div className="mx-auto origin-top w-full max-w-lg">
			<Card className="p-6 rounded-2xl shadow-xl bg-background border border-primary/20">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="font-bold text-primary">Student Vote</span>
						<span className="bg-primary text-background px-2 py-1 rounded-full text-xs">
							Live
						</span>
					</div>
					<div className="font-semibold text-lg mt-2">{thread.title}</div>
					{/* MCQ voting UI: List all nominees, allow voting for one */}
					{nominationsLoading ? (
						<div className="mt-4 text-default-500 text-sm">Loading nominees...</div>
					) : nominationsError ? (
						<div className="mt-4 text-danger text-sm">Error loading nominees</div>
					) : nominations.length === 0 ? (
						<div className="mt-4 text-default-500 text-sm">No nominees yet.</div>
					) : (
						<ul className="flex flex-col gap-2 mt-4">
							{nominations.map((nominee) => (
								<li
									key={nominee.id}
									className={`flex items-center justify-between px-3 py-2 rounded-xl bg-default-100 shadow`}>
									<div>
										<span className="font-semibold text-primary">
											{nominee.label}
										</span>
										{nominee.name && (
											<span className="ml-2 text-xs text-default-500">
												({nominee.name})
											</span>
										)}
									</div>
									<Button
										size="sm"
										color={
											selectedNomineeId === nominee.id
												? "primary"
												: "secondary"
										}
										variant={
											selectedNomineeId === nominee.id ? "shadow" : "bordered"
										}
										isLoading={
											votingCreateLoading && selectedNomineeId === nominee.id
										}
										disabled={votingCreateLoading}
										onPress={() => handleVote(nominee.id)}>
										{votingCreateLoading && selectedNomineeId === nominee.id
											? "Voting..."
											: userVote === nominee.id
												? "Voted"
												: "Vote"}
									</Button>
								</li>
							))}
						</ul>
					)}
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
						{nominations.map((nominee) => (
							<span key={nominee.id} className="mr-2">
								{nominee.label}: {votes.voteCounts[nominee.id] || 0}
							</span>
						))}
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
		</div>
	);
}
