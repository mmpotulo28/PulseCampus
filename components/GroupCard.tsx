import { Card } from "@heroui/react";
import {
	UserGroupIcon,
	LockClosedIcon,
	LockOpenIcon,
	ChartBarIcon,
} from "@heroicons/react/24/solid";
import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";
import { motion } from "framer-motion";

export interface GroupCardProps {
	id: string;
	name: string;
	members: number;
	isPublic: boolean;
	activity: number; // e.g. % active members
}

export default function GroupCard({ id, name, members, isPublic, activity }: GroupCardProps) {
	return (
		<motion.div
			animate={{ rotate: [2, -2, 2] }}
			transition={{
				repeat: Infinity,
				repeatType: "loop",
				duration: 2,
				ease: "easeInOut",
			}}
			className="bg-background border border-primary/30 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-6 justify-between items-center w-full  h-full ">
			{/* Main card content */}
			<div className="flex flex-col p-0 gap-2 w-full">
				<div className="flex items-center gap-3">
					<UserGroupIcon className="h-7 w-7 text-primary" />
					<h3 className="font-semibold text-lg">{name}</h3>
				</div>
				{isPublic ? (
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
					<UserGroupIcon className="h-4 w-4" /> {members} members
				</span>
				<span className="flex items-center gap-1 text-zinc-500 text-sm">
					<ChartBarIcon className="h-4 w-4" /> {activity}% active
				</span>
			</div>
			<div className="flex justify-end mt-0">
				<Link
					href={`/dashboard/groups/${id}`}
					className={buttonStyles({
						color: "secondary",
						radius: "full",
						variant: "shadow",
						class: "font-bold",
					})}>
					View Group
				</Link>
			</div>
		</motion.div>
	);
}
