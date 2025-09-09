import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { IGroup } from "@/types";
import { useOrganization } from "@clerk/nextjs";

export function useGroup() {
	const { organization } = useOrganization();
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [groupsLoading, setGroupsLoading] = useState(false);
	const [groupsError, setGroupsError] = useState<string | null>(null);

	const [group, setGroup] = useState<IGroup | null>(null);
	const [getGroupLoading, setGetGroupLoading] = useState(false);
	const [getGroupError, setGetGroupError] = useState<string | null>(null);

	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

	const [inviteLoading, setInviteLoading] = useState(false);
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

	const fetchGroups = useCallback(async (orgId: string) => {
		setGroupsLoading(true);
		setGroupsError(null);

		try {
			const { data } = await axios.get(`/api/groups`, {
				params: { org_id: orgId },
			});
			setGroups(data.groups || []);
		} catch (err: any) {
			setGroupsError(err.response?.data?.error || "Failed to fetch groups");
		}
		setGroupsLoading(false);
	}, []);

	useEffect(() => {
		if (organization?.id) {
			fetchGroups(organization.id);
		}
	}, [organization?.id, fetchGroups]);

	// Fetch single group if groupId is provided
	const getGroup = useCallback(async (groupId: string) => {
		setGetGroupLoading(true);
		setGetGroupError(null);

		try {
			const { data } = await axios.get(`/api/groups/group`, {
				params: { group_id: groupId },
			});
			setGroup(data.group || null);
		} catch (err: any) {
			setGetGroupError(err.response?.data?.error || "Failed to fetch group");
		}
		setGetGroupLoading(false);
	}, []);

	const createGroup = useCallback(
		async (group: IGroup) => {
			setCreateLoading(true);
			setCreateError(null);
			setCreateSuccess(null);

			try {
				const { data } = await axios.post("/api/groups", group);
				console.log("Group created:", data.group);
				setCreateSuccess("Group created successfully.");
				fetchGroups(group.org_id);
			} catch (err: any) {
				setCreateError(err.response?.data?.error || "Failed to create group");
			}
			setCreateLoading(false);
		},
		[fetchGroups],
	);

	const deleteGroup = useCallback(async (groupId: string) => {
		setDeleteLoading(true);
		setDeleteError(null);
		setDeleteSuccess(null);

		try {
			const { data } = await axios.delete(`/api/groups`, {
				params: { group_id: groupId },
			});
			console.log("Group deleted:", data);
			setDeleteSuccess("Group deleted successfully.");
		} catch (err: any) {
			setDeleteError(err.response?.data?.error || "Failed to delete group");
		}
		setDeleteLoading(false);
	}, []);

	const inviteUsersToGroup = useCallback(async (groupId: string, userIds: string[]) => {
		setInviteLoading(true);
		setInviteError(null);
		setInviteSuccess(null);

		try {
			const { data } = await axios.post(`/api/groups/group/invite`, {
				group_id: groupId,
				user_ids: userIds,
			});

			setInviteSuccess(data.message || "Users invited successfully.");
		} catch (err: any) {
			setInviteError(err.response?.data?.error || "Failed to invite users.");
		}

		setInviteLoading(false);
	}, []);

	return {
		groups,
		groupsLoading,
		groupsError,
		// get group
		group,
		getGroup,
		getGroupLoading,
		getGroupError,
		// create group
		createGroup,
		createLoading,
		createError,
		createSuccess,
		// delete group
		deleteGroup,
		deleteLoading,
		deleteError,
		deleteSuccess,
		// invite users to group
		inviteUsersToGroup,
		inviteLoading,
		inviteError,
		inviteSuccess,
	};
}
