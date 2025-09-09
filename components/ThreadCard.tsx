import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Tooltip } from "@heroui/react";
import { CalendarIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { IThread } from "@/types";
import { ChartArea, Edit, ExternalLink, LockOpenIcon, TrashIcon, Vote } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface ThreadCardProps {
	thread: IThread;
	href: string;
}

export default function ThreadCard({ thread, href }: ThreadCardProps) {
	const { isAdmin, isExco } = usePermissions();

	return (
		<motion.div
			animate={{ scale: [1, 1.02, 1] }}
			className="bg-background border border-secondary/30 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-4 justify-between items-start w-full h-full"
			transition={{ repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" }}>
			{/* Main card content */}
			<div className="flex flex-col justify-between p-0 gap-2 w-full">
				<div className="flex items-center gap-3">
					<CalendarIcon className="h-7 w-7 text-secondary" />
					<h3 className="font-semibold text-lg text-nowrap truncate">{thread.title}</h3>
				</div>
				<p className="text-sm text-gray-600 truncate">{thread.description}</p>
			</div>

			<div className="flex items-center gap-4 mt-2">
				<Tooltip content="Thread deadline">
					<span className="flex items-center gap-1 text-zinc-500 text-sm">
						<CalendarIcon className="h-4 w-4" />{" "}
						{thread.deadline
							? new Date(thread.deadline).toLocaleDateString()
							: "No deadline"}
					</span>
				</Tooltip>
				<Tooltip content="Vote type">
					<span className="flex items-center gap-1 text-zinc-500 text-sm">
						<Vote className="h-4 w-4" /> {thread.vote_type || "Unknown"}
					</span>
				</Tooltip>
				<Tooltip content="Total members">
					<span className="flex items-center gap-1 text-zinc-500 text-sm">
						<ChartArea className="h-4 w-4" /> {thread.totalMembers || 0}
					</span>
				</Tooltip>
				{thread.status === "open" ? (
					<span className="flex items-center gap-1 text-success text-xs font-semibold ml-2">
						<LockOpenIcon className="h-4 w-4" /> Open
					</span>
				) : (
					<span className="flex items-center gap-1 text-warning text-xs font-semibold ml-2">
						<LockClosedIcon className="h-4 w-4" /> Closed
					</span>
				)}
			</div>

			<div className="flex gap-2 justify-start mt-0 w-full">
				<Button
					color="primary"
					size="sm"
					as={Link}
					href={href}
					endContent={<ExternalLink size={14} />}>
					View Thread
				</Button>

				{(isAdmin || isExco) && (
					<Button
						isIconOnly
						as={Link}
						color="secondary"
						endContent={<Edit className="h-4 w-4" />}
						href={`/dashboard/threads/${thread.id}/edit`}
						size="sm"
						variant="bordered"
					/>
				)}
				{isAdmin && (
					<Button
						isIconOnly
						as={Link}
						color="danger"
						endContent={<TrashIcon className="h-4 w-4" />}
						href={`/dashboard/threads/${thread.id}/delete`}
						size="sm"
						variant="bordered"
					/>
				)}
			</div>
		</motion.div>
	);
}
