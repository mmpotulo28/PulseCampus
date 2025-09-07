"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

import { InviteUsersToGroup } from "../../../components";

import { useGroup } from "@/hooks/useGroup";

export default function GroupInvitePage() {
	const { groupId } = useParams();
	const { group, getGroup, getGroupLoading } = useGroup();

	useEffect(() => {
		if (groupId) getGroup(groupId as string);
	}, [groupId]);

	return (
		<div className="py-0 max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-10 my-10">
			{group && <InviteUsersToGroup group={group} />}
			{!group && !getGroupLoading && <div>No group found.</div>}
			{getGroupLoading && (
				<div>
					<Spinner title="Loading group information..." />
				</div>
			)}
		</div>
	);
}
