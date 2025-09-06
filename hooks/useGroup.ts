import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { IGroup } from "@/types";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useGroup(orgId: string) {
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [groupsLoading, setGroupsLoading] = useState(false);
	const [groupsError, setGroupsError] = useState<string | null>(null);

	const [group, setGroup] = useState<IGroup | null>(null);
	const [getGroupLoading, setGetGroupLoading] = useState(false);
	const [getGroupError, setGetGroupError] = useState<string | null>(null);

	const fetchGroups = async () => {
		setGroupsLoading(true);
		setGroupsError(null);
		try {
			let { data, error } = await supabase.from("groups").select("*").eq("org_id", orgId);
			if (error) throw error;

			setGroups(data || []);
		} catch (err: any) {
			console.error("Error fetching groups:", err);
			setGroupsError(err.message || "Failed to fetch groups");
		} finally {
			setGroupsLoading(false);
		}
	};

	useEffect(() => {
		fetchGroups();
	}, [orgId]);

	// Fetch single group if groupId is provided
	const getGroup = async (groupId: string) => {
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
	};

	return {
		groups,
		groupsLoading,
		groupsError,
		// get group
		group,
		getGroupLoading,
		getGroupError,
		getGroup,
	};
}
