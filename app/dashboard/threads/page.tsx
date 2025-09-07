"use client";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useThreads } from "@/hooks/useThreads";
import { Spinner } from "@heroui/react";

export default function ThreadsPage() {
	const { threads, threadsLoading, threadsError, isAdmin } = useThreads();

	return (
		<div className="py-8 px-4 max-w-3xl mx-auto">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" /> Decision Threads
			</h2>
			<div className="flex flex-col w-full mb-4">
				{threadsLoading && <Spinner className="m-auto" />}
				{threadsError && <div>Error loading threads</div>}
			</div>
			<ul className="mb-6">
				{threads.map((t) => (
					<li
						key={t.id}
						className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-zinc-900 mb-2 shadow">
						<div className="flex items-center gap-2">
							<Link
								href={`/dashboard/threads/${t.id}`}
								className="font-semibold text-secondary hover:underline">
								{t.title}
							</Link>
							<span className="text-xs text-zinc-500">{t.status}</span>
						</div>
						{isAdmin && (
							<div className="flex gap-2">
								<Link
									href={`/dashboard/threads/${t.id}/edit`}
									className={buttonStyles({
										color: "secondary",
										radius: "full",
										variant: "bordered",
										size: "sm",
									})}>
									Edit
								</Link>
								<Link
									href={`/dashboard/threads/${t.id}/delete`}
									className={buttonStyles({
										color: "danger",
										radius: "full",
										variant: "bordered",
										size: "sm",
									})}>
									Delete
								</Link>
							</div>
						)}
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
