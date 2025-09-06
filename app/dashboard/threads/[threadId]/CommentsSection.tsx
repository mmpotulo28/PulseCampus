import { Card, User } from "@heroui/react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import type { IComment } from "@/types";

interface CommentsSectionProps {
	comments: IComment[];
	commentsLoading: boolean;
	commentsError: string | null;
}

export default function CommentsSection({
	comments,
	commentsLoading,
	commentsError,
}: CommentsSectionProps) {
	return (
		<Card className="p-6 rounded-2xl shadow-lg bg-background dark:bg-zinc-900 flex flex-col gap-4 border border-success/20 mt-6">
			<h2 className="text-lg font-bold mb-2 flex items-center gap-2">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" />
				Comments & Discussion
			</h2>
			{commentsLoading ? (
				<div>Loading comments...</div>
			) : commentsError ? (
				<div>Error loading comments</div>
			) : comments.length === 0 ? (
				<div className="text-default-500 text-sm">No comments yet.</div>
			) : (
				<ul className="space-y-3">
					{comments.map((c, idx) => (
						<li
							key={c.id || idx}
							className="flex items-center gap-3 p-3 rounded-xl bg-background dark:bg-zinc-800 shadow">
							<User
								name={c.user_id || "Unknown"}
								description={"Member"}
								avatarProps={{
									name: c.user_id || "Unknown",
									className: "bg-primary text-background font-bold",
								}}
							/>
							<div>
								<p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
									{c.text}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
