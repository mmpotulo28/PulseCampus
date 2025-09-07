"use client";
import Link from "next/link";
import { useGroup } from "@/hooks/useGroup";
import GroupCard from "@/components/GroupCard";
import { Divider, Spinner } from "@heroui/react";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function MetricsPage() {
	const { groups, groupsLoading, groupsError } = useGroup();

	if (groupsLoading) return <Spinner className="m-auto" />;
	if (groupsError) return <div>Error loading groups</div>;

	return (
		<div className="py-8 px-4 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				<UserGroupIcon className="h-8 w-8 text-primary" />
				Select a Group to View Metrics
			</h2>
			<Divider className="my-4" />
			<div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{groups.map((group) => (
					<GroupCard
						key={group.id}
						group={group}
						href={`/dashboard/metrics/${group.id}`}
					/>
				))}
			</div>
		</div>
	);
}
