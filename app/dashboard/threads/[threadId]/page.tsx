"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { useThreads } from "@/hooks/useThreads";
import { useComments } from "@/hooks/useComments";
import { useVoting } from "@/hooks/useVoting";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import ThreadHeader from "./ThreadHeader";
import VotingSection from "./VotingSection";
import CommentsSection from "./CommentsSection";
import InsightsPanel from "./InsightsPanel";

export default function ThreadDetailsPage() {
	const { threadId } = useParams();
	useUser();
	const { getThread, threadError, threadLoading, thread } = useThreads();
	const { votes } = useVoting({
		thread_id: thread?.id || "",
		anonymous: false,
		weighted: true,
	});
	const { comments, commentsLoading, commentsError, fetchComments } = useComments(
		thread?.id || "",
	);

	useEffect(() => {
		getThread(threadId as string);
	}, [threadId]);

	useEffect(() => {
		fetchComments();
	}, [thread]);

	if (threadLoading)
		return (
			<div className="py-12 px-4 text-center">
				<Spinner size="lg" color="primary" />
			</div>
		);
	if (threadError || !thread) {
		return (
			<div className="py-12 px-4 max-w-2xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4 text-danger">Thread Not Found</h2>
				<p className="text-zinc-500">
					The proposal or thread you are looking for does not exist.
				</p>
				<Link
					href="/dashboard/threads"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}>
					Back to Threads
				</Link>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				<div className="flex-2 flex flex-col gap-6">
					<ThreadHeader thread={thread} />
					<VotingSection thread={thread} votes={votes} />
					<CommentsSection
						comments={comments}
						commentsLoading={commentsLoading}
						commentsError={commentsError}
					/>
					<div className="mt-6 flex justify-end gap-2">
						<Button
							as={Link}
							href="/dashboard/threads"
							color="primary"
							radius="full"
							variant="bordered">
							Back to Threads
						</Button>
					</div>
				</div>
				<div className="w-full md:w-80 flex-1">
					<InsightsPanel votes={votes} thread={thread} />
				</div>
			</div>
		</div>
	);
}
