"use client";
import { OrganizationSidePanel } from "../../components";

const GroupLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="flex-2">{children}</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel />
			</div>
		</div>
	);
};

export default GroupLayout;
