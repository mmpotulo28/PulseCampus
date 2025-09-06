"use client";
import { useParams, useRouter } from "next/navigation";
import { useThreads } from "@/hooks/useThreads";
import { useEffect, useState } from "react";
import { Card, Input, Button, Spinner, Divider } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function EditThreadPage() {
	const { threadId } = useParams();
	const { getThread, thread, threadLoading, threadError, isAdmin } = useThreads();
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [status, setStatus] = useState("Open");
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		getThread(threadId as string);
	}, [threadId]);

	useEffect(() => {
		if (thread) {
			setTitle(thread.title || "");
			setDesc(thread.description || "");
			setStatus(thread.status || "Open");
		}
	}, [thread]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin || !threadId) return;
		setSaving(true);
		setSaveError(null);
		setSaveSuccess(null);
		try {
			// Update thread via supabase
			const { error } = await (await import("@/lib/db")).default
				.from("threads")
				.update({ title, description: desc, status })
				.eq("id", threadId);
			if (error) throw error;
			setSaveSuccess("Thread updated!");
			setTimeout(() => router.push(`/dashboard/threads/${threadId}`), 1500);
		} catch (err: any) {
			setSaveError(err.message || "Failed to update thread");
		} finally {
			setSaving(false);
		}
	};

	if (threadLoading || !thread)
		return (
			<div className="py-8 px-4 flex justify-center items-center min-h-[40vh]">
				<Spinner size="lg" color="primary" />
			</div>
		);

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-primary/20">
			<div className="flex items-center gap-3 mb-2">
				<PencilSquareIcon className="h-7 w-7 text-primary" />
				<h2 className="text-xl font-bold">Edit Thread</h2>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={!isAdmin || saving}
					maxLength={60}
					required
				/>
				<Input
					label="Description"
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					disabled={!isAdmin || saving}
					maxLength={200}
					required
				/>
				<Input
					label="Status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					disabled={!isAdmin || saving}
					maxLength={20}
					required
				/>
				<div className="flex gap-4 mt-2">
					<Button
						type="submit"
						color="primary"
						radius="full"
						variant="shadow"
						isLoading={saving}
						disabled={saving || !title || !desc || !isAdmin}>
						Save Changes
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
				{saveError && <div className="text-danger mt-2">{saveError}</div>}
				{saveSuccess && <div className="text-success mt-2">{saveSuccess}</div>}
			</form>
			<Divider className="my-2" />
		</Card>
	);
}
