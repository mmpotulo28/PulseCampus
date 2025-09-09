"use client";
import { Divider, Spinner, Tabs, Tab } from "@heroui/react";
import { UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

import { useGroup } from "@/hooks/useGroup";
import { useThreads } from "@/hooks/useThreads";
import GroupCard from "@/components/GroupCard";
import ThreadCard from "@/components/ThreadCard";

export default function MetricsPage() {
	const { groups, groupsLoading, groupsError } = useGroup();
	const { threads, threadsLoading, threadsError } = useThreads();

	if (groupsLoading || threadsLoading) return <Spinner className="m-auto" />;
	if (groupsError || threadsError) return <div>Error loading data</div>;

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				<UserGroupIcon className="h-8 w-8 text-primary" />
				Metrics Dashboard
			</h2>
			<Divider className="my-4" />
			<Tabs aria-label="Metrics Tabs" variant="underlined">
				<Tab
					key="groups"
					title={
						<div className="flex items-center space-x-2">
							<UserGroupIcon className="h-5 w-5" />
							<span>Groups</span>
						</div>
					}>
					<div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{groups.map((group) => (
							<GroupCard
								key={group.id}
								group={group}
								href={`/dashboard/metrics/${group.id}`}
							/>
						))}
					</div>
				</Tab>
				<Tab
					key="threads"
					title={
						<div className="flex items-center space-x-2">
							<DocumentTextIcon className="h-5 w-5" />
							<span>Threads</span>
						</div>
					}>
					<div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{threads.map((thread) => (
							<ThreadCard
								key={thread.id}
								thread={thread}
								href={`/dashboard/threads/${thread.id}/metrics`}
							/>
						))}
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}
