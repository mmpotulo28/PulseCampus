import { useEffect, useState } from "react";
import axios from "axios";
import type { IGroup, IThread, IVote, IComment, INomination } from "@/types";

export interface AdminInsights {
	loading: boolean;
	error: string | null;
	groups: IGroup[];
	threads: IThread[];
	votes: IVote[];
	comments: IComment[];
	users: any[];
	nominations: INomination[];
	// Totals
	totalGroups: number;
	totalThreads: number;
	totalVotes: number;
	totalComments: number;
	totalUsers: number;
	totalNominations: number;
	// Growth
	groupsGrowth: number;
	threadsGrowth: number;
	votesGrowth: number;
	commentsGrowth: number;
	usersGrowth: number;
	// Engagement
	avgVotesPerThread: number;
	avgCommentsPerThread: number;
	avgThreadsPerGroup: number;
	avgMembersPerGroup: number;
	avgNominationsPerThread: number;
	// Top
	topGroups: IGroup[];
	topThreads: IThread[];
	topUsers: any[];
	topVoters: any[];
	topCommenters: any[];
	topNominees: INomination[];
	// Activity
	activityHeatmap: Record<string, number>;
	// Marketing
	mostActiveDay: string;
	mostActiveHour: string;
	highestEngagementThread: IThread | null;
	highestEngagementGroup: IGroup | null;
	retentionRate: number;
	churnRate: number;
}

