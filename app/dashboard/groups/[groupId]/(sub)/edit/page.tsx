"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGroup } from "@/hooks/useGroup";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, Input, Switch, Spinner, Divider, User, Button } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import {
	UserGroupIcon,
	ChartBarIcon,
	PencilSquareIcon,
	LockOpenIcon,
	LockClosedIcon,
	UserIcon,
} from "@heroicons/react/24/solid";

export default function EditGroupPage() {
	const { groupId } = useParams();
	const { group, getGroup, updateGroup, updateLoading, updateError, updateSuccess } = useGroup();
	const { isAdmin } = usePermissions();
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
			setIsPublic(group.isPublic ?? true);
			setActivity(group.activity ?? 0);
		}
	}, [group]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin || !groupId) return;
		await updateGroup(groupId as string, {
			name,
			description: desc,
			isPublic,
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

	if (!group)
		return (
			<div className="py-8 px-4 flex justify-center items-center min-h-[40vh]">
				<Spinner size="lg" color="primary" />
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
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label="Group Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Tech Society"
					required
					disabled={!isAdmin || updateLoading}
					maxLength={40}
					description="Choose a clear, unique name for your group."
				/>
				<Input
					label="Description"
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					placeholder="Describe your group..."
					required
					disabled={!isAdmin || updateLoading}
					maxLength={120}
					description="Briefly describe your group's purpose and activities."
				/>
				<div className="flex items-center gap-3">
					<Switch
						isSelected={isPublic}
						onChange={() => setIsPublic(!isPublic)}
						disabled={!isAdmin || updateLoading}
						size="sm"
						color="primary"
						aria-label="Public group"
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
					label="Activity (%)"
					type="number"
					value={activity.toString()}
					onChange={(e) => setActivity(Number(e.target.value))}
					placeholder="0"
					min={0}
					max={100}
					disabled={!isAdmin || updateLoading}
					description="Estimated % of active members (last month)."
				/>
				<div className="flex gap-4 mt-2">
					<Button
						type="submit"
						color="primary"
						radius="full"
						variant="shadow"
						isLoading={updateLoading}
						disabled={updateLoading || !name || !desc || !isAdmin}>
						Save Changes
					</Button>
					<Button
						type="button"
						color="secondary"
						radius="full"
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
