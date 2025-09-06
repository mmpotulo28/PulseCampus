"use client";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useThreads } from "@/hooks/useThreads";

export default function ThreadsPage() {
	const { threads, threadsLoading, threadsError } = useThreads();

	return (
		<div className="py-8 px-4 max-w-3xl mx-auto">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" /> Decision Threads
			</h2>
			<div className="flex flex-col ">
				{threadsLoading && <div>Loading...</div>}
				{threadsError && <div>Error loading threads</div>}
			</div>
			<ul className="mb-6">
				{threads.map((t) => (
					<li
						key={t.id}
						className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-zinc-900 mb-2 shadow">
						<Link
							href={`/dashboard/threads/${t.id}`}
							className="font-semibold text-secondary hover:underline">
							{t.title}
						</Link>
						<span className="text-xs text-zinc-500">{t.status}</span>
					</li>
				))}
			</ul>
			<Link
				href="/dashboard/threads/create"
				className={buttonStyles({ color: "secondary", radius: "full", variant: "shadow" })}>
				New Proposal
			</Link>
		</div>
	);
}
