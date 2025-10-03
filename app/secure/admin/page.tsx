"use client";
import { useEffect, useState } from "react";
import { Card, Spinner, Divider } from "@heroui/react";
import { ChartBarIcon, MessageCircleMore, Vote, UsersIcon } from "lucide-react";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import axios from "axios";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";

const COLORS = ["#6366f1", "#f59e42", "#10b981", "#3b82f6", "#f43f5e"];

function StatCard({
	icon,
	label,
	value,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
	color: string;
}) {
	return (
		<Card
			className={`flex flex-col items-center justify-center p-6 rounded-xl shadow bg-gradient-to-br from-${color}/10 to-background/80 border-0`}>
			<div className="mb-2">{icon}</div>
			<div className="text-2xl font-bold">{value}</div>
			<div className="text-sm text-default-500">{label}</div>
		</Card>
	);
}

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<any>({});
	const [groups, setGroups] = useState<any[]>([]);
	const [threads, setThreads] = useState<any[]>([]);
	const [votes, setVotes] = useState<any[]>([]);
	const [comments, setComments] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchAll() {
			setLoading(true);
			setError(null);
			try {
				const [groupsRes, threadsRes, votesRes, commentsRes, usersRes] = await Promise.all([
					axios.get("/api/admin/groups"),
					axios.get("/api/admin/threads"),
					axios.get("/api/admin/votes"),
					axios.get("/api/admin/comments"),
					axios.get("/api/admin/users"),
				]);

				setGroups(groupsRes.data.groups || []);
				setThreads(threadsRes.data.threads || []);
				setVotes(votesRes.data.votes || []);
				setComments(commentsRes.data.comments || []);
				setUsers(usersRes.data.users || []);
				setStats({
					groups: groupsRes.data.groups?.length || 0,
					threads: threadsRes.data.threads?.length || 0,
					votes: votesRes.data.votes?.length || 0,
					comments: commentsRes.data.comments?.length || 0,
					users: usersRes.data.users?.length || 0,
				});
			} catch (err: any) {
				console.error(err);
				setError("Failed to load admin data");
			}
			setLoading(false);
		}
		fetchAll();
	}, []);

	// Example chart data
	const threadsByGroup = groups.map((g) => ({
		name: g.name,
		Threads: threads.filter((t) => t.groupId === g.id).length,
	}));
	const votesByThread = threads.map((t) => ({
		name: t.title,
		Votes: votes.filter((v) => v.threadId === t.id).length,
	}));
	const commentsByThread = threads.map((t) => ({
		name: t.title,
		Comments: comments.filter((c) => c.threadId === t.id).length,
	}));

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading admin insights...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
						<StatCard
							icon={<UserGroupIcon className="h-8 w-8 text-primary" />}
							label="Groups"
							value={stats.groups}
							color="primary"
						/>
						<StatCard
							icon={<ChartBarIcon className="h-8 w-8 text-secondary" />}
							label="Threads"
							value={stats.threads}
							color="secondary"
						/>
						<StatCard
							icon={<Vote className="h-8 w-8 text-success" />}
							label="Votes"
							value={stats.votes}
							color="success"
						/>
						<StatCard
							icon={<MessageCircleMore className="h-8 w-8 text-info" />}
							label="Comments"
							value={stats.comments}
							color="info"
						/>
						<StatCard
							icon={<UsersIcon className="h-8 w-8 text-warning" />}
							label="Users"
							value={stats.users}
							color="warning"
						/>
					</div>
					<Divider className="my-6" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card className="p-6">
							<h2 className="font-bold mb-4">Threads per Group</h2>
							{threadsByGroup.length === 0 ? (
								<div className="text-default-400 text-sm">No data</div>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<BarChart data={threadsByGroup}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="Threads" fill="#6366f1" />
									</BarChart>
								</ResponsiveContainer>
							)}
						</Card>
						<Card className="p-6">
							<h2 className="font-bold mb-4">Votes per Thread</h2>
							{votesByThread.length === 0 ? (
								<div className="text-default-400 text-sm">No data</div>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<BarChart data={votesByThread}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="Votes" fill="#10b981" />
									</BarChart>
								</ResponsiveContainer>
							)}
						</Card>
						<Card className="p-6">
							<h2 className="font-bold mb-4">Comments per Thread</h2>
							{commentsByThread.length === 0 ? (
								<div className="text-default-400 text-sm">No data</div>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<BarChart data={commentsByThread}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="Comments" fill="#f59e42" />
									</BarChart>
								</ResponsiveContainer>
							)}
						</Card>
						<Card className="p-6">
							<h2 className="font-bold mb-4">User Distribution</h2>
							{users.length === 0 ? (
								<div className="text-default-400 text-sm">No data</div>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<PieChart>
										<Pie
											data={users}
											dataKey="role"
											nameKey="role"
											cx="50%"
											cy="50%"
											outerRadius={80}
											fill="#8884d8"
											label={(entry: any) => entry.role}>
											{users.map((_entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							)}
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
