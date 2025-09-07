import { Card, Tooltip } from "@heroui/react";
import {
	UserGroupIcon,
	LockClosedIcon,
	LockOpenIcon,
	ChartBarIcon,
} from "@heroicons/react/24/solid";
import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";
import { motion } from "framer-motion";
import { IGroup } from "@/types";

export interface GroupCardProps {
	group: IGroup;
	href?: string;
}

export default function GroupCard({ group, href }: GroupCardProps) {
	const cardContent = (
		<motion.div
			animate={{ rotate: [1, -1, 1] }}
			transition={{
				repeat: Infinity,
				repeatType: "loop",
				duration: 2,
				ease: "easeInOut",
			}}
			className="bg-background border border-primary/30 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-6 justify-between items-center w-full  h-full ">
			{/* Main card content */}
			<div className="flex md:flex-col sm:flex-row sm:flex-wrap md:flex-nowrap justify-between p-0 gap-2 w-full">
				<div className="flex items-center gap-3">
					<UserGroupIcon className="h-7 w-7 text-primary" />
					<h3 className="font-semibold text-lg text-nowrap truncate">{group.name}</h3>
				</div>
				{group.isPublic ? (
					<span className="flex items-center gap-1 text-success text-xs font-semibold ml-2">
						<LockOpenIcon className="h-4 w-4" /> Public
					</span>
				) : (
					<span className="flex items-center gap-1 text-warning text-xs font-semibold ml-2">
						<LockClosedIcon className="h-4 w-4" /> Private
					</span>
				)}
			</div>
			<div className="flex items-center gap-4 mt-2">
				<span className="flex items-center gap-1 text-zinc-500 text-sm">
					<UserGroupIcon className="h-4 w-4" /> {group.members} members
				</span>
				<Tooltip content="Percentage of active members in the last month">
					<span className="flex items-center gap-1 text-zinc-500 text-sm">
						<ChartBarIcon className="h-4 w-4" /> {group.activity}%
					</span>
				</Tooltip>
			</div>
			<div className="flex justify-end mt-0 w-full">
				{href ? (
					<Link href={href}>View Group</Link>
				) : (
					<Link
						href={`/dashboard/groups/${group.id}`}
						className={buttonStyles({
							color: "secondary",
							radius: "sm",
							variant: "shadow",
							class: "font-bold",
							size: "sm",
						})}>
						View Group
					</Link>
				)}
			</div>
		</motion.div>
	);
	if (href) {
		return <Link href={href}>{cardContent}</Link>;
	}
	return cardContent;
}
