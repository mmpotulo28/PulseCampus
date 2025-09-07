import type { IGroup } from "@/types";

import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";

export default function GroupActions({ group }: { group: IGroup }) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
      <Link
        className={buttonStyles({
          color: "primary",
          radius: "full",
          variant: "shadow",
          class: "w-full sm:w-auto",
        })}
        href={`/dashboard/groups/${group.id}/invite`}
      >
        Invite Members
      </Link>
      <Link
        className={buttonStyles({
          color: "secondary",
          radius: "full",
          variant: "shadow",
          class: "w-full sm:w-auto",
        })}
        href={`/dashboard/threads/create?groupId=${group.id}`}
      >
        New Proposal
      </Link>
    </div>
  );
}
