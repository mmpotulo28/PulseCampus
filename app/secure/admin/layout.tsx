"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBarIcon, MessageCircleMore, Vote, UsersIcon } from "lucide-react";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import clsx from "clsx";

const adminNav = [
	{ label: "Overview", href: "/secure/admin", icon: <ChartBarIcon className="h-5 w-5" /> },
	{ label: "Threads", href: "/secure/admin/threads", icon: <ChartBarIcon className="h-5 w-5" /> },
	{ label: "Groups", href: "/secure/admin/groups", icon: <UserGroupIcon className="h-5 w-5" /> },
	{ label: "Votes", href: "/secure/admin/votes", icon: <Vote className="h-5 w-5" /> },
	{
		label: "Comments",
		href: "/secure/admin/comments",
		icon: <MessageCircleMore className="h-5 w-5" />,
	},
	{ label: "Users", href: "/secure/admin/users", icon: <UsersIcon className="h-5 w-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-background to-primary/5">
			<main className="flex-1 p-6">{children}</main>
			<aside className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 border-l border-default-200 shadow-lg flex flex-col z-40">
				<div className="p-6 border-b border-default-200">
					<h2 className="text-xl font-bold text-primary mb-2">Admin Panel</h2>
					<p className="text-xs text-default-500">PulseCampus Insights</p>
				</div>
				<nav className="flex-1 flex flex-col gap-1 mt-4">
					{adminNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={clsx(
								"flex items-center gap-3 px-6 py-3 text-base font-medium rounded-l-full transition-colors",
								pathname === item.href
									? "bg-primary/10 text-primary"
									: "hover:bg-primary/5 text-default-700 dark:text-default-300",
							)}>
							{item.icon}
							{item.label}
						</Link>
					))}
				</nav>
				<div className="mt-auto p-6 text-xs text-default-400">
					&copy; {new Date().getFullYear()} PulseCampus
				</div>
			</aside>
		</div>
	);
}
