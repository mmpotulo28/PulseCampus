import { Card } from "@heroui/react";
import { MessageCircleMore, Vote } from "lucide-react";

export default function ThreadRecentActivityGrid({
	recentVotes,
	recentComments,
}: {
	recentVotes: any[];
	recentComments: any[];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<Card className="p-6 rounded-xl shadow bg-gradient-to-br from-info/10 to-background/80 border-0">
				<h3 className="font-semibold mb-2 flex items-center gap-2">
					<Vote className="h-5 w-5 text-primary" /> Recent Votes
				</h3>
				<ul className="space-y-2">
					{recentVotes.length === 0 ? (
						<li className="text-xs text-default-400">No votes yet.</li>
					) : (
						recentVotes.map((v) => (
							<li
								key={v.id}
								className="flex items-center gap-2 text-xs text-default-400">
								<span className="font-bold">{v.user_id}:</span>
								<span>{Array.isArray(v.vote) ? v.vote.join(", ") : v.vote}</span>
								<span className="ml-auto">
									{v.created_at ? new Date(v.created_at).toLocaleString() : ""}
								</span>
							</li>
						))
					)}
				</ul>
			</Card>
			<Card className="p-6 rounded-xl shadow bg-gradient-to-br from-success/10 to-background/80 border-0">
				<h3 className="font-semibold mb-2 flex items-center gap-2">
					<MessageCircleMore className="h-5 w-5 text-success" /> Recent Comments
				</h3>
				<ul className="space-y-2">
					{recentComments.length === 0 ? (
						<li className="text-xs text-default-400">No comments yet.</li>
					) : (
						recentComments.map((c) => (
							<li
								key={c.id}
								className="flex items-center gap-2 text-xs text-default-400">
								<span className="font-bold">{c.name || c.user_id}:</span>
								<span>{c.text.slice(0, 40)}...</span>
								<span className="ml-auto">
									{c.created_at ? new Date(c.created_at).toLocaleString() : ""}
								</span>
							</li>
						))
					)}
				</ul>
			</Card>
		</div>
	);
}
