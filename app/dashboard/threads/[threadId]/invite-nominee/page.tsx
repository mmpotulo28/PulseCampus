"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Input, Button, Divider } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";

import { usePermissions } from "@/hooks/usePermissions";
import { useNominations } from "@/hooks/useNominations";
import { useThreads } from "@/hooks/useThreads";

export default function InviteNomineePage() {
	const { threadId } = useParams();
	const { getThread } = useThreads();
	const {
		nominations,
		addNomination,
		addNominationLoading,
		addNominationError,
		addNominationSuccess,
	} = useNominations(threadId as string);
	const { isAdmin, isExco } = usePermissions();

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
			id: "",
			threadId: threadId as string,
			name,
			userId: "",
			email,
			label: name,
		});
		setInviteSuccess("Nominee invited successfully!");
		setName("");
		setEmail("");
	};

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-primary/20 max-w-lg mx-auto mt-10">
			<h2 className="text-xl font-bold mb-2">Invite Nominee to Thread</h2>
			<p className="text-sm text-default-500 mb-2">
				Enter the nominee&apos;s name and email address to invite them to this voting
				thread.
			</p>
			<form className="flex flex-col gap-4" onSubmit={handleInvite}>
				<Input
					required
					disabled={addNominationLoading}
					label="Nominee Name"
					maxLength={60}
					placeholder="Full name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					required
					disabled={addNominationLoading}
					label="Nominee Email"
					maxLength={80}
					placeholder="nominee@email.com"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}
					color="primary"
					disabled={addNominationLoading || !name || !email || (!isAdmin && !isExco)}
					isLoading={addNominationLoading}
					radius="full"
					type="submit"
					variant="shadow">
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
				className={buttonStyles({
					color: "secondary",
					radius: "full",
					variant: "bordered",
				})}
				href={`/dashboard/threads/${threadId}`}>
				Back to Thread
			</Link>
		</Card>
	);
}
