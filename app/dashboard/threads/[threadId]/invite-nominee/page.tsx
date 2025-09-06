"use client";
import { useParams, useRouter } from "next/navigation";
import { useThreads } from "@/hooks/useThreads";
import { useNominations } from "@/hooks/useNominations";
import { usePermissions } from "@/hooks/usePermissions";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, Input, Button, Spinner, Divider } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";

export default function InviteNomineePage() {
	const { threadId } = useParams();
	const { getThread, thread, threadLoading, threadError } = useThreads();
	const {
		nominations,
		addNomination,
		addNominationLoading,
		addNominationError,
		addNominationSuccess,
	} = useNominations(threadId as string);
	const { isAdmin, isExco } = usePermissions();
	const { user } = useUser();
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (threadId) getThread(threadId as string);
	}, [threadId]);

	const handleInvite = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin && !isExco) return;
		if (!threadId || !name || !email) return;
		const alreadyNominated = nominations.some((n) => n.email === email || n.name === name);
		if (alreadyNominated) {
			setInviteSuccess("Nominee already invited.");
			return;
		}
		await addNomination({
			nomination: {
				key: "",
				id: "",
				thread_id: threadId as string,
				name,
				user_id: "",
				email,
				label: name,
			},
			threadId: threadId as string,
		});
		setInviteSuccess("Nominee invited successfully!");
		setName("");
		setEmail("");
	};

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-primary/20 max-w-lg mx-auto mt-10">
			<h2 className="text-xl font-bold mb-2">Invite Nominee to Thread</h2>
			<p className="text-sm text-default-500 mb-2">
				Enter the nominee's name and email address to invite them to this voting thread.
			</p>
			<form onSubmit={handleInvite} className="flex flex-col gap-4">
				<Input
					label="Nominee Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Full name"
					required
					disabled={addNominationLoading}
					maxLength={60}
				/>
				<Input
					label="Nominee Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="nominee@email.com"
					required
					disabled={addNominationLoading}
					maxLength={80}
				/>
				<Button
					type="submit"
					color="primary"
					radius="full"
					variant="shadow"
					isLoading={addNominationLoading}
					disabled={addNominationLoading || !name || !email || (!isAdmin && !isExco)}
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}>
					Invite Nominee
				</Button>
				{addNominationError && <div className="text-danger mt-2">{addNominationError}</div>}
				{inviteSuccess && <div className="text-success mt-2">{inviteSuccess}</div>}
				{addNominationSuccess && (
					<div className="text-success mt-2">{addNominationSuccess}</div>
				)}
			</form>
			<Divider className="my-2" />
			<Link
				href={`/dashboard/threads/${threadId}`}
				className={buttonStyles({
					color: "secondary",
					radius: "full",
					variant: "bordered",
				})}>
				Back to Thread
			</Link>
		</Card>
	);
}
