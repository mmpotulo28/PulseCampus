"use client";
import { useParams } from "next/navigation";
import { useThreads } from "@/hooks/useThreads";
import { Card, Divider, Button } from "@heroui/react";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { ChartBarIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { OrganizationSidePanel } from "@/app/dashboard/groups/components";
import { useGroup } from "@/hooks/useGroup";
import { usePermissions } from "@/hooks/usePermissions";

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
	const { groups } = useGroup();
	const { isAdmin } = usePermissions();

	return (
		<div className="py-8 px-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="flex-2">{children}</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel groups={groups} isAdmin={isAdmin} />
			</div>
		</div>
	);
}
