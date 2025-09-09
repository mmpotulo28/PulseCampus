"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, Button, Spinner, Divider } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/solid";

import { useThreads } from "@/hooks/useThreads";
import { usePermissions } from "@/hooks/usePermissions";

export default function DeleteThreadPage() {
	const { threadId } = useParams();
	const { getThread, thread, threadLoading, deleteThread, deleting, deleteError, deleteSuccess } =
		useThreads();
	const router = useRouter();

	const { isAdmin } = usePermissions();

	useEffect(() => {
		getThread(threadId as string);
	}, [threadId]);

	const handleDelete = async () => {
		await deleteThread(threadId as string);
		if (!deleteError && !deleting) {
			setTimeout(() => router.push("/dashboard/threads"), 1500);
		}
	};

	if (threadLoading || !thread)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Spinner color="primary" size="lg" />
			</div>
		);

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-danger/20">
			<div className="flex items-center gap-3 mb-2">
				<TrashIcon className="h-7 w-7 text-danger" />
				<h2 className="text-xl font-bold">Delete Thread</h2>
			</div>
			<p className="text-danger font-semibold mb-4">
				Are you sure you want to delete this thread? This action cannot be undone.
			</p>
			<div className="flex gap-4 mt-2">
				<Button
					color="danger"
					disabled={deleting || !isAdmin}
					isLoading={deleting}
					radius="full"
					type="button"
					variant="shadow"
					onClick={handleDelete}>
					Delete Thread
				</Button>
				<Button
					color="secondary"
					radius="full"
					type="button"
					variant="bordered"
					onClick={() => router.push(`/dashboard/threads/${threadId}`)}>
					Cancel
				</Button>
			</div>
			{deleteError && <div className="text-danger mt-2">{deleteError}</div>}
			{deleteSuccess && <div className="text-success mt-2">{deleteSuccess}</div>}
			<Divider className="my-2" />
		</Card>
	);
}
