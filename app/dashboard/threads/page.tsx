"use client";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { Spinner, Card, Chip, Button } from "@heroui/react";
import { useMemo } from "react";
import {
	FolderOpenIcon,
	LockClosedIcon,
	NumberedListIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";

import { OrganizationSidePanel } from "../groups/components";

import { usePermissions } from "@/hooks/usePermissions";
import { useThreads } from "@/hooks/useThreads";
import { Edit, MessageCircleMore, Vote } from "lucide-react";

// Thread Stats Header
function ThreadsStatsHeader({ threads }: { threads: any[] }) {
	const total = threads.length;
	const open = threads.filter((t) => t.status === "open").length;
	const closed = threads.filter((t) => t.status === "closed").length;
	const lastActivity = useMemo(() => {
		if (!threads.length) return "-";
		const dates = threads.map((t) => new Date(t.updated_at || t.created_at));
		const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

		return latest.toLocaleString();
	}, [threads]);

	return (
		<Card className="mb-6 p-4 flex flex-wrap gap-6 items-center bg-gradient-to-br from-secondary/20 to-background/80 border-0 shadow">
			<div className="flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" />
				<span className="font-bold text-lg">Threads</span>
			</div>
			{/* <Divider orientation="vertical" className="h-6" /> */}

			<div className="flex items-center gap-2">
				<Chip
					color="primary"
					startContent={<NumberedListIcon className="h-4 w-4" />}
					variant="flat">
					Total: {total}
				</Chip>

				<Chip
					color="success"
					startContent={<FolderOpenIcon className="h-4 w-4" />}
					variant="flat">
					Open: {open}
				</Chip>

				<Chip
					color="danger"
					startContent={<LockClosedIcon className="h-4 w-4" />}
					variant="flat">
					Closed: {closed}
				</Chip>
			</div>
			<span className="text-xs text-default-400 ml-auto">Last activity: {lastActivity}</span>
		</Card>
	);
}

// Thread List Item
function ThreadListItem({ t, isAdmin }: { t: any; isAdmin: boolean }) {
	return (
		<li className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-zinc-900 mb-2 shadow">
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<Link
						className="font-semibold text-secondary hover:underline"
						href={`/dashboard/threads/${t.id}`}>
						{t.title}
					</Link>
					<Chip
						color={t.status === "open" ? "success" : "danger"}
						size="sm"
						variant="flat">
						{t.status}
					</Chip>
				</div>
				<div className="flex items-center gap-3 text-xs text-default-400 mt-1">
					<span>By: {t.created_by || "Unknown"}</span>
					<span>
						Created: {t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}
					</span>
					<span className="flex items-center gap-1">
						<Vote className="h-3 w-3" /> {t.votesCount || 0}
					</span>
					<span className="flex items-center gap-1">
						<MessageCircleMore className="h-3 w-3" /> {t.commentsCount || 0}
					</span>
				</div>
			</div>
			{isAdmin && (
				<div className="flex gap-2">
					<Button
						isIconOnly
						as={Link}
						color="primary"
						endContent={<Edit className="h-4 w-4" />}
						href={`/dashboard/threads/${t.id}/edit`}
						size="sm"
						variant="bordered"
					/>
					<Button
						isIconOnly
						as={Link}
						color="danger"
						endContent={<TrashIcon className="h-4 w-4" />}
						href={`/dashboard/threads/${t.id}/delete`}
						size="sm"
						variant="bordered"
					/>
				</div>
			)}
		</li>
	);
}

// Bottom Section: Tips & Help
function ThreadsBottomSection() {
	return (
		<Card className="mt-8 p-6 bg-gradient-to-br from-info/10 to-background/80 border-0 shadow">
			<h3 className="font-bold text-lg mb-2">Tips & Help</h3>
			<ul className="list-disc ml-4 text-sm text-default-600 mb-2">
				<li>Click a thread title to view details, vote, or comment.</li>
				<li>Admins can edit or delete threads using the buttons.</li>
				<li>Use the &quot;New Proposal&quot; button to start a new decision thread.</li>
				<li>Check metrics for group engagement and voting activity.</li>
			</ul>
			<div className="flex gap-4 mt-2">
				<Link
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "bordered",
					})}
					href="/support/help-centre">
					Help Centre
				</Link>
				<Link
					className={buttonStyles({
						color: "success",
						radius: "full",
						variant: "bordered",
					})}
					href="/dashboard/metrics">
					View Metrics
				</Link>
			</div>
		</Card>
	);
}

export default function ThreadsPage() {
	const { threads, threadsLoading, threadsError } = useThreads();
	const { isAdmin } = usePermissions();

	// Example: add votesCount/commentsCount for demo (replace with real data if available)
	const threadsWithCounts = useMemo(
		() =>
			threads.map((t) => ({
				...t,
				votesCount: t.votes?.length || Math.floor(Math.random() * 20),
				commentsCount: t.comments?.length || Math.floor(Math.random() * 10),
			})),
		[threads],
	);

	return (
		<div className="py-8 px-4 max-w-5xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Main Content */}
				<div className="flex-1">
					<ThreadsStatsHeader threads={threadsWithCounts} />
					<div className="flex flex-col w-full mb-4">
						{threadsLoading && <Spinner className="m-auto" />}
						{threadsError && <div>Error loading threads</div>}
					</div>
					<ul className="mb-6">
						{threadsWithCounts.map((t) => (
							<ThreadListItem key={t.id} isAdmin={isAdmin} t={t} />
						))}
					</ul>
					<Link
						className={buttonStyles({
							color: "secondary",
							radius: "full",
							variant: "shadow",
						})}
						href="/dashboard/threads/create">
						New Proposal
					</Link>
					<ThreadsBottomSection />
				</div>
				{/* Organization Side Panel */}
				<div className="w-full md:w-80 flex-shrink-0">
					<OrganizationSidePanel />
				</div>
			</div>
		</div>
	);
}
