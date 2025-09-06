import { Card, Tooltip, Chip } from "@heroui/react";
import {
	ChartBarIcon,
	UserGroupIcon,
	ClockIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/solid";
import type { IThread } from "@/types";

interface ThreadHeaderProps {
	thread: IThread;
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
	return (
		<Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 flex flex-col gap-4 border border-primary/20">
			<div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
						<ChartBarIcon className="h-7 w-7 text-primary" />
						{thread.title}
					</h1>
					<p className="text-zinc-600 dark:text-zinc-300 mb-2">{thread.description}</p>
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
								Deadline: {new Date(thread.deadline || "").toLocaleDateString()}
							</span>
						</Tooltip>
						<Tooltip content="Thread status">
							<span
								className={`flex items-center gap-1 font-semibold ${
									thread.status === "Open" ? "text-success" : "text-warning"
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
					<span className="mb-1 flex flex-row items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary font-semibold w-fit">
						<UserGroupIcon className="h-4 w-4 mr-1" />
						{thread.totalMembers} members
					</span>
					<span className="flex flex-row items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full text-secondary font-semibold w-fit">
						<ChartBarIcon className="h-4 w-4 mr-1" />
						Pulse Score:{" "}
						{Math.round(
							(((thread.votes?.yes ?? 0) + (thread.votes?.no ?? 0)) /
								(thread.totalMembers || 1)) *
								100,
						)}
						%
					</span>
				</div>
			</div>
		</Card>
	);
}
