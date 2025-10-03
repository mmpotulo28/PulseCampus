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

export default function AdminGroupsPage() {
	const [loading, setLoading] = useState(true);
	const [groups, setGroups] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const res = await axios.get("/api/admin/groups");

				setGroups(res.data.groups || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load groups data");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const totalGroups = groups.length;
	const avgMembers = useMemo(
		() =>
			totalGroups
				? Math.round(groups.reduce((sum, g) => sum + (g.members || 0), 0) / totalGroups)
				: 0,
		[groups, totalGroups],
	);
	const topGroups = useMemo(
		() => [...groups].sort((a, b) => (b.members || 0) - (a.members || 0)).slice(0, 5),
		[groups],
	);

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6">All Groups Insights</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading groups...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<Card className="p-6 mb-8">
						<div className="flex flex-wrap gap-6 items-center">
							<Chip color="primary" variant="flat">
								Total Groups: {totalGroups}
							</Chip>
							<Chip color="secondary" variant="flat">
								Avg Members per Group: {avgMembers}
							</Chip>
						</div>
						<Divider className="my-4" />
						<h2 className="font-semibold mb-2">Top Groups by Members</h2>
						<ul className="flex flex-wrap gap-4">
							{topGroups.map((g) => (
								<li key={g.id} className="text-sm">
									<Chip color="success" variant="flat">
										{g.name}: {g.members} members
									</Chip>
								</li>
							))}
						</ul>
					</Card>
					<Card className="p-6">
						<Table aria-label="Groups Table">
							<TableHeader>
								<TableColumn>Name</TableColumn>
								<TableColumn>Org</TableColumn>
								<TableColumn>Members</TableColumn>
								<TableColumn>Created</TableColumn>
							</TableHeader>
							<TableBody>
								{groups.map((g) => (
									<TableRow key={g.id}>
										<TableCell>{g.name}</TableCell>
										<TableCell>{g.orgId}</TableCell>
										<TableCell>{g.members}</TableCell>
										<TableCell>
											{g.createdAt
												? new Date(g.createdAt).toLocaleString()
												: ""}
										</TableCell>
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
