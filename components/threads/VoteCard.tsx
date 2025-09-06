import { Button, Card, Input, Checkbox } from "@heroui/react";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { useVoting } from "@/hooks/useVoting";
import type { IThread, IVoteOption } from "@/types";

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
		voteOptions,
		setVoteOptions,
	} = useVoting({
		thread_id: thread.id || "",
		options: thread.voteOptions || [
			{ id: "yes", label: "Yes" },
			{ id: "no", label: "No" },
		],
		anonymous: false,
		weighted: true,
	});

	const [selected, setSelected] = useState<string[]>([]);
	const [newNomination, setNewNomination] = useState("");

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

	const isMCQ = voteOptions.length > 2 || thread.voteType === "mcq";

	const handleVote = () => {
		if (isMCQ) {
			if (selected.length === 0) return;
			submitVote(selected);
		} else {
			if (selected.length !== 1) return;
			submitVote(selected[0]);
		}
	};

	const handleAddNomination = () => {
		if (newNomination.trim().length < 2) return;
		setVoteOptions([...voteOptions, { id: newNomination.trim(), label: newNomination.trim() }]);
		setNewNomination("");
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
					{/* MCQ voting UI */}
					{isMCQ ? (
						<div className="flex flex-col gap-2 mt-4">
							{voteOptions.map((opt) => (
								<Checkbox
									key={opt.id}
									value={opt.id}
									checked={selected.includes(opt.id)}
									onChange={() => {
										setSelected((prev) =>
											prev.includes(opt.id)
												? prev.filter((id) => id !== opt.id)
												: [...prev, opt.id],
										);
									}}>
									{opt.label}
								</Checkbox>
							))}
							<div className="flex gap-2 mt-2">
								<Button
									isLoading={votingCreateLoading}
									className="bg-primary text-background rounded-full font-semibold hover:bg-secondary transition"
									onPress={handleVote}
									disabled={selected.length === 0 || votingCreateLoading}>
									{votingCreateLoading ? "Voting..." : "Vote"}
								</Button>
							</div>
							{/* Optionally allow nominations */}
							<Input
								placeholder="Add nomination"
								value={newNomination}
								onChange={(e) => setNewNomination(e.target.value)}
								className="mt-2"
								maxLength={40}
							/>
							<Button
								className="mt-2"
								color="secondary"
								radius="full"
								variant="bordered"
								onPress={handleAddNomination}
								disabled={newNomination.length < 2}>
								Add Nomination
							</Button>
						</div>
					) : (
						<div className="flex gap-2 mt-4">
							{voteOptions.map((opt) => (
								<Button
									key={opt.id}
									isLoading={votingCreateLoading && userVote === opt.id}
									className={`bg-primary text-background rounded-full font-semibold hover:bg-secondary transition`}
									onPress={() => submitVote(opt.id)}>
									{votingCreateLoading && userVote === opt.id
										? "Voting..."
										: opt.label}
								</Button>
							))}
						</div>
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
						{voteOptions.map((opt) => (
							<span key={opt.id} className="mr-2">
								{opt.label}: {votes.voteCounts[opt.id] || 0}
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
		</motion.div>
	);
}
