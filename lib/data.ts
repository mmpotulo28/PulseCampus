import {
	ChatBubbleLeftRightIcon,
	ChartBarIcon,
	Cog6ToothIcon,
	HomeIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from "react";

export interface ITab {
	label: string;
	href: string;
	icon: ForwardRefExoticComponent<
		Omit<SVGProps<SVGSVGElement>, "ref"> & {
			title?: string | undefined;
			titleId?: string | undefined;
		} & RefAttributes<SVGSVGElement>
	>;
}

export const tabs: ITab[] = [
	{ label: "Home", href: "/", icon: HomeIcon },
	{ label: "Groups", href: "/dashboard/groups", icon: UserGroupIcon },
	{
		label: "Threads",
		href: "/dashboard/threads",
		icon: ChatBubbleLeftRightIcon,
	},
	{ label: "Metrics", href: "/dashboard/metrics", icon: ChartBarIcon },
	{ label: "Settings", href: "/settings", icon: Cog6ToothIcon },
];
