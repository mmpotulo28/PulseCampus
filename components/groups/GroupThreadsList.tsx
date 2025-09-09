import type { IThread } from "@/types";
import ThreadCard from "../ThreadCard";

export default function GroupThreadsList({ threads }: { threads: IThread[] }) {
	return (
		<div>
			<h2 className="text-lg font-bold mb-4">Recent Proposals & Threads</h2>
			<ul className="space-y-3">
				{threads.slice(0, 3).map((thread) => (
					<ThreadCard
						key={thread.id}
						thread={thread}
						href={`/dashboard/threads/${thread.id}`}
					/>
				))}
			</ul>
		</div>
	);
}
