import { Card, Button, Tooltip } from "@heroui/react";
import ThreadInsights from "@/components/ThreadInsights";
import type { IVoteWithCounts, IThread } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useNominations } from "@/hooks/useNominations";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { useState } from "react";

interface InsightsPanelProps {
	votes: IVoteWithCounts;
	thread: IThread;
}

export default function InsightsPanel({ votes, thread }: InsightsPanelProps) {
	const { user } = useUser();
	const { nominations, addNomination, addNominationLoading, addNominationSuccess } =
		useNominations(thread.id || "");
	const [nominated, setNominated] = useState(false);
	const { isAdmin, isExco } = usePermissions();

	const isMCQ = thread.vote_type === "mcq";

	const handleNominateSelf = async () => {
		if (!user || !thread.id) return;
		const alreadyNominated = nominations.some(
			(n) => n.user_id === user.id || n.email === user.emailAddresses?.[0]?.emailAddress,
		);
		if (alreadyNominated) return;
		await addNomination({
			nomination: {
				id: "",
				thread_id: thread.id,
				name: user.fullName || user.username || "Anonymous",
				user_id: user.id,
				email: user.emailAddresses?.[0]?.emailAddress || "",
				label: user.fullName || user.username || "Anonymous",
				key: user.id || "",
			},
			threadId: thread.id,
		});
		setNominated(true);
	};

	return (
		<>
			<ThreadInsights
				yesVotes={votes?.voteCounts.yes}
				noVotes={votes?.voteCounts.no}
				totalMembers={thread?.totalMembers || 0}
			/>
			{isMCQ && (
				<Card className="mt-4 p-4 rounded-2xl shadow bg-primary/5 border border-primary/20 flex flex-col gap-3 items-center">
					<h4 className="font-semibold text-primary mb-2">Nominate Yourself</h4>
					<p className="text-sm text-default-600 mb-2 text-center">
						Want to be considered for this vote? Nominate yourself as a candidate!
					</p>
					<div className="flex gap-4 items-center">
						<Button
							color="primary"
							radius="full"
							variant="shadow"
							isLoading={addNominationLoading}
							disabled={
								addNominationLoading ||
								nominated ||
								nominations.some(
									(n) =>
										n.user_id === user?.id ||
										n.email === user?.emailAddresses?.[0]?.emailAddress,
								)
							}
							onPress={handleNominateSelf}>
							{nominated || addNominationSuccess
								? "You are nominated!"
								: "Nominate Myself"}
						</Button>
						{(isAdmin || isExco) && (
							<Link
								href={`/dashboard/threads/${thread.id}/invite-nominee`}
								className="bg-secondary text-background px-4 py-2 rounded-full font-semibold hover:bg-primary transition text-sm"
								title="Invite a nominee to this thread">
								Invite Nominee
							</Link>
						)}
					</div>
					{nominations.some(
						(n) =>
							n.user_id === user?.id ||
							n.email === user?.emailAddresses?.[0]?.emailAddress,
					) && (
						<Tooltip content="You are already nominated for this thread.">
							<span className="text-success text-xs mt-2">Already Nominated</span>
						</Tooltip>
					)}
				</Card>
			)}
		</>
	);
}
