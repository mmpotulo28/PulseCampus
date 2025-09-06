"use client";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useGroup } from "@/hooks/useGroup";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { CreateGroupForm, OrganizationSidePanel } from "../components";
import { InviteUsersToGroup } from "../components";

export default function CreateGroupPage() {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [activity, setActivity] = useState(0);
	const [showInvite, setShowInvite] = useState(false);

	const { organization } = useOrganization();
	const { createGroup, createLoading, createError, createSuccess, groups, group } = useGroup();
	const { isAdmin } = usePermissions();
	const router = useRouter();

	const orgName = organization?.name || "";
	const orgId = organization?.id || "";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin || !orgId) return;
		if (name.length < 3 || desc.length < 10) return;
		if (groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) return;
		await createGroup(name, desc, isPublic, activity);
	};

	// Redirect after success and show invite UI
	if (createSuccess && !createLoading && !createError && !showInvite) {
		setShowInvite(true);
	}

	return (
		<div className="py-8 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="flex-2">
				{showInvite ? (
					<InviteUsersToGroup group={group} />
				) : (
					<CreateGroupForm
						name={name}
						setName={setName}
						desc={desc}
						setDesc={setDesc}
						isPublic={isPublic}
						setIsPublic={setIsPublic}
						activity={activity}
						setActivity={setActivity}
						orgId={orgId}
						orgName={orgName}
						isAdmin={isAdmin}
						createGroup={createGroup}
						createLoading={createLoading}
						createError={createError}
						createSuccess={createSuccess}
						groups={groups}
						handleSubmit={handleSubmit}
					/>
				)}
			</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel isAdmin={isAdmin} groups={groups} />
			</div>
		</div>
	);
}
