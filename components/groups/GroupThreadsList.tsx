import Link from "next/link";
import type { IThread } from "@/types";

export default function GroupThreadsList({ threads }: { threads: IThread[] }) {
	return (
		<div>
			<h2 className="text-lg font-bold mb-4">Recent Proposals & Threads</h2>
			<ul className="space-y-3">
				{threads.slice(0, 3).map((thread) => (
					<li
						key={thread.id}
						className="p-4 rounded-xl bg-background dark:bg-zinc-800 shadow flex justify-between items-center">
						<span
							className={`font-semibold ${thread.status === "Open" ? "text-primary" : "text-secondary"}`}>
							{thread.title}
						</span>
						<Link
							href={`/dashboard/threads/${thread.id}`}
							className={`flex items-center justify-center px-4 py-2 rounded-2xl bg-transparent border-2 text-xs ${
								thread.status === "Open"
									? "border-primary text-primary"
									: "border-secondary text-secondary"
							}`}>
							View
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
