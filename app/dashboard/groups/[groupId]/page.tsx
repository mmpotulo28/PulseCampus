"use client";
import { useParams } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { useThreads } from "@/hooks/useThreads";
import { Card, Tooltip, Divider, ScrollShadow, User } from "@heroui/react";
import {
	UserGroupIcon,
	LockClosedIcon,
	LockOpenIcon,
	ChartBarIcon,
	PencilSquareIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";

export default function GroupDetailsPage() {
	const { groupId } = useParams();
	const { organization } = useOrganization();
	const { group, getGroupError, getGroupLoading, getGroup } = useGroup(organization?.id || "");
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
					{/* Header Section */}
					<div className="flex flex-col md:flex-row items-center gap-6 mb-6">
						<Card className="flex-1 flex items-center gap-4 p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
							<UserGroupIcon className="h-12 w-12 text-primary" />
							<div>
								<h1 className="text-2xl font-bold">{group.name}</h1>
								<div className="flex items-center gap-2 mt-1">
									{group.isPublic ? (
										<span className="flex items-center gap-1 text-success text-sm font-semibold">
											<LockOpenIcon className="h-5 w-5" /> Public
										</span>
									) : (
										<span className="flex items-center gap-1 text-warning text-sm font-semibold">
											<LockClosedIcon className="h-5 w-5" /> Private
										</span>
									)}
								</div>
								<p className="mt-2 text-zinc-600 dark:text-zinc-300 text-base">
									{group.description}
								</p>
							</div>
							<Link
								href={`/dashboard/groups/${group.id}/edit`}
								className={buttonStyles({
									color: "secondary",
									radius: "full",
									variant: "bordered",
									class: "ml-auto",
								})}>
								<PencilSquareIcon className="h-5 w-5 mr-1 inline" />
								Edit
							</Link>
						</Card>
					</div>

					{/* Stats Section */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
						<Card className="flex items-center gap-3 p-4 rounded-xl bg-background dark:bg-zinc-800 shadow">
							<Tooltip content="Total members in this group">
								<span className="flex items-center gap-2 text-primary font-semibold">
									<UserGroupIcon className="h-5 w-5" /> {group.members} members
								</span>
							</Tooltip>
						</Card>
						<Card className="flex items-center gap-3 p-4 rounded-xl bg-background dark:bg-zinc-800 shadow">
							<Tooltip content="Active member engagement">
								<span className="flex items-center gap-2 text-success font-semibold">
									<ChartBarIcon className="h-5 w-5" /> {group.activity}% active
								</span>
							</Tooltip>
						</Card>
					</div>

					<Divider className="my-6" />

					{/* Recent Proposals & Threads */}
					<div>
						<h2 className="text-lg font-bold mb-4">Recent Proposals & Threads</h2>
						<ul className="space-y-3">
							{threads.slice(0, 3).map((thread) => (
								<li className="p-4 rounded-xl bg-background dark:bg-zinc-800 shadow flex justify-between items-center">
									<span
										className={`font-semibold ${thread.status === "Open" ? "text-primary" : "text-secondary"}`}>
										{thread.title}
									</span>
									<Link
										href={`/dashboard/threads/${thread.id}`}
										className={`flex items-center justify-center px-4 py-2 rounded-2xl bg-transparent border-2 text-xs ${
											thread.status === "Open"
												? "border-primary text-primary"
												: "border-secondary text-secondary"
										}`}>
										View
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Actions */}
					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
						<Link
							href={`/dashboard/groups/${group.id}/invite`}
							className={buttonStyles({
								color: "primary",
								radius: "full",
								variant: "shadow",
								class: "w-full sm:w-auto",
							})}>
							Invite Members
						</Link>
						<Link
							href={`/dashboard/threads/create?groupId=${group.id}`}
							className={buttonStyles({
								color: "secondary",
								radius: "full",
								variant: "shadow",
								class: "w-full sm:w-auto",
							})}>
							New Proposal
						</Link>
					</div>
				</div>

				{/* Side Metadata & Members Panel */}
				<div className="w-full md:w-80 flex-shrink-0">
					<Card className="p-6 rounded-2xl shadow-lg bg-background dark:bg-zinc-800 flex flex-col gap-4">
						<h3 className="text-lg font-bold mb-2">Group Info</h3>
						<div className="flex flex-col gap-2 text-sm">
							<div>
								<span className="font-semibold">Created:</span>{" "}
								{new Date(group.createdAt || "").toLocaleDateString()}
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Owner:</span>
								<UserIcon className="h-4 w-4 text-primary" />
								{group.owner}
							</div>
							<div>
								<span className="font-semibold">Type:</span>{" "}
								{group.isPublic ? "Public" : "Private"}
							</div>
						</div>
						<Divider className="my-2" />
						<h4 className="font-semibold mb-2">Members</h4>
						<ScrollShadow className="h-70 w-full rounded-2xl dark:bg-zinc-900 border border-default-200">
							<ul className="divide-y divide-default-100">
								{group.membersList?.map((m, idx) => (
									<li
										key={idx}
										className="flex items-center gap-2 py-2 px-2 w-full">
										<User
											name={m.name}
											description={m.role}
											avatarProps={{
												name: m.name,
												className: "bg-primary text-background font-bold",
											}}
										/>
									</li>
								))}
							</ul>
						</ScrollShadow>
					</Card>
				</div>
			</div>
		</div>
	);
}
