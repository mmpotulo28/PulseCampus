"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { UserGroupIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";

export default function DashboardPage() {
	const { user } = useUser();

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || "Student"}!</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Link
					className="flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-zinc-900 hover:scale-105 transition"
					href="/dashboard/groups">
					<UserGroupIcon className="h-8 w-8 text-primary mb-2" />
					<span className="font-semibold">Groups</span>
					<span className="text-xs text-zinc-500 mt-1">
						Manage or join student groups
					</span>
				</Link>
				<Link
					className="flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-zinc-900 hover:scale-105 transition"
					href="/dashboard/threads">
					<ChatBubbleLeftRightIcon className="h-8 w-8 text-secondary mb-2" />
					<span className="font-semibold">Threads</span>
					<span className="text-xs text-zinc-500 mt-1">View and create proposals</span>
				</Link>
				<Link
					className="flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-zinc-900 hover:scale-105 transition"
					href="/dashboard/metrics">
					<ChartBarIcon className="h-8 w-8 text-success mb-2" />
					<span className="font-semibold">Engagement</span>
					<span className="text-xs text-zinc-500 mt-1">Track voting & participation</span>
				</Link>
			</div>
			<div className="flex gap-4">
				<Button
					as={Link}
					color="primary"
					href="/dashboard/groups/create"
					startContent={<UserGroupIcon additive="sum" className="h-4 w-4" />}>
					Create Group
				</Button>
				<Button
					as={Link}
					color="secondary"
					href="/dashboard/threads/create"
					startContent={<ChatBubbleLeftRightIcon additive="sum" className="h-4 w-4" />}>
					New Proposal
				</Button>
			</div>
		</div>
	);
}
