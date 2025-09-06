import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import type { IGroup } from "@/types";

export default function GroupActions({ group }: { group: IGroup }) {
	return (
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
	);
}
