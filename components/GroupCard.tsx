import { Button, Tooltip } from "@heroui/react";
import {
	UserGroupIcon,
	LockClosedIcon,
	LockOpenIcon,
	ChartBarIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";

import { IGroup } from "@/types";
import { ExternalLink } from "lucide-react";

export interface GroupCardProps {
	group: IGroup;
	href?: string;
}

export default function GroupCard({ group, href }: GroupCardProps) {
	const cardContent = (
		<motion.div
			animate={{ rotate: [1, -1, 1] }}
			className="bg-background border border-primary/30 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-4 justify-between items-start w-full  h-full "
			transition={{
				repeat: Infinity,
				repeatType: "loop",
				duration: 2,
				ease: "easeInOut",
			}}>
			{/* Main card content */}
			<div className="flex flex-col justify-between p-0 gap-2 w-full">
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
			<div className="flex justify-start mt-0 w-full">
				<Button
					color="secondary"
					size="sm"
					as={Link}
					endContent={<ExternalLink className="h-4 w-4" />}
					href={href || `/dashboard/groups/${group.id}`}>
					View Group
				</Button>
			</div>
		</motion.div>
	);

	return cardContent;
}
