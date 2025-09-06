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
import { tabs } from "@/lib/data";

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
						{tab.icon && <tab.icon className="h-6 w-6" />}
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
