import { Card, Divider, User } from "@heroui/react";
import {
	UserGroupIcon,
	ChartBarIcon,
	LockOpenIcon,
	LockClosedIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import type { IGroup } from "@/types";

export default function GroupSidePanel({ group }: { group: IGroup }) {
	return (
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
					{group.isPublic ? "Anyone can join this group." : "Invite only group."}
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
	);
}
