"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, Button, Divider } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/solid";

import { usePermissions } from "@/hooks/usePermissions";
import { useGroup } from "@/hooks/useGroup";
import Loading from "@/app/loading";

export default function DeleteGroupPage() {
	const { groupId } = useParams();
	const {
		group,
		groupsLoading,
		getGroup,
		deleteGroup,
		deleteLoading,
		deleteError,
		deleteSuccess,
	} = useGroup();
	const { isAdmin } = usePermissions();
	const router = useRouter();

	useEffect(() => {
		if (groupId) getGroup(groupId as string);
	}, [groupId]);

	const handleDelete = async () => {
		if (!isAdmin || !groupId) return;
		await deleteGroup(groupId as string);
	};

	// Redirect after successful delete
	useEffect(() => {
		if (deleteSuccess && !deleteLoading && !deleteError) {
			setTimeout(() => {
				router.push("/dashboard/groups");
			}, 2000);
		}
	}, [deleteSuccess, deleteLoading, deleteError, router]);

	if (!group && groupsLoading)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Loading />
			</div>
		);

	return (
		<Card className="p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 flex flex-col gap-6 border border-danger/20">
			<div className="flex items-center gap-3 mb-2">
				<TrashIcon className="h-7 w-7 text-danger" />
				<h2 className="text-xl font-bold">Delete Group</h2>
			</div>
			<p className="text-danger font-semibold mb-4">
				Are you sure you want to delete this group? This action cannot be undone.
			</p>
			<div className="flex gap-4 mt-2">
				<Button
					color="danger"
					disabled={deleteLoading || !isAdmin}
					isLoading={deleteLoading}
					radius="full"
					type="button"
					variant="shadow"
					onClick={handleDelete}>
					Delete Group
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
			{deleteError && <div className="text-danger mt-2">{deleteError}</div>}
			{deleteSuccess && <div className="text-success mt-2">{deleteSuccess}</div>}
			<Divider className="my-2" />
		</Card>
	);
}
