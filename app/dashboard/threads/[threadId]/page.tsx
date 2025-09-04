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
import { threads, users } from "@/lib/data";
import type { IThread, IUser } from "@/types";
import VoteCard from "@/components/VoteCard";

export default function ThreadDetailsPage() {
	const { threadId } = useParams();
	const thread = threads.find((t) => t.id === threadId);

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

	const totalVotes = thread.votes.yes + thread.votes.no;
	const pulseScore = Math.round((totalVotes / thread.totalMembers) * 100);

	return (
		<div className="py-8 px-4 max-w-4xl mx-auto">
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
									{new Date(thread.createdAt).toLocaleDateString()}
								</span>
							</Tooltip>
							<Tooltip content="Voting deadline">
								<span className="flex items-center gap-1">
									<ClockIcon className="h-4 w-4 text-secondary" />
									Deadline: {new Date(thread.deadline).toLocaleDateString()}
								</span>
							</Tooltip>
							<Tooltip content="Thread status">
								<span
									className={`flex items-center gap-1 font-semibold ${thread.status === "Open" ? "text-success" : "text-warning"}`}>
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
							<UserGroupIcon className="h-4 w-4 text-primary" /> {thread.totalMembers}{" "}
							members
						</span>
						<span className="font-semibold text-sm flex items-center gap-1">
							<ChartBarIcon className="h-4 w-4 text-success" /> Pulse Score:{" "}
							{pulseScore}%
						</span>
					</div>
				</div>

				<Divider className="my-2" />

				{/* Animated Vote Mock Card */}
				<VoteCard title={thread.title} disabled={thread.status !== "Open"} />

				{/* Voting UI */}
				<div>
					<h2 className="text-lg font-bold mb-2">Vote on this Proposal</h2>
					<div className="flex gap-4 mb-4">
						<button
							className={buttonStyles({
								color: "primary",
								radius: "full",
								variant: "shadow",
								class: "font-bold px-6 py-2",
							})}
							disabled={thread.status !== "Open"}>
							Yes ({thread.votes.yes})
						</button>
						<button
							className={buttonStyles({
								color: "secondary",
								radius: "full",
								variant: "shadow",
								class: "font-bold px-6 py-2",
							})}
							disabled={thread.status !== "Open"}>
							No ({thread.votes.no})
						</button>
					</div>
					<Progress
						value={totalVotes ? Math.round((thread.votes.yes / totalVotes) * 100) : 0}
						label="Yes votes"
						className="mb-2"
						color="primary"
					/>
					<Progress
						value={totalVotes ? Math.round((thread.votes.no / totalVotes) * 100) : 0}
						label="No votes"
						className="mb-2"
						color="secondary"
					/>
				</div>

				<Divider className="my-2" />

				{/* Comments Section */}
				<div>
					<h2 className="text-lg font-bold mb-2">Comments & Discussion</h2>
					<ul className="space-y-3">
						{thread.comments.map((c, idx) => {
							const user = users.find((u) => u.id === c.userId);
							return (
								<li
									key={idx}
									className="flex items-center gap-3 p-3 rounded-xl bg-background dark:bg-zinc-800 shadow">
									<User
										name={user?.name || "Unknown"}
										description={user?.role}
										avatarProps={{
											src: user?.avatarUrl,
											name: user?.name,
											className: "bg-primary text-background font-bold",
										}}
									/>
									<div>
										<p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
											{c.text}
										</p>
									</div>
								</li>
							);
						})}
					</ul>
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
	);
}
