import type { IGroup } from "@/types";

import { Card, Tooltip } from "@heroui/react";
import { UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/solid";

export default function GroupStats({ group }: { group: IGroup }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <Card className="flex items-center gap-3 p-4 rounded-xl bg-background dark:bg-zinc-800 shadow">
        <Tooltip content="Total members in this group">
          <span className="flex items-center gap-2 text-primary font-semibold">
            <UserGroupIcon className="h-5 w-5" /> {group.members} members
          </span>
        </Tooltip>
      </Card>
      <Card className="flex items-center gap-3 p-4 rounded-xl bg-background dark:bg-zinc-800 shadow">
        <Tooltip content="Active member engagement">
          <span className="flex items-center gap-2 text-success font-semibold">
            <ChartBarIcon className="h-5 w-5" /> {group.activity}% active
          </span>
        </Tooltip>
      </Card>
    </div>
  );
}
