import { ClockIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import { MessageCircleMore } from "lucide-react";

// --- RecentActivityTimeline ---
export function RecentActivityTimeline({ recentComments }: { recentComments: any[] }) {
	return (
		<Card className="p-4 bg-gradient-to-br from-primary/20 to-background/80 border-0 shadow">
			<span className="font-semibold mb-2 flex items-center gap-2">
				<ClockIcon className="h-5 w-5 text-info" /> Recent Activity
			</span>
			<ul className="mt-2 space-y-2">
				{recentComments.map((c) => (
					<li key={c.id} className="flex items-center gap-2">
						<MessageCircleMore className="h-4 w-4 text-secondary" />
						<span className="text-xs text-default-400">
							{c.name}: {c.text.slice(0, 40)}...
						</span>
						<span className="text-xs text-default-300 ml-auto">
							{c.created_at ? new Date(c.created_at).toLocaleString() : ""}
						</span>
					</li>
				))}
			</ul>
		</Card>
	);
}