export function useAdmin() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [threads, setThreads] = useState<IThread[]>([]);
	const [votes, setVotes] = useState<IVote[]>([]);
	const [comments, setComments] = useState<IComment[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [nominations, setNominations] = useState<INomination[]>([]);

	useEffect(() => {
		async function fetchAll() {
			setLoading(true);
			setError(null);
			try {
				const [groupsRes, threadsRes, votesRes, commentsRes, usersRes, nominationsRes] =
					await Promise.all([
						axios.get("/api/admin/groups"),
						axios.get("/api/admin/threads"),
						axios.get("/api/admin/votes"),
						axios.get("/api/admin/comments"),
						axios.get("/api/admin/users"),
						axios
							.get("/api/admin/nominations")
							.catch(() => ({ data: { nominations: [] } })),
					]);

				setGroups(groupsRes.data.groups || []);
				setThreads(threadsRes.data.threads || []);
				setVotes(votesRes.data.votes || []);
				setComments(commentsRes.data.comments || []);
				setUsers(usersRes.data.users || []);
				setNominations(nominationsRes.data.nominations || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load admin data");
			}
			setLoading(false);
		}
		fetchAll();
	}, []);

	// Totals
	const totalGroups = groups.length;
	const totalThreads = threads.length;
	const totalVotes = votes.length;
	const totalComments = comments.length;
	const totalUsers = users.length;
	const totalNominations = nominations.length;

	// Growth (last 30 days vs previous 30 days)
	const calcGrowth = (arr: { createdAt?: Date | string }[]) => {
		const now = new Date();
		const last30 = arr.filter(
			(i) =>
				i.createdAt &&
				new Date(i.createdAt).getTime() > now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).length;
		const prev30 = arr.filter(
			(i) =>
				i.createdAt &&
				new Date(i.createdAt).getTime() > now.getTime() - 60 * 24 * 60 * 60 * 1000 &&
				new Date(i.createdAt).getTime() <= now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).length;

		return prev30 === 0 ? 100 : ((last30 - prev30) / prev30) * 100;
	};
	const groupsGrowth = calcGrowth(groups);
	const threadsGrowth = calcGrowth(threads);
	const votesGrowth = calcGrowth(votes.map((v) => ({ createdAt: v.createdAt || "" })));
	const commentsGrowth = calcGrowth(comments);
	const usersGrowth = calcGrowth(users);

	// Engagement
	const avgVotesPerThread = totalThreads ? totalVotes / totalThreads : 0;
	const avgCommentsPerThread = totalThreads ? totalComments / totalThreads : 0;
	const avgThreadsPerGroup = totalGroups ? totalThreads / totalGroups : 0;
	const avgMembersPerGroup = totalGroups
		? groups.reduce((sum, g) => sum + (g.members || 0), 0) / totalGroups
		: 0;
	const avgNominationsPerThread = totalThreads ? totalNominations / totalThreads : 0;

	// Top Groups (by members)
	const topGroups = [...groups].sort((a, b) => (b.members || 0) - (a.members || 0)).slice(0, 5);

	// Top Threads (by votes)
	const threadVoteCounts: Record<string, number> = {};

	votes.forEach((v) => {
		threadVoteCounts[v.threadId] = (threadVoteCounts[v.threadId] || 0) + 1;
	});
	const topThreads = [...threads]
		.map((t) => ({ ...t, votes: threadVoteCounts[t.id || ""] || 0 }))
		.sort((a, b) => b.votes - a.votes)
		.slice(0, 5);

	// Top Users (by activity)
	const userActivity: Record<string, number> = {};

	comments.forEach((c) => {
		userActivity[c.userId] = (userActivity[c.userId] || 0) + 1;
	});
	votes.forEach((v) => {
		userActivity[v.userId] = (userActivity[v.userId] || 0) + 1;
	});
	const topUsers = [...users]
		.map((u) => ({
			...u,
			activity: userActivity[u.id] || 0,
		}))
		.sort((a, b) => b.activity - a.activity)
		.slice(0, 5);

	// Top Voters
	const voterCounts: Record<string, number> = {};

	votes.forEach((v) => {
		voterCounts[v.userId] = (voterCounts[v.userId] || 0) + 1;
	});
	const topVoters = [...users]
		.map((u) => ({
			...u,
			votes: voterCounts[u.id] || 0,
		}))
		.sort((a, b) => b.votes - a.votes)
		.slice(0, 5);

	// Top Commenters
	const commenterCounts: Record<string, number> = {};

	comments.forEach((c) => {
		commenterCounts[c.userId] = (commenterCounts[c.userId] || 0) + 1;
	});
	const topCommenters = [...users]
		.map((u) => ({
			...u,
			comments: commenterCounts[u.id] || 0,
		}))
		.sort((a, b) => b.comments - a.comments)
		.slice(0, 5);

	// Top Nominees (by votes)
	const nomineeVoteCounts: Record<string, number> = {};

	votes.forEach((v) => {
		nomineeVoteCounts[v.vote] = (nomineeVoteCounts[v.vote] || 0) + 1;
	});
	const topNominees = [...nominations]
		.map((n) => ({
			...n,
			votes: nomineeVoteCounts[n.id || ""] || 0,
		}))
		.sort((a, b) => b.votes - a.votes)
		.slice(0, 5);

	// Activity Heatmap (day of week, hour)
	const activityHeatmap: Record<string, number> = {};

	[...votes, ...comments].forEach((item) => {
		const date = new Date(item.createdAt || "");
		const day = date.toLocaleDateString("en-US", { weekday: "short" });
		const hour = date.getHours();
		const key = `${day}-${hour}`;

		activityHeatmap[key] = (activityHeatmap[key] || 0) + 1;
	});

	// Most active day/hour
	const dayCounts: Record<string, number> = {};
	const hourCounts: Record<string, number> = {};

	Object.keys(activityHeatmap).forEach((key) => {
		const [day, hour] = key.split("-");

		dayCounts[day] = (dayCounts[day] || 0) + activityHeatmap[key];
		hourCounts[hour] = (hourCounts[hour] || 0) + activityHeatmap[key];
	});
	const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
	const mostActiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

	// Highest engagement thread/group
	const highestEngagementThread =
		threads
			.map((t) => ({
				...t,
				engagement:
					((threadVoteCounts[t.id || ""] || 0) +
						comments.filter((c) => c.threadId === t.id).length) /
					(t.totalMembers || 1),
			}))
			.sort((a, b) => b.engagement - a.engagement)[0] || null;

	const groupThreadCounts: Record<string, number> = {};

	threads.forEach((t) => {
		groupThreadCounts[t.groupId] = (groupThreadCounts[t.groupId] || 0) + 1;
	});
	const highestEngagementGroup =
		groups
			.map((g) => ({
				...g,
				engagement:
					(groupThreadCounts[g.id || ""] || 0) +
					threads
						.filter((t) => t.groupId === g.id)
						.reduce((sum, t) => sum + (threadVoteCounts[t.id || ""] || 0), 0),
			}))
			.sort((a, b) => b.engagement - a.engagement)[0] || null;

	// Retention & Churn (simplified: users active in last 30 days / total users)
	const now = new Date();
	const activeUserIds = new Set(
		[...votes, ...comments]
			.filter(
				(i) =>
					i.createdAt &&
					new Date(i.createdAt).getTime() > now.getTime() - 30 * 24 * 60 * 60 * 1000,
			)
			.map((i) => i.userId),
	);
	const retentionRate = totalUsers ? (activeUserIds.size / totalUsers) * 100 : 0;
	const churnRate = 100 - retentionRate;

	return {
		loading,
		error,
		groups,
		threads,
		votes,
		comments,
		users,
		nominations,
		totalGroups,
		totalThreads,
		totalVotes,
		totalComments,
		totalUsers,
		totalNominations,
		groupsGrowth,
		threadsGrowth,
		votesGrowth,
		commentsGrowth,
		usersGrowth,
		avgVotesPerThread,
		avgCommentsPerThread,
		avgThreadsPerGroup,
		avgMembersPerGroup,
		avgNominationsPerThread,
		topGroups,
		topThreads,
		topUsers,
		topVoters,
		topCommenters,
		topNominees,
		activityHeatmap,
		mostActiveDay,
		mostActiveHour,
		highestEngagementThread,
		highestEngagementGroup,
		retentionRate,
		churnRate,
	} as AdminInsights;
}
