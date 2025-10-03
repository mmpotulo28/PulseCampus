"use client";
import { useEffect, useState } from "react";
import {
	Card,
	Spinner,
	Divider,
	Chip,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Button,
} from "@heroui/react";
import { ChartBarIcon, MessageCircleMore, Vote, UsersIcon } from "lucide-react";
import axios from "axios";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";

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
				setError("Failed to load admin data");
			}
			setLoading(false);
		}
		fetchAll();
	}, []);

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
					<h2 className="text-xl font-bold mb-2">Recent Threads</h2>
					<Table aria-label="Threads Table">
						<TableHeader>
							<TableColumn>Title</TableColumn>
							<TableColumn>Group</TableColumn>
							<TableColumn>Status</TableColumn>
							<TableColumn>Created</TableColumn>
							<TableColumn>Votes</TableColumn>
						</TableHeader>
						<TableBody>
							{threads.slice(0, 10).map((t) => (
								<TableRow key={t.id}>
									<TableCell>{t.title}</TableCell>
									<TableCell>{t.groupId}</TableCell>
									<TableCell>
										<Chip color={t.status === "Open" ? "success" : "danger"}>
											{t.status}
										</Chip>
									</TableCell>
									<TableCell>
										{t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
									</TableCell>
									<TableCell>
										{votes.filter((v) => v.threadId === t.id).length}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Divider className="my-6" />
					<h2 className="text-xl font-bold mb-2">Recent Comments</h2>
					<Table aria-label="Comments Table">
						<TableHeader>
							<TableColumn>User</TableColumn>
							<TableColumn>Thread</TableColumn>
							<TableColumn>Comment</TableColumn>
							<TableColumn>Date</TableColumn>
						</TableHeader>
						<TableBody>
							{comments.slice(0, 10).map((c) => (
								<TableRow key={c.id}>
									<TableCell>{c.name || c.userId}</TableCell>
									<TableCell>{c.threadId}</TableCell>
									<TableCell>{c.text.slice(0, 40)}...</TableCell>
									<TableCell>
										{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Divider className="my-6" />
					<h2 className="text-xl font-bold mb-2">All Groups</h2>
					<Table aria-label="Groups Table">
						<TableHeader>
							<TableColumn>Name</TableColumn>
							<TableColumn>Org</TableColumn>
							<TableColumn>Members</TableColumn>
							<TableColumn>Created</TableColumn>
						</TableHeader>
						<TableBody>
							{groups.slice(0, 10).map((g) => (
								<TableRow key={g.id}>
									<TableCell>{g.name}</TableCell>
									<TableCell>{g.orgId}</TableCell>
									<TableCell>{g.members}</TableCell>
									<TableCell>
										{g.createdAt ? new Date(g.createdAt).toLocaleString() : ""}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Divider className="my-6" />
					<h2 className="text-xl font-bold mb-2">All Users</h2>
					<Table aria-label="Users Table">
						<TableHeader>
							<TableColumn>User ID</TableColumn>
							<TableColumn>Name</TableColumn>
							<TableColumn>Email</TableColumn>
							<TableColumn>Role</TableColumn>
						</TableHeader>
						<TableBody>
							{users.slice(0, 10).map((u) => (
								<TableRow key={u.id}>
									<TableCell>{u.id}</TableCell>
									<TableCell>{u.name}</TableCell>
									<TableCell>{u.email}</TableCell>
									<TableCell>{u.role}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</>
			)}
		</div>
	);
}
