import { Card } from "@heroui/react";
import {
	UserGroupIcon,
	LockClosedIcon,
	LockOpenIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import type { IGroup } from "@/types";
import { usePermissions } from "@/hooks/usePermissions";

export default function GroupHeader({ group }: { group: IGroup }) {
	const { isAdmin, isExco } = usePermissions();

	return (
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
				<div className="flex gap-2 ml-auto">
					<Link
						href={`/dashboard/groups/${group.id}/edit`}
						className={buttonStyles({
							color: "secondary",
							radius: "full",
							variant: "bordered",
							size: "sm",
						})}>
						<PencilSquareIcon className="h-5 w-5 mr-1 inline" />
						Edit
					</Link>
					{(isAdmin || isExco) && (
						<Link
							href={`/dashboard/groups/${group.id}/delete`}
							className={buttonStyles({
								color: "danger",
								radius: "full",
								variant: "bordered",
								size: "sm",
							})}>
							<TrashIcon className="h-5 w-5 mr-1 inline" />
							Delete
						</Link>
					)}
				</div>
			</Card>
		</div>
	);
}
