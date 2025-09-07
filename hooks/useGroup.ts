import type { IGroup } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useOrganization, useUser } from "@clerk/nextjs";

import { usePermissions } from "./usePermissions";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useGroup() {
	const { organization } = useOrganization();
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [groupsLoading, setGroupsLoading] = useState(false);
	const [groupsError, setGroupsError] = useState<string | null>(null);

	const [group, setGroup] = useState<IGroup | null>(null);
	const [getGroupLoading, setGetGroupLoading] = useState(false);
	const [getGroupError, setGetGroupError] = useState<string | null>(null);

	const { user } = useUser();
	const { isAdmin } = usePermissions();

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

	const [inviteLoading, setInviteLoading] = useState(false);
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

	const fetchGroups = useCallback(async () => {
		setGroupsLoading(true);
		setGroupsError(null);
		try {
			let { data, error } = await supabase
				.from("groups")
				.select("*")
				.eq("org_id", organization?.id);

			if (error) throw error;

			setGroups(data || []);
		} catch (err: any) {
			console.error("Error fetching groups:", err);
			setGroupsError(err.message || "Failed to fetch groups");
		} finally {
			setGroupsLoading(false);
		}
	}, [organization?.id]);

	useEffect(() => {
		fetchGroups();
	}, [organization?.id]);

	// Fetch single group if groupId is provided
	const getGroup = useCallback(async (groupId: string) => {
		setGetGroupLoading(true);
		setGetGroupError(null);
		try {
			const { data, error } = await supabase
				.from("groups")
				.select("*")
				.eq("id", groupId)
				.single();

			if (error) throw error;
			setGroup(data);
		} catch (err: any) {
			console.error("Error fetching group:", err);
			setGetGroupError(err.message || "Failed to fetch group");
		} finally {
			setGetGroupLoading(false);
		}
	}, []);

	const createGroup = useCallback(
		async (group: IGroup) => {
			setCreateLoading(true);
			setCreateError(null);
			setCreateSuccess(null);

			if (!isAdmin) {
				setCreateError("Only organization admins can create groups.");
				setCreateLoading(false);

				return;
			}
			if (!organization?.id) {
				setCreateError("No organization selected.");
				setCreateLoading(false);

				return;
			}
			if (group.name.length < 3) {
				setCreateError("Group name must be at least 3 characters.");
				setCreateLoading(false);

				return;
			}
			if (!group.description || group.description.length < 10) {
				setCreateError("Description must be at least 10 characters.");
				setCreateLoading(false);

				return;
			}
			if (groups.some((g) => g.name.toLowerCase() === group.name.toLowerCase())) {
				setCreateError("Group name already exists.");
				setCreateLoading(false);

				return;
			}
			try {
				const { error } = await supabase.from("groups").insert([
					{
						org_id: organization?.id,
						name: group.name,
						description: group.description,
						owner: user?.fullName || user?.id,
						is_public: group.is_public,
						members: 1,
						activity: group.activity,
						members_list: JSON.stringify([{ name: user?.fullName, role: "Admin" }]),
					},
				]);

				if (error) throw error;
				setCreateSuccess("Group created successfully.");
				await fetchGroups();
			} catch (err: any) {
				setCreateError(err.message || "Failed to create group");
			} finally {
				setCreateLoading(false);
			}
		},
		[isAdmin, organization?.id, user, fetchGroups],
	);

	const inviteUsersToGroup = useCallback(async (groupId: string, userIds: string[]) => {
		setInviteLoading(true);
		setInviteError(null);
		setInviteSuccess(null);

		try {
			// Fetch current members_list
			const { data, error } = await supabase
				.from("groups")
				.select("members_list")
				.eq("id", groupId)
				.single();

			if (error) throw error;
			const currentList = data?.members_list || [];
			const newMembers = userIds.map((id) => ({
				name: id,
				role: "Member",
			}));
			const updatedList = [...currentList, ...newMembers];

			// clean duplicates
			const uniqueNames = new Set();
			const dedupedList = updatedList.filter((member) => {
				if (uniqueNames.has(member.name)) {
					return false;
				} else {
					uniqueNames.add(member.name);

					return true;
				}
			});

			const { error: updateError } = await supabase
				.from("groups")
				.update({
					members_list: dedupedList,
					members: dedupedList.length,
				})
				.eq("id", groupId);

			if (updateError) throw updateError;

			setInviteSuccess("Members invited successfully.");
			await fetchGroups();
		} catch (err: any) {
			setInviteError(err.message || "Failed to invite members");
		} finally {
			setInviteLoading(false);
		}
	}, []);

	const updateGroup = useCallback(
		async (
			groupId: string,
			updates: {
				name?: string;
				description?: string;
				isPublic?: boolean;
				activity?: number;
			},
		) => {
			setUpdateLoading(true);
			setUpdateError(null);
			setUpdateSuccess(null);

			try {
				const { error } = await supabase
					.from("groups")
					.update({
						name: updates.name,
						description: updates.description,
						is_public: updates.isPublic,
						activity: updates.activity,
					})
					.eq("id", groupId);

				if (error) throw error;
				setUpdateSuccess("Group updated successfully.");
				await fetchGroups();
				await getGroup(groupId);
			} catch (err: any) {
				setUpdateError(err.message || "Failed to update group");
			} finally {
				setUpdateLoading(false);
			}
		},
		[fetchGroups, getGroup],
	);

	const deleteGroup = useCallback(
		async (groupId: string) => {
			setDeleteLoading(true);
			setDeleteError(null);
			setDeleteSuccess(null);

			try {
				const { error } = await supabase.from("groups").delete().eq("id", groupId);

				if (error) throw error;
				setDeleteSuccess("Group deleted successfully.");
				await fetchGroups();
			} catch (err: any) {
				setDeleteError(err.message || "Failed to delete group");
			} finally {
				setDeleteLoading(false);
			}
		},
		[fetchGroups],
	);

	return {
		groups,
		groupsLoading,
		groupsError,
		// get group
		group,
		getGroupLoading,
		getGroupError,
		getGroup,
		// create group
		createGroup,
		createLoading,
		createError,
		createSuccess,
		// invite users
		inviteUsersToGroup,
		inviteLoading,
		inviteError,
		inviteSuccess,
		// update group
		updateGroup,
		updateLoading,
		updateError,
		updateSuccess,
		// delete group
		deleteGroup,
		deleteLoading,
		deleteError,
		deleteSuccess,
	};
}
