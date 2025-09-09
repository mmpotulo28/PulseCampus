"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Card, Input, Button, Spinner, Divider, RadioGroup, Radio, Tooltip } from "@heroui/react";
import { PencilSquareIcon, ChatBubbleLeftRightIcon, ClockIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

import { useThreads } from "@/hooks/useThreads";
import supabase from "@/lib/db";
import { MessageCircleMore, Vote } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

function ThreadStatsCard({ thread }: { thread: any }) {
	return (
		<Card className="mb-4 p-4 bg-gradient-to-br from-primary/10 to-background/80 border-0 shadow flex flex-col gap-2">
			<div className="flex items-center gap-3 mb-2">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-secondary" />
				<span className="font-bold text-lg">{thread.title}</span>
				<Tooltip content={thread.status === "open" ? "Open for voting" : "Closed"}>
					<span
						className={`px-2 py-1 rounded text-xs font-semibold ${
							thread.status === "open"
								? "bg-success/20 text-success"
								: "bg-danger/20 text-danger"
						}`}>
						{thread.status}
					</span>
				</Tooltip>
			</div>
			<div className="flex gap-4 text-xs text-default-400">
				<span className="flex items-center gap-1">
					<Vote className="h-4 w-4" /> {thread.votes?.length || 0} votes
				</span>
				<span className="flex items-center gap-1">
					<MessageCircleMore className="h-4 w-4" /> {thread.comments?.length || 0}{" "}
					comments
				</span>
				<span className="flex items-center gap-1">
					<ClockIcon className="h-4 w-4" /> Last updated:{" "}
					{thread.updated_at ? new Date(thread.updated_at).toLocaleString() : "-"}
				</span>
			</div>
		</Card>
	);
}

function RecentCommentsPreview({ comments }: { comments: any[] }) {
	if (!comments?.length) return null;

	return (
		<Card className="mb-4 p-4 bg-gradient-to-br from-info/10 to-background/80 border-0 shadow">
			<div className="font-semibold mb-2 flex items-center gap-2">
				<MessageCircleMore className="h-5 w-5 text-info" /> Recent Comments
			</div>
			<ul className="space-y-2">
				{comments.slice(0, 3).map((c: any) => (
					<li key={c.id} className="flex items-center gap-2 text-xs text-default-400">
						<span className="font-bold">{c.name || c.user_id}:</span>
						<span>{c.text.slice(0, 40)}...</span>
						<span className="ml-auto">
							{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
						</span>
					</li>
				))}
			</ul>
		</Card>
	);
}

export default function EditThreadPage() {
	const { threadId } = useParams();
	const { getThread, thread, threadLoading, threadError } = useThreads();
	const { isAdmin, isExco } = usePermissions();
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [status, setStatus] = useState("open");
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
			setStatus(thread.status?.toLowerCase() || "open");
		}
	}, [thread]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if ((!isAdmin && !isExco) || !threadId) return;
		setSaving(true);
		setSaveError(null);
		setSaveSuccess(null);
		try {
			const { error } = await supabase
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

	const isTitleValid = title.length >= 5 && title.length <= 60;
	const isDescValid = desc.length >= 10 && desc.length <= 200;

	const markdownPreview = useMemo(() => desc, [desc]);

	if (threadError) {
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<p className="text-danger">{threadError}</p>
			</div>
		);
	}

	if (threadLoading || !thread)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Spinner title="Loading thread..." />
			</div>
		);

	return (
		<div className="max-w-2xl mx-auto py-8 px-2">
			<ThreadStatsCard thread={thread} />
			<RecentCommentsPreview comments={thread.comments || []} />
			<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-primary/20">
				<div className="flex items-center gap-3 mb-2">
					<PencilSquareIcon className="h-7 w-7 text-primary" />
					<h2 className="text-xl font-bold">Edit Thread</h2>
				</div>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<Input
						required
						color={isTitleValid ? "success" : "danger"}
						description="5-60 characters"
						disabled={(!isAdmin && !isExco) || saving}
						label="Title"
						maxLength={60}
						placeholder="Enter a clear, descriptive title"
						value={title}
						variant="bordered"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
					/>
					<Input
						required
						color={isDescValid ? "success" : "danger"}
						description="10-200 characters"
						disabled={(!isAdmin && !isExco) || saving}
						label="Description (Markdown supported)"
						maxLength={200}
						placeholder="Describe the proposal, context, and goals"
						value={desc}
						variant="bordered"
						onChange={(e) => setDesc(e.target.value)}
					/>
					<RadioGroup
						className="gap-6"
						isDisabled={(!isAdmin && !isExco) || saving}
						label="Status"
						orientation="horizontal"
						value={status}
						onValueChange={setStatus}>
						<Radio value="open">Open</Radio>
						<Radio value="closed">Closed</Radio>
					</RadioGroup>
					<div className="flex gap-4 mt-2">
						<Button
							color="primary"
							disabled={
								saving ||
								!title ||
								!desc ||
								(!isAdmin && !isExco) ||
								!isTitleValid ||
								!isDescValid
							}
							isLoading={saving}
							type="submit">
							Save Changes
						</Button>
						<Button
							color="secondary"
							type="button"
							variant="bordered"
							onClick={() => router.push(`/dashboard/threads/${threadId}`)}>
							Cancel
						</Button>
					</div>
					{saveError && <div className="text-danger mt-2">{saveError}</div>}
					{saveSuccess && <div className="text-success mt-2">{saveSuccess}</div>}
				</form>
				<Divider className="my-2" />
				<div>
					<h3 className="font-semibold mb-2 text-default-600">Description Preview</h3>
					<Card className="p-4 bg-default-50 border border-default-200 rounded">
						<ReactMarkdown>{markdownPreview}</ReactMarkdown>
					</Card>
				</div>
				<div className="mt-4 text-xs text-default-400">
					💡 <b>Tip:</b> Use Markdown for formatting. Keep proposals clear and actionable.
				</div>
			</Card>
		</div>
	);
}
