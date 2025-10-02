"use client";
import type { IComment } from "@/types";

import {
	Card,
	User,
	Input,
	Button,
	Spinner,
	Divider,
	Tooltip,
	Chip,
	Avatar,
	Image,
	Pagination,
} from "@heroui/react";
import {
	ChatBubbleLeftRightIcon,
	PaperAirplaneIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useComments } from "@/hooks/useComments";

interface CommentsSectionProps {
	comments: IComment[];
	commentsLoading: boolean;
	commentsError: string | null;
	threadId: string;
}

export default function CommentsSection({
	comments,
	commentsLoading,
	commentsError,
	threadId,
}: CommentsSectionProps) {
	const { user } = useUser();
	const { addComment, addCommentLoading, addCommentError, fetchComments } = useComments(
		threadId || "",
	);
	const [text, setText] = useState("");
	const [page, setPage] = useState(1);
	const COMMENTS_PER_PAGE = 5;

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text || addCommentLoading) return;
		await addComment(text);
		setText("");
	};

	const totalPages = Math.max(1, Math.ceil(comments.length / COMMENTS_PER_PAGE));
	const paginatedComments = comments.slice(
		COMMENTS_PER_PAGE * (page - 1),
		COMMENTS_PER_PAGE * page,
	);

	return (
		<Card className="p-6 rounded-2xl shadow-xl flex flex-col gap-2 border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-background/80">
			<div className="flex items-center gap-2 mb-2">
				<ChatBubbleLeftRightIcon className="h-7 w-7 text-secondary" />
				<h2 className="text-xl font-bold">Comments & Discussion</h2>
				<Chip className="ml-2" color="primary" size="sm" variant="flat">
					{comments.length} comments
				</Chip>
			</div>
			<form className="flex gap-2  items-center" onSubmit={handleAddComment}>
				<Avatar
					ImgComponent={Image}
					className="mr-2"
					imgProps={{
						alt: user?.fullName || "User Avatar",
						src: user?.imageUrl,
						className: "bg-primary text-background font-bold",
					}}
					size="sm"
				/>
				<Input
					className="flex-1"
					disabled={addCommentLoading || !user}
					maxLength={200}
					placeholder="Write a comment..."
					radius="full"
					value={text}
					variant="bordered"
					onChange={(e) => setText(e.target.value)}
				/>
				<Tooltip content="Send">
					<Button
						className="px-3"
						color="secondary"
						disabled={addCommentLoading || !text || !user}
						isLoading={addCommentLoading}
						radius="full"
						type="submit">
						<PaperAirplaneIcon className="h-5 w-5" />
					</Button>
				</Tooltip>
				<Button
					isIconOnly
					color="primary"
					isLoading={commentsLoading}
					radius="full"
					variant="bordered"
					onPress={() => fetchComments()}>
					<ArrowPathIcon className="h-5 w-5" />
				</Button>
			</form>
			{addCommentError && <div className="text-danger text-xs">{addCommentError}</div>}
			<Divider className="my-2" />
			{commentsLoading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading comments...</span>
				</div>
			) : commentsError ? (
				<div className="text-danger text-sm">Error loading comments</div>
			) : comments.length === 0 ? (
				<div className="text-default-500 text-sm text-center py-4">
					No comments yet. Be the first to start the discussion!
				</div>
			) : (
				<>
					<ul className="space-y-4">
						{paginatedComments.map((c, idx) => (
							<li
								key={c.id || idx}
								className="flex flex-col flex-wrap justify-between items-start gap-3 p-3 rounded-xl bg-primary/10 shadow hover:bg-primary/20 transition">
								<div className="flex	items-center gap-3 w-full justify-between">
									<User
										avatarProps={{
											name: c.name || "Unknown",
											className: "bg-primary text-background font-bold",
											size: "sm",
										}}
										description="Member"
										name={c.name || "Unknown"}
									/>
									<span className="text-xs text-default-400">
										{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
									</span>
								</div>
								<div className="flex-1">
									<p className="text-base mt-1 break-words">{c.text}</p>
									<div className="flex items-center gap-2" />
								</div>
							</li>
						))}
					</ul>
					<div className="flex justify-center mt-4">
						{totalPages > 1 && (
							<Pagination
								isCompact
								showControls
								initialPage={1}
								page={page}
								total={totalPages}
								onChange={setPage}
							/>
						)}
					</div>
				</>
			)}
		</Card>
	);
}
