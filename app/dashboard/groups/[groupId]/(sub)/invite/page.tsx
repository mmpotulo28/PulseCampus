"use client";
import { useParams } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { InviteUsersToGroup, OrganizationSidePanel } from "../../../components";

export default function GroupInvitePage() {
	const { groupId } = useParams();
	const { organization } = useOrganization();
	const { group, getGroup, groups } = useGroup();

	useEffect(() => {
		if (groupId) getGroup(groupId as string);
	}, [groupId]);

	return (
		<div className="py-8 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<InviteUsersToGroup group={group} />
		</div>
	);
}
