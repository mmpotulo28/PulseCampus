import type { IThread } from "@/types";

import { Button, Card, Tooltip } from "@heroui/react";
import {
	ChartBarIcon,
	UserGroupIcon,
	ClockIcon,
	CheckCircleIcon,
	XCircleIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

import { usePermissions } from "@/hooks/usePermissions";
import { ExternalLink } from "lucide-react";

interface ThreadHeaderProps {
	thread: IThread;
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
	const { isAdmin, isExco } = usePermissions();

	return (
		<Card className=" p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
			<div className="flex flex-col gap-1 max-w-lg">
				<h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
					<ChartBarIcon className="h-7 w-7 text-primary" />
					{thread.title}
				</h1>
				<p className="text-zinc-600 dark:text-zinc-300 mb-2">{thread.description}</p>
				<div className="flex gap-4 text-sm">
					<Tooltip content="Thread created date">
						<span className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4 text-primary" />
							{new Date(thread.created_at || "").toLocaleDateString()}
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
				{/* Edit/Delete buttons for admin/exco */}
				{(isAdmin || isExco) && (
					<div className="flex gap-2 mt-2">
						<Button
							variant="bordered"
							color="warning"
							size="sm"
							as={Link}
							href={`/dashboard/threads/${thread.id}/metrics`}>
							<ExternalLink className="h-4 w-4 " />
							View Metrics
						</Button>
						<Button
							isIconOnly
							variant="bordered"
							color="primary"
							size="sm"
							as={Link}
							href={`/dashboard/threads/${thread.id}/edit`}>
							<PencilSquareIcon className="h-4 w-4 " />
						</Button>
						<Button
							isIconOnly
							variant="bordered"
							color="danger"
							size="sm"
							as={Link}
							href={`/dashboard/threads/${thread.id}/delete`}>
							<TrashIcon className="h-4 w-4 " />
						</Button>
					</div>
				)}
			</div>
		</Card>
	);
}
