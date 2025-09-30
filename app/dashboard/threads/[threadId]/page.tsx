"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

import { useThreads } from "@/hooks/useThreads";
import { useComments } from "@/hooks/useComments";
import { useVoting } from "@/hooks/useVoting";
import ThreadHeader from "@/components/threads/ThreadHeader";
import VotingSection from "@/components/threads/VotingSection";
import CommentsSection from "@/components/threads/CommentsSection";
import InsightsPanel from "@/components/threads/InsightsPanel";
import { useNominations } from "@/hooks/useNominations";
import Loading from "@/app/loading";
import { OrganizationSidePanel } from "@/components/OgranizationSidePanel";

export default function ThreadDetailsPage() {
	const { threadId } = useParams();

	useUser();
	const { getThread, threadError, threadLoading, thread } = useThreads();
	const { votes } = useVoting({
		thread_id: thread?.id || "",
		anonymous: false,
		weighted: true,
	});
	const { nominations } = useNominations(thread?.id || "");

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
				<Loading title="Loading thread..." />
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
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}
					href="/dashboard/threads">
					Back to Threads
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				<div className="flex-2 flex flex-col gap-2">
					<ThreadHeader thread={thread} />
					<VotingSection nominations={nominations} thread={thread} votes={votes} />
					<CommentsSection
						comments={comments}
						commentsError={commentsError}
						commentsLoading={commentsLoading}
						threadId={thread.id || ""}
					/>
					<div className="mt-6 flex justify-end gap-2">
						<Button
							as={Link}
							color="primary"
							href="/dashboard/threads"
							radius="full"
							variant="bordered">
							Back to Threads
						</Button>
					</div>
				</div>
				<div className="w-full md:w-80 flex-1 flex flex-col gap-6">
					<InsightsPanel thread={thread} votes={votes} />
					<OrganizationSidePanel />
				</div>
			</div>
		</div>
	);
}
