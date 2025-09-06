"use client";
import { useParams } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { useThreads } from "@/hooks/useThreads";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";

import GroupHeader from "@/components/groups/GroupHeader";
import GroupStats from "@/components/groups/GroupStats";
import GroupThreadsList from "@/components/groups/GroupThreadsList";
import GroupActions from "@/components/groups/GroupActions";
import GroupSidePanel from "@/components/groups/GroupSidePanel";

export default function GroupDetailsPage() {
	const { groupId } = useParams();
	const { organization } = useOrganization();
	const { group, getGroupError, getGroupLoading, getGroup } = useGroup();
	const { threads } = useThreads(groupId as string);

	useEffect(() => {
		getGroup(groupId as string);
	}, [groupId, organization]);

	if (getGroupLoading) return <div>Loading...</div>;
	if (getGroupError || !group) {
		return (
			<div className="py-12 px-4 max-w-2xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4 text-danger">Group Not Found</h2>
				<p className="text-zinc-500">The group you are looking for does not exist.</p>
				<Link
					href="/dashboard/groups"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}>
					Back to Groups
				</Link>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 max-w-5xl mx-auto">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Main Content */}
				<div className="flex-1">
					<GroupHeader group={group} />
					<GroupStats group={group} />
					<GroupThreadsList threads={threads} />
					<GroupActions group={group} />
				</div>
				{/* Side Metadata & Members Panel */}
				<div className="w-full md:w-80 flex-shrink-0">
					<GroupSidePanel group={group} />
				</div>
			</div>
		</div>
	);
}
