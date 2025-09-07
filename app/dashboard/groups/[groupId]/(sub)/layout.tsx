"use client";
import { OrganizationSidePanel } from "../../components";

import { useGroup } from "@/hooks/useGroup";

const GroupLayout = ({ children }: { children: React.ReactNode }) => {
  const { groups } = useGroup();

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-10 my-10">
      <div className="flex-2">{children}</div>
      <div className="w-full flex-1">
        <OrganizationSidePanel groups={groups} isAdmin={true} />
      </div>
    </div>
  );
};

export default GroupLayout;
