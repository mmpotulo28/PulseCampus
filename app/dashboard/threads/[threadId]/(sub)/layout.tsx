"use client";

import { OrganizationSidePanel } from "@/app/dashboard/groups/components";

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="py-8 px-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="flex-2">{children}</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel />
			</div>
		</div>
	);
}
