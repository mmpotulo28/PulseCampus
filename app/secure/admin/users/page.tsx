"use client";
import { useEffect, useState, useMemo } from "react";
import {
	Card,
	Spinner,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Divider,
	Chip,
} from "@heroui/react";
import axios from "axios";

export default function AdminUsersPage() {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<any[]>([]);
	const [votes, setVotes] = useState<any[]>([]);
	const [comments, setComments] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [usersRes, votesRes, commentsRes] = await Promise.all([
					axios.get("/api/admin/users"),
					axios.get("/api/admin/votes"),
					axios.get("/api/admin/comments"),
				]);

				setUsers(usersRes.data.users || []);
				setVotes(votesRes.data.votes || []);
				setComments(commentsRes.data.comments || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load users data");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const totalUsers = users.length;
	const roleCounts = useMemo(() => {
		const counts: Record<string, number> = {};

		users.forEach((u) => {
			const role = u.role || "Member";

			counts[role] = (counts[role] || 0) + 1;
		});

		return counts;
	}, [users]);
	const userActivity: Record<string, number> = {};

	votes.forEach((v) => {
		userActivity[v.userId] = (userActivity[v.userId] || 0) + 1;
	});
	comments.forEach((c) => {
		userActivity[c.userId] = (userActivity[c.userId] || 0) + 1;
	});
	const topUsers = [...users]
		.map((u) => ({
			...u,
			activity: userActivity[u.id] || 0,
		}))
		.sort((a, b) => b.activity - a.activity)
		.slice(0, 5);

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6">All Users Insights</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading users...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<Card className="p-6 mb-8">
						<div className="flex flex-wrap gap-6 items-center">
							<Chip color="primary" variant="flat">
								Total Users: {totalUsers}
							</Chip>
							{Object.entries(roleCounts).map(([role, count]) => (
								<Chip key={role} color="secondary" variant="flat">
									{role}: {count}
								</Chip>
							))}
						</div>
						<Divider className="my-4" />
						<h2 className="font-semibold mb-2">Most Active Users</h2>
						<ul className="flex flex-wrap gap-4">
							{topUsers.map((u) => (
								<li key={u.id} className="text-sm">
									<Chip color="success" variant="flat">
										{u.name}: {u.activity} actions
									</Chip>
								</li>
							))}
						</ul>
					</Card>
					<Card className="p-6">
						<Table aria-label="Users Table">
							<TableHeader>
								<TableColumn>User ID</TableColumn>
								<TableColumn>Name</TableColumn>
								<TableColumn>Email</TableColumn>
								<TableColumn>Role</TableColumn>
							</TableHeader>
							<TableBody>
								{users.map((u) => (
									<TableRow key={u.id}>
										<TableCell>{u.id}</TableCell>
										<TableCell>{u.name}</TableCell>
										<TableCell>{u.email}</TableCell>
										<TableCell>{u.role}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</>
			)}
		</div>
	);
}
