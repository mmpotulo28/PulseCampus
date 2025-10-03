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

export default function AdminCommentsPage() {
	const [loading, setLoading] = useState(true);
	const [comments, setComments] = useState<any[]>([]);
	const [threads, setThreads] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [commentsRes, threadsRes] = await Promise.all([
					axios.get("/api/admin/comments"),
					axios.get("/api/admin/threads"),
				]);

				setComments(commentsRes.data.comments || []);
				setThreads(threadsRes.data.threads || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load comments data");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const totalComments = comments.length;
	const avgCommentsPerThread = useMemo(
		() => (threads.length ? Math.round(totalComments / threads.length) : 0),
		[totalComments, threads.length],
	);
	const commenterCounts: Record<string, number> = {};

	comments.forEach((c) => {
		commenterCounts[c.userId] = (commenterCounts[c.userId] || 0) + 1;
	});
	const topCommenters = Object.entries(commenterCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6">All Comments Insights</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading comments...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<Card className="p-6 mb-8">
						<div className="flex flex-wrap gap-6 items-center">
							<Chip color="primary" variant="flat">
								Total Comments: {totalComments}
							</Chip>
							<Chip color="secondary" variant="flat">
								Avg Comments per Thread: {avgCommentsPerThread}
							</Chip>
						</div>
						<Divider className="my-4" />
						<h2 className="font-semibold mb-2">Top Commenters</h2>
						<ul className="flex flex-wrap gap-4">
							{topCommenters.map(([userId, count]) => (
								<li key={userId} className="text-sm">
									<Chip color="success" variant="flat">
										{userId}: {count} comments
									</Chip>
								</li>
							))}
						</ul>
					</Card>
					<Card className="p-6">
						<Table aria-label="Comments Table">
							<TableHeader>
								<TableColumn>User</TableColumn>
								<TableColumn>Thread</TableColumn>
								<TableColumn>Comment</TableColumn>
								<TableColumn>Date</TableColumn>
							</TableHeader>
							<TableBody>
								{comments.map((c) => (
									<TableRow key={c.id}>
										<TableCell>{c.name || c.userId}</TableCell>
										<TableCell>{c.threadId}</TableCell>
										<TableCell>{c.text.slice(0, 40)}...</TableCell>
										<TableCell>
											{c.createdAt
												? new Date(c.createdAt).toLocaleString()
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
