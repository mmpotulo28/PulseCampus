import { useGroup } from "@/hooks/useGroup";
import { usePermissions } from "@/hooks/usePermissions";
import { useOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import { BuildingLibraryIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";
import { Divider, User } from "@heroui/react";
import { Snippet } from "@heroui/snippet";
import { SparklesIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";

export function OrganizationSidePanel() {
	const { organization } = useOrganization();
	const { groups } = useGroup();
	const { isAdmin, isExco } = usePermissions();

	return (
		<Card className="p-6 rounded-2xl max-w-md shadow-lg bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:bg-zinc-800 flex flex-col gap-4 border-2 border-primary/20">
			<div className="flex items-center gap-3 mb-2">
				<BuildingLibraryIcon className="h-7 w-7 text-primary" />
				<h3 className="text-lg font-bold">Organization Info</h3>
				<SparklesIcon className="h-5 w-5 text-secondary animate-pulse" />
			</div>
			{organization ? (
				<>
					<User
						avatarProps={{
							name: organization.name,
							className: "bg-primary text-background font-bold",
						}}
						description={organization.slug}
						name={organization.name}
					/>
					<Divider className="my-2" />
					<div className="flex flex-col gap-2 text-sm">
						<div className="flex items-center gap-2 flex-col">
							<div className="flex items-start gap-2 w-full">
								<ShieldCheckIcon className="h-4 w-4 text-success" />
								<span className="font-semibold">Org ID:</span>
							</div>
							<Snippet hideSymbol size="sm">
								{organization.id}
							</Snippet>
						</div>
						<div className="flex items-center gap-2">
							<UserGroupIcon className="h-4 w-4 text-primary" />
							<span className="font-semibold">Your Role:</span>
							<span className={isAdmin ? "text-success" : "text-secondary"}>
								{isAdmin && "Admin"}
								{!isExco && "Exco"}
								{!isAdmin || (!isExco && "Member")}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<UsersIcon className="h-4 w-4 text-secondary" />
							<span className="font-semibold">Groups:</span>
							<span>{groups?.length}</span>
						</div>
					</div>
					<Divider className="my-2" />
					<div className="text-xs text-default-500 flex flex-col gap-2">
						<span>
							<ShieldCheckIcon className="h-4 w-4 text-success inline mr-1" />
							Groups are created under your selected organization.
						</span>
						<span>
							<UserGroupIcon className="h-4 w-4 text-primary inline mr-1" />
							Only admins can create groups.
						</span>
						<span>
							<SparklesIcon className="h-4 w-4 text-secondary inline mr-1" />
							Invite members and customize your group after creation!
						</span>
					</div>
					<Divider className="mt-2" />
					<OrganizationSwitcher />
				</>
			) : (
				<div className="text-sm text-danger flex flex-col items-center gap-2">
					No organization selected. Please select your university below.
					<Divider className="mt-2" />
					<OrganizationSwitcher />
				</div>
			)}
		</Card>
	);
}
