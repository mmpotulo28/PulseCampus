"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Divider, Tooltip, Progress, User } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import {
	ChartBarIcon,
	UserGroupIcon,
	ClockIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/solid";
import { useThreads } from "@/hooks/useThreads";
import { useComments } from "@/hooks/useComments";
import { useVoting } from "@/hooks/useVoting";
import { useUser } from "@clerk/nextjs";
import ThreadInsights from "@/components/ThreadInsights";
import VoteCard from "@/components/VoteCard";
import { useEffect } from "react";

export default function ThreadDetailsPage() {
	const { threadId } = useParams();
	useUser();
	const { getThread, threadError, threadLoading, thread } = useThreads();
	const { votes } = useVoting({
		thread_id: thread?.id || "",
		anonymous: false,
		weighted: true,
	});

	const { comments, commentsLoading, commentsError, fetchComments } = useComments(
		thread?.id || "",
	);

	useEffect(() => {
		getThread(threadId as string);
	}, [threadId]);

	useEffect(() => {
		fetchComments();
	}, [thread]);

	if (threadLoading) return <div>Loading...</div>;
	if (threadError) {
		return (
			<div className="py-12 px-4 max-w-2xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4 text-danger">Thread Not Found</h2>
				<p className="text-zinc-500">
					The proposal or thread you are looking for does not exist.
				</p>
				<Link
					href="/dashboard/threads"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}>
					Back to Threads
				</Link>
			</div>
		);
	}

	if (!thread) {
		return (
			<div className="py-12 px-4 max-w-2xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4 text-danger">Thread Not Found</h2>
				<p className="text-zinc-500">
					The proposal or thread you are looking for does not exist.
				</p>
				<Link
					href="/dashboard/threads"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}>
					Back to Threads
				</Link>
			</div>
		);
	}

	const totalVotes = votes.voteCounts.yes + votes.voteCounts.no;
	const pulseScore = Math.round((totalVotes / (thread?.totalMembers || 0)) * 100);

	return (
		<div className="py-8 px-4 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				<div className="flex-2">
					<Card className="p-8 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 flex flex-col gap-6">
						{/* Thread Header */}
						<div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold mb-1">{thread.title}</h1>
								<p className="text-zinc-600 dark:text-zinc-300 mb-2">
									{thread.description}
								</p>
								<div className="flex gap-4 text-sm">
									<Tooltip content="Thread created date">
										<span className="flex items-center gap-1">
											<ClockIcon className="h-4 w-4 text-primary" />
											{new Date(thread.createdAt || "").toLocaleDateString()}
										</span>
									</Tooltip>
									<Tooltip content="Voting deadline">
										<span className="flex items-center gap-1">
											<ClockIcon className="h-4 w-4 text-secondary" />
											Deadline:{" "}
											{new Date(thread.deadline || "").toLocaleDateString()}
										</span>
									</Tooltip>
									<Tooltip content="Thread status">
										<span
											className={`flex items-center gap-1 font-semibold ${
												thread.status === "Open"
													? "text-success"
													: "text-warning"
											}`}>
											{thread.status === "Open" ? (
												<CheckCircleIcon className="h-4 w-4" />
											) : (
												<XCircleIcon className="h-4 w-4" />
											)}
											{thread.status}
										</span>
									</Tooltip>
								</div>
							</div>
							<div className="flex flex-col gap-2 min-w-[120px]">
								<span className="font-semibold text-sm flex items-center gap-1">
									<UserGroupIcon className="h-4 w-4 text-primary" />{" "}
									{thread.totalMembers} members
								</span>
								<span className="font-semibold text-sm flex items-center gap-1">
									<ChartBarIcon className="h-4 w-4 text-success" /> Pulse Score:{" "}
									{pulseScore}%
								</span>
							</div>
						</div>

						<Divider className="my-2" />

						{/* Animated Vote Mock Card */}
						<VoteCard thread={thread} disabled={thread.status !== "Open"} />

						{/* Voting UI */}
						<div>
							<h2 className="text-lg font-bold mb-2">Votes on this Proposal</h2>
							<Progress
								value={
									totalVotes
										? Math.round((votes.voteCounts.yes / totalVotes) * 100)
										: 0
								}
								label="Yes votes"
								className="mb-2"
								color="primary"
							/>
							<Progress
								value={
									totalVotes
										? Math.round((votes.voteCounts.no / totalVotes) * 100)
										: 0
								}
								label="No votes"
								className="mb-2"
								color="secondary"
							/>
						</div>

						<Divider className="my-2" />

						{/* Comments Section */}
						<div>
							<h2 className="text-lg font-bold mb-2">Comments & Discussion</h2>
							{commentsLoading ? (
								<div>Loading comments...</div>
							) : commentsError ? (
								<div>Error loading comments</div>
							) : (
								<ul className="space-y-3">
									{comments.map((c, idx) => (
										<li
											key={c.id || idx}
											className="flex items-center gap-3 p-3 rounded-xl bg-background dark:bg-zinc-800 shadow">
											<User
												name={c.user_id || "Unknown"}
												description={"Member"}
												avatarProps={{
													name: c.user_id || "Unknown",
													className:
														"bg-primary text-background font-bold",
												}}
											/>
											<div>
												<p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
													{c.text}
												</p>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>

						{/* Actions */}
						<div className="mt-6 flex justify-end gap-2">
							<Link
								href="/dashboard/threads"
								className={buttonStyles({
									color: "primary",
									radius: "full",
									variant: "bordered",
								})}>
								Back to Threads
							</Link>
						</div>
					</Card>
				</div>
				{/* Side Insights Panel */}
				<div className="w-full md:w-80 flex-1">
					<ThreadInsights
						yesVotes={votes?.voteCounts.yes}
						noVotes={votes?.voteCounts.no}
						totalMembers={thread?.totalMembers || 0}
					/>
				</div>
			</div>
		</div>
	);
}
