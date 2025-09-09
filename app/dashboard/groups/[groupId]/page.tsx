"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

import { useGroup } from "@/hooks/useGroup";
import { useThreads } from "@/hooks/useThreads";
import dynamic from "next/dynamic";

// dynamic import to prevent hydration issues
const GroupHeader = dynamic(() => import("@/components/groups/GroupHeader"), { ssr: false });
const GroupStats = dynamic(() => import("@/components/groups/GroupStats"), { ssr: false });
const GroupThreadsList = dynamic(() => import("@/components/groups/GroupThreadsList"), {
	ssr: false,
});
const GroupActions = dynamic(() => import("@/components/groups/GroupActions"), { ssr: false });
const GroupSidePanel = dynamic(() => import("@/components/groups/GroupSidePanel"), { ssr: false });

export default function GroupDetailsPage() {
	const { groupId } = useParams();
	const { organization } = useOrganization();
	const { group, getGroupError, getGroupLoading, getGroup } = useGroup();
	const { threads } = useThreads(groupId as string);

	useEffect(() => {
		getGroup(groupId as string);
	}, [groupId, organization]);

	if (getGroupLoading) return <Spinner className="m-auto" />;
	if (getGroupError || !group) {
		return (
			<div className="py-12 px-4 max-w-2xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4 text-danger">Group Not Found</h2>
				<p className="text-zinc-500">The group you are looking for does not exist.</p>
				<Link
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "mt-6",
					})}
					href="/dashboard/groups">
					Back to Groups
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto">
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
