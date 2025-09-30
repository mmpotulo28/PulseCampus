import useSWR from "swr";
import axios from "axios";
import { useCallback, useState } from "react";
import type { IGroup } from "@/types";
import { useOrganization } from "@clerk/nextjs";

export function useGroup() {
	const { organization } = useOrganization();

	// Fetcher function for SWR
	const groupsFetcher = useCallback(async (url: string, params: any) => {
		const { data } = await axios.get(url, { params });

		return data.groups || [];
	}, []);

	// Use SWR for fetching groups
	const {
		data: groups = [],
		error: groupsError,
		isLoading: groupsLoading,
		mutate: mutateGroups,
	} = useSWR(
		organization?.id ? [`/api/groups`, { org_id: organization.id }] : null,
		([url, params]) => groupsFetcher(url, params),
	);

	// Fetch single group
	const [group, setGroup] = useState<IGroup | null>(null);
	const [getGroupLoading, setGetGroupLoading] = useState(false);
	const [getGroupError, setGetGroupError] = useState<string | null>(null);

	const getGroup = useCallback(async (groupId: string) => {
		setGetGroupLoading(true);
		setGetGroupError(null);

		try {
			// first check if the group is already in the groups list
			const existingGroup = groups?.find((g: IGroup) => g.id === groupId);

			if (existingGroup) {
				setGroup(existingGroup);
				setGetGroupLoading(false);

				return;
			}
			const { data } = await axios.get(`/api/groups/group`, {
				params: { group_id: groupId },
			});

			setGroup(data.group || null);
		} catch (err: any) {
			setGetGroupError(err.response?.data?.error || "Failed to fetch group");
		} finally {
			setGetGroupLoading(false);
		}
	}, []);

	// Create group
	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [createSuccess, setCreateSuccess] = useState<string | null>(null);

	const createGroup = useCallback(
		async (group: IGroup) => {
			setCreateLoading(true);
			setCreateError(null);
			setCreateSuccess(null);

			try {
				await axios.post("/api/groups", group);
				setCreateSuccess("Group created successfully.");
				await mutateGroups(); // Revalidate groups after creation
			} catch (err: any) {
				setCreateError(err.response?.data?.error || "Failed to create group");
			} finally {
				setCreateLoading(false);
			}
		},
		[mutateGroups],
	);

	// Delete group
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

	const deleteGroup = useCallback(
		async (groupId: string) => {
			setDeleteLoading(true);
			setDeleteError(null);
			setDeleteSuccess(null);

			try {
				await axios.delete(`/api/groups`, {
					params: { group_id: groupId },
				});
				setDeleteSuccess("Group deleted successfully.");
				await mutateGroups(); // Revalidate groups after deletion
			} catch (err: any) {
				setDeleteError(err.response?.data?.error || "Failed to delete group");
			} finally {
				setDeleteLoading(false);
			}
		},
		[mutateGroups],
	);

	// Invite users to group
	const [inviteLoading, setInviteLoading] = useState(false);
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

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
		} finally {
			setInviteLoading(false);
		}
	}, []);

	// Update group
	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

	const updateGroup = useCallback(
		async (groupId: string, updates: Partial<IGroup>) => {
			setUpdateLoading(true);
			setUpdateError(null);
			setUpdateSuccess(null);

			try {
				await axios.put(`/api/groups/group`, updates, {
					params: { group_id: groupId },
				});
				setUpdateSuccess("Group updated successfully.");
				await mutateGroups(); // Revalidate groups after update
			} catch (err: any) {
				setUpdateError(err.response?.data?.error || "Failed to update group");
			} finally {
				setUpdateLoading(false);
			}
		},
		[mutateGroups],
	);

	return {
		groups: groups as IGroup[],
		groupsLoading,
		groupsError,
		mutateGroups,
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
		// update group
		updateGroup,
		updateLoading,
		updateError,
		updateSuccess,
	};
}
