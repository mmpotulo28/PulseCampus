import {
	Spinner,
	Switch,
	Card,
	Divider,
	User,
	Snippet,
	Checkbox,
	Input,
	cn,
	Chip,
	CheckboxGroup,
	Button,
} from "@heroui/react";
import {
	BuildingLibraryIcon,
	UserGroupIcon,
	ShieldCheckIcon,
	UsersIcon,
	SparklesIcon,
} from "@heroicons/react/24/solid";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { OrganizationMembershipResource } from "@clerk/types";
import { ClipboardIcon } from "@heroicons/react/24/solid";

import { useGroup } from "@/hooks/useGroup";
import { DiscordIcon, TwitterIcon } from "@/components/icons";
import { usePermissions } from "@/hooks/usePermissions";
import { CreateGroupFormProps, IGroup } from "@/types";

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
	name,
	setName,
	desc,
	setDesc,
	isPublic,
	setIsPublic,
	activity,
	setActivity,
	orgId,
	orgName,
	isAdmin,
	createLoading,
	createError,
	createSuccess,
	groups,
	handleSubmit,
}) => {
	return (
		<>
			<h2 className="text-xl font-bold mb-4">Create a New Group</h2>
			<div className="mb-2 text-sm text-default-500">
				Organization: <span className="font-semibold">{orgName || "None selected"}</span>
				{!orgId && <span className="text-danger ml-2">Select an organization first.</span>}
			</div>
			<div className="mb-2 text-sm text-default-500">
				Your Role:{" "}
				<span className={isAdmin ? "text-success" : "text-danger"}>
					{isAdmin ? "Admin" : "Not Admin"}
				</span>
			</div>
			{!isAdmin && (
				<div className="mb-4 text-danger font-semibold">
					Only organization admins can create groups.
				</div>
			)}
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<Input
					required
					description="Choose a unique name for your group (min 3 chars)."
					disabled={!isAdmin || !orgId || createLoading}
					errorMessage={
						name.length > 0 && name.length < 3
							? "Group name too short."
							: groups.some((g) => g.name.toLowerCase() === name.toLowerCase())
								? "Group name already exists."
								: undefined
					}
					label="Group Name"
					maxLength={40}
					placeholder="e.g. Tech Society"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					required
					description="Briefly describe your group's purpose (min 10 chars)."
					disabled={!isAdmin || !orgId || createLoading}
					errorMessage={
						desc.length > 0 && desc.length < 10 ? "Description too short." : undefined
					}
					label="Description"
					maxLength={120}
					placeholder="Describe your group..."
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
				/>
				<div className="flex items-center gap-3">
					<Switch
						aria-label="Public group"
						color="primary"
						disabled={!isAdmin || !orgId || createLoading}
						isSelected={isPublic}
						size="sm"
						onChange={() => setIsPublic(!isPublic)}
					/>
					<span className="text-sm">
						{isPublic
							? "Public group (anyone can join)"
							: "Private group (invite only)"}
					</span>
				</div>
				<Input
					description="Estimated % of active members (optional, default 0)."
					disabled={!isAdmin || !orgId || createLoading}
					label="Initial Activity (%)"
					max={100}
					min={0}
					placeholder="0"
					type="number"
					value={activity.toString()}
					onChange={(e) => setActivity(Number(e.target.value))}
				/>
				<button
					className="bg-primary text-background px-4 py-2 rounded-full font-semibold hover:bg-secondary transition"
					disabled={
						createLoading ||
						!name ||
						!desc ||
						!isAdmin ||
						!orgId ||
						name.length < 3 ||
						desc.length < 10 ||
						groups.some((g) => g.name.toLowerCase() === name.toLowerCase())
					}
					type="submit">
					{createLoading ? <Spinner size="sm" /> : "Create Group"}
				</button>
				{createError && <div className="text-danger mt-2">{createError}</div>}
				{createSuccess && <div className="text-success mt-2">{createSuccess}</div>}
			</form>
		</>
	);
};

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
							<span>{groups.length}</span>
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

function generateInviteToken(groupId: string) {
	// Simple token: base64 of groupId + random string + timestamp
	const rand =
		typeof window !== "undefined"
			? window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
			: Math.random().toString(36).slice(2);
	const payload = `${groupId}:${rand}:${Date.now()}`;

	return btoa(payload);
}

function encodeInviteUrl(groupId: string) {
	const token = generateInviteToken(groupId);
	// Encrypt/encode params (for demo, base64 encode groupId and token)
	const params = btoa(JSON.stringify({ groupId, token }));

	return `/dashboard/groups/${groupId}/join?token=${encodeURIComponent(token)}&data=${encodeURIComponent(params)}`;
}

