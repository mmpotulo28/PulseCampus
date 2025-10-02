"use client";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { Spinner, Card, Chip, Button } from "@heroui/react";
import { useMemo } from "react";
import { FolderOpenIcon, LockClosedIcon, NumberedListIcon } from "@heroicons/react/24/outline";
import { useThreads } from "@/hooks/useThreads";
import ThreadCard from "@/components/ThreadCard";
import { PlusCircleIcon } from "lucide-react";
import { OrganizationSidePanel } from "@/components/OgranizationSidePanel";

// Thread Stats Header
function ThreadsStatsHeader({ threads }: { threads: any[] }) {
	const total = threads?.length;
	const open = threads?.filter((t) => t.status === "open").length;
	const closed = threads?.filter((t) => t.status === "closed").length;
	const lastActivity = useMemo(() => {
		const dates = threads?.map((t) => new Date(t.updated_at || t.createdAt));
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
				<Button
					variant="bordered"
					color="success"
					size="sm"
					as={Link}
					href="/support/help-centre">
					Help Centre
				</Button>
				<Button
					variant="bordered"
					color="secondary"
					size="sm"
					as={Link}
					href="/dashboard/metrics">
					View Metrics
				</Button>
			</div>
		</Card>
	);
}

export default function ThreadsPage() {
	const { threads, threadsLoading, threadsError } = useThreads();

	return (
		<section className="max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Main Content */}
				<div className="flex-1">
					<ThreadsStatsHeader threads={threads} />
					<div className="flex flex-col w-full">
						{threadsLoading && <Spinner className="m-auto my-8" />}
						{threadsError && <div>Error loading threads</div>}
					</div>

					<div className="mb-6 flex flex-col gap-4">
						{threads?.map((t) => (
							<ThreadCard key={t.id} thread={t} href={`/dashboard/threads/${t.id}`} />
						))}
					</div>

					<Button
						as={Link}
						startContent={<PlusCircleIcon />}
						href="/dashboard/threads/create">
						New Proposal
					</Button>
					<ThreadsBottomSection />
				</div>
				{/* Organization Side Panel */}
				<div className="w-full md:w-80 flex-shrink-0">
					<OrganizationSidePanel />
				</div>
			</div>
		</section>
	);
}
