"use client";
import { useParams, useRouter } from "next/navigation";
import { useThreads } from "@/hooks/useThreads";
import { useEffect, useState } from "react";
import { Card, Button, Spinner, Divider } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function DeleteThreadPage() {
	const { threadId } = useParams();
	const { getThread, thread, threadLoading, threadError, isAdmin } = useThreads();
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		getThread(threadId as string);
	}, [threadId]);

	const handleDelete = async () => {
		if (!isAdmin || !threadId) return;
		setDeleting(true);
		setDeleteError(null);
		setDeleteSuccess(null);
		try {
			const { error } = await (await import("@/lib/db")).default
				.from("threads")
				.delete()
				.eq("id", threadId);
			if (error) throw error;
			setDeleteSuccess("Thread deleted!");
			setTimeout(() => router.push("/dashboard/threads"), 1500);
		} catch (err: any) {
			setDeleteError(err.message || "Failed to delete thread");
		} finally {
			setDeleting(false);
		}
	};

	if (threadLoading || !thread)
		return (
			<div className="py-8 px-4 flex justify-center items-center min-h-[40vh]">
				<Spinner size="lg" color="primary" />
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
					type="button"
					color="danger"
					radius="full"
					variant="shadow"
					isLoading={deleting}
					disabled={deleting || !isAdmin}
					onClick={handleDelete}>
					Delete Thread
				</Button>
				<Button
					type="button"
					color="secondary"
					radius="full"
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