export function InviteUsersToGroup({ group }: { group: IGroup }) {
	const { organization } = useOrganization();
	const { inviteUsersToGroup, inviteLoading, inviteError, inviteSuccess } = useGroup();
	const [selected, setSelected] = useState<string[]>([]);
	const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		async function fetchMembers() {
			if (!organization) return;

			const memberships = await organization?.getMemberships();

			setMembers(memberships.data || []);
		}

		fetchMembers();
	}, [organization]);

	const handleInvite = async () => {
		if (!group || selected.length === 0) return;
		await inviteUsersToGroup(group.id, selected);
	};

	const inviteLink = group?.id
		? typeof window !== "undefined"
			? `${window.location.origin}${encodeInviteUrl(group.id)}`
			: encodeInviteUrl(group.id)
		: "";

	const handleCopy = () => {
		if (!inviteLink) return;
		navigator.clipboard.writeText(inviteLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleShare = (platform: "twitter" | "discord") => {
		const text = encodeURIComponent(`Join our group on PulseCampus! ${inviteLink}`);

		if (platform === "twitter") {
			window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
		} else if (platform === "discord") {
			window.open(`https://discord.com/channels/@me?text=${text}`, "_blank");
		}
	};

	return (
		<div className=" p-0 mt-0">
			<h2 className="text-xl font-bold mb-4">Invite Members to Your Group</h2>
			<p className="mb-2 text-sm text-default-500">
				Select organization members to invite, or share the invite link below.
			</p>
			{/* Shareable Invite Link */}
			<div className="flex flex-col gap-2 mb-4">
				<Snippet hideSymbol className="w-full max-w-md overflow-auto">
					<span className="w-full truncate max-w-sm">{inviteLink}</span>
				</Snippet>
				<div className="flex justify-start gap-4 w-full">
					<button
						className="p-2 rounded bg-primary/10 hover:bg-primary/20 transition"
						title="Copy link"
						type="button"
						onClick={handleCopy}>
						<ClipboardIcon className="h-5 w-5 text-primary" />
					</button>
					{copied && (
						<span className="text-success text-xs font-semibold ml-2">Copied!</span>
					)}
					<button
						className="p-2 rounded bg-secondary/10 hover:bg-secondary/20 transition"
						title="Share on Twitter"
						type="button"
						onClick={() => handleShare("twitter")}>
						<TwitterIcon className="h-5 w-5 text-secondary" />
					</button>
					<button
						className="p-2 rounded bg-success/10 hover:bg-success/20 transition"
						title="Share on Discord"
						type="button"
						onClick={() => handleShare("discord")}>
						<DiscordIcon className="h-5 w-5 text-success" />
					</button>
				</div>
			</div>
			<CheckboxGroup
				defaultValue={members.map((m) => m.publicUserData?.identifier || "")}
				label="Select Members to invite"
				onValueChange={(set) => setSelected(set)}>
				{members?.map((m) => (
					<Checkbox
						key={m.publicUserData?.identifier}
						aria-label={m.publicUserData?.firstName || "User"}
						checked={
							m.publicUserData?.userId
								? selected.includes(m.publicUserData.userId)
								: false
						}
						className={cn(
							"inline-flex max-w-md w-full bg-content1 m-0",
							"hover:bg-content2 items-center justify-start",
							"cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
							"data-[selected=true]:border-primary",
						)}
						value={m.publicUserData?.userId || ""}>
						<div className="w-full flex justify-between gap-2">
							<User
								avatarProps={{ size: "md", src: m.publicUserData?.imageUrl }}
								description={m.publicUserData?.identifier}
								name={`${m.publicUserData?.firstName} ${m.publicUserData?.lastName}`}
							/>
							<div className="flex flex-col items-end gap-1">
								<Chip color="success" size="sm" variant="flat">
									{m.role}
								</Chip>
							</div>
						</div>
					</Checkbox>
				))}
			</CheckboxGroup>
			<Divider className="my-4" />
			<Button
				color="primary"
				isLoading={inviteLoading}
				disabled={inviteLoading || selected.length === 0}
				type="button"
				onClick={handleInvite}>
				{inviteLoading ? "Inviting..." : "Invite Selected"}
			</Button>
			{inviteError && <div className="text-danger mt-2">{inviteError}</div>}
			{inviteSuccess && <div className="text-success mt-2">{inviteSuccess}</div>}
		</div>
	);
}
