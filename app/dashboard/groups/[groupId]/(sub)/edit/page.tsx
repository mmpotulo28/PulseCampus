"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Input, Switch, Divider, Button } from "@heroui/react";
import { PencilSquareIcon, LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/solid";

import { usePermissions } from "@/hooks/usePermissions";
import { useGroup } from "@/hooks/useGroup";
import Loading from "@/app/loading";

export default function EditGroupPage() {
	const { groupId } = useParams();
	const {
		group,
		groupsLoading,
		getGroup,
		updateGroup,
		updateLoading,
		updateError,
		updateSuccess,
	} = useGroup();
	const { isAdmin, isExco } = usePermissions();
	const router = useRouter();

	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [activity, setActivity] = useState(0);

	useEffect(() => {
		if (groupId) getGroup(groupId as string);
	}, [groupId]);

	useEffect(() => {
		if (group) {
			setName(group.name || "");
			setDesc(group.description || "");
			setIsPublic(group.is_public ?? true);
			setActivity(group.activity ?? 0);
		}
	}, [group]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!(isAdmin || isExco) || !groupId) return;
		await updateGroup(groupId as string, {
			name,
			description: desc,
			is_public: isPublic,
			activity,
		});
	};

	// Redirect after successful update
	useEffect(() => {
		if (updateSuccess && !updateLoading && !updateError) {
			setTimeout(() => {
				router.push(`/dashboard/groups/${groupId}`);
			}, 2000);
		}
	}, [updateSuccess, updateLoading, updateError, groupId, router]);

	if (!group && groupsLoading)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Loading />
			</div>
		);

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-primary/20">
			<div className="flex items-center gap-3 mb-2">
				<PencilSquareIcon className="h-7 w-7 text-primary" />
				<h2 className="text-xl font-bold">Edit Group Information</h2>
			</div>
			<p className="text-sm text-default-500 mb-2">
				Update your group details below. Changes are saved instantly for all members.
			</p>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<Input
					required
					description="Choose a clear, unique name for your group."
					disabled={(!isAdmin && !isExco) || updateLoading}
					label="Group Name"
					maxLength={40}
					placeholder="e.g. Tech Society"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					required
					description="Briefly describe your group's purpose and activities."
					disabled={(!isAdmin && !isExco) || updateLoading}
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
						disabled={(!isAdmin && !isExco) || updateLoading}
						isSelected={isPublic}
						size="sm"
						onChange={() => setIsPublic(!isPublic)}
					/>
					<span className="text-sm">
						{isPublic ? (
							<span className="flex items-center gap-1 text-success">
								<LockOpenIcon className="h-4 w-4" /> Public group (anyone can join)
							</span>
						) : (
							<span className="flex items-center gap-1 text-warning">
								<LockClosedIcon className="h-4 w-4" /> Private group (invite only)
							</span>
						)}
					</span>
				</div>
				<Input
					description="Estimated % of active members (last month)."
					disabled={!isAdmin || updateLoading}
					label="Activity (%)"
					max={100}
					min={0}
					placeholder="0"
					type="number"
					value={activity.toString()}
					onChange={(e) => setActivity(Number(e.target.value))}
				/>
				<div className="flex gap-4 mt-2">
					<Button
						color="primary"
						disabled={updateLoading || !name || !desc || (!isAdmin && !isExco)}
						isLoading={updateLoading}
						radius="full"
						type="submit"
						variant="shadow">
						Save Changes
					</Button>
					<Button
						color="secondary"
						radius="full"
						type="button"
						variant="bordered"
						onClick={() => router.push(`/dashboard/groups/${groupId}`)}>
						Cancel
					</Button>
				</div>
				{updateError && <div className="text-danger mt-2">{updateError}</div>}
				{updateSuccess && <div className="text-success mt-2">{updateSuccess}</div>}
			</form>
			<Divider className="my-2" />
		</Card>
	);
}
