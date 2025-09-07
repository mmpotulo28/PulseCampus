import { IThread } from "@/types";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/react";

// --- TopThreadsList ---
export function TopThreadsList({
	topThreads,
}: {
	topThreads: (IThread & { voteCount: number })[];
}) {
	return (
		<Card className="p-4 bg-gradient-to-br from-success/20 to-background/80 border-0 shadow">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-5 w-5 text-success" /> Top Threads
			</span>
			<ul className="mt-2 space-y-2">
				{topThreads.map((t) => (
					<li key={t.id} className="flex items-center gap-2">
						<Chip color="primary" size="sm" variant="flat">
							{t.title}
						</Chip>
						<span className="text-xs text-default-400">{t.voteCount} votes</span>
					</li>
				))}
			</ul>
		</Card>
	);
}
