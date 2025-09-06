"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	UserGroupIcon,
	ChatBubbleLeftRightIcon,
	ChartBarIcon,
	HomeIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

const tabs = [
	{ label: "Home", href: "/", icon: <HomeIcon className="h-6 w-6" /> },
	{ label: "Groups", href: "/dashboard/groups", icon: <UserGroupIcon className="h-6 w-6" /> },
	{
		label: "Threads",
		href: "/dashboard/threads",
		icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
	},
	{ label: "Metrics", href: "/dashboard/metrics", icon: <ChartBarIcon className="h-6 w-6" /> },
	{ label: "Settings", href: "/settings", icon: <Cog6ToothIcon className="h-6 w-6" /> },
];

export default function MobileTabs() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-default-200 shadow-lg flex justify-around items-center h-16 md:hidden">
			{tabs.map((tab) => {
				const active =
					pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={clsx(
							"flex flex-col items-center justify-center flex-1 py-2 transition-all",
							active
								? "text-primary font-bold"
								: "text-default-500 hover:text-primary",
						)}
						aria-label={tab.label}>
						{tab.icon}
						<span
							className={clsx("text-xs mt-1", active ? "font-bold" : "font-normal")}>
							{tab.label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}
