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
					<Card className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:bg-zinc-800 flex flex-col gap-6 border-2 border-primary/20">
						<div className="flex items-center gap-2 mb-2">
							<UserGroupIcon className="h-7 w-7 text-primary" />
							<h3 className="text-lg font-bold">Group Info</h3>
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2">
								<span className="font-semibold">Created:</span>
								<span className="bg-background px-2 py-1 rounded text-xs font-mono border border-default-200">
									{new Date(group.createdAt || "").toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Owner:</span>
								<UserIcon className="h-4 w-4 text-primary" />
								<span className="bg-primary/10 px-2 py-1 rounded text-xs font-semibold">
									{group.owner}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Type:</span>
								{group.isPublic ? (
									<span className="flex items-center gap-1 text-success font-semibold">
										<LockOpenIcon className="h-4 w-4" /> Public
									</span>
								) : (
									<span className="flex items-center gap-1 text-warning font-semibold">
										<LockClosedIcon className="h-4 w-4" /> Private
									</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Members:</span>
								<span className="bg-success/10 px-2 py-1 rounded text-xs font-semibold">
									{group.members}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Activity:</span>
								<span className="bg-secondary/10 px-2 py-1 rounded text-xs font-semibold">
									{group.activity}% active
								</span>
								<ChartBarIcon className="h-4 w-4 text-secondary" />
							</div>
						</div>
						<Divider className="my-2" />
						<h4 className="font-semibold mb-2 flex items-center gap-2">
							<UserGroupIcon className="h-5 w-5 text-primary" />
							Members
						</h4>
						<div className="max-h-48 overflow-y-auto rounded-2xl dark:bg-zinc-900 border border-default-200 bg-background">
							<ul className="divide-y divide-default-100">
								{group.membersList?.map((m, idx) => (
									<li
										key={idx}
										className="flex items-center gap-2 py-2 px-2 w-full hover:bg-primary/5 transition">
										<User
											name={m.name}
											description={m.role}
											avatarProps={{
												name: m.name,
												className: "bg-primary text-background font-bold",
											}}
										/>
										<span
											className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${m.role === "Admin" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}`}>
											{m.role}
										</span>
									</li>
								))}
							</ul>
						</div>
						<Divider className="my-2" />
						<div className="text-xs text-default-500 flex flex-col gap-1">
							<span>
								<ChartBarIcon className="h-4 w-4 text-success inline mr-1" />
								Engagement: <span className="font-semibold">{group.activity}%</span>
							</span>
							<span>
								<LockOpenIcon className="h-4 w-4 text-primary inline mr-1" />
								{group.isPublic
									? "Anyone can join this group."
									: "Invite only group."}
							</span>
							<span>
								For advanced branding or support,{" "}
								<a href="/contact" className="underline text-primary">
									contact us
								</a>
								.
							</span>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
