"use client";
import Link from "next/link";
import { useOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import { UserGroupIcon, BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { button as buttonStyles } from "@heroui/theme";
import GroupCard from "@/components/GroupCard";
import { groups } from "@/lib/data";
import type { IGroup } from "@/types";
import { Divider } from "@heroui/react";

export default function GroupsPage() {
	const { organization } = useOrganization();

	return (
		<div className="py-8 px-4 max-w-3xl mx-auto">
			<div className="flex flex-row flex-wrap items-center mb-4 justify-between gap-4">
				<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
					<BuildingLibraryIcon className="h-8 w-8 text-primary" />
					Select Your University
				</h2>
				<OrganizationSwitcher />
			</div>

			<Divider className="my-4" />
			{organization ? (
				<>
					<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
						<UserGroupIcon className="h-6 w-6 text-secondary" /> Groups in{" "}
						{organization.name}
					</h3>
					<div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{groups.map((group: IGroup) => (
							<GroupCard key={group.id} group={group} />
						))}
					</div>
					<div className="flex justify-end">
						<Link
							href="/dashboard/groups/create"
							className={buttonStyles({
								color: "primary",
								radius: "full",
								variant: "shadow",
							})}>
							Create New Group
						</Link>
					</div>
				</>
			) : (
				<div className="mt-8 text-center text-zinc-500">
					<p className="text-lg font-semibold mb-2">
						Please select or join your university organization above to view and create
						groups.
					</p>
					<p className="text-sm">
						Organizations represent universities. Groups are created under your selected
						university.
					</p>
				</div>
			)}
		</div>
	);
}
