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

export default function AdminThreadsPage() {
	const [loading, setLoading] = useState(true);
	const [threads, setThreads] = useState<any[]>([]);
	const [votes, setVotes] = useState<any[]>([]);
	const [nominations, setNominations] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [threadsRes, votesRes, nominationsRes] = await Promise.all([
					axios.get("/api/admin/threads"),
					axios.get("/api/admin/votes"),
					axios
						.get("/api/admin/nominations")
						.catch(() => ({ data: { nominations: [] } })),
				]);

				setThreads(threadsRes.data.threads || []);
				setVotes(votesRes.data.votes || []);
				setNominations(nominationsRes.data.nominations || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load threads data");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const totalThreads = threads.length;
	const openThreads = threads.filter((t) => t.status === "Open").length;
	const closedThreads = threads.filter((t) => t.status === "Closed").length;

	const threadVoteCounts: Record<string, number> = {};

	votes.forEach((v) => {
		threadVoteCounts[v.threadId] = (threadVoteCounts[v.threadId] || 0) + 1;
	});
	const topThreads = [...threads]
		.map((t) => ({ ...t, votes: threadVoteCounts[t.id || ""] || 0 }))
		.sort((a, b) => b.votes - a.votes)
		.slice(0, 5);

	const topNominees = useMemo(() => {
		const nomineeVoteCounts: Record<string, number> = {};

		votes.forEach((v) => {
			nomineeVoteCounts[v.vote] = (nomineeVoteCounts[v.vote] || 0) + 1;
		});

		return nominations
			.map((n) => ({
				...n,
				votes: nomineeVoteCounts[n.id || ""] || 0,
				thread: threads.find((t) => t.id === n.threadId),
			}))
			.sort((a, b) => b.votes - a.votes)
			.slice(0, 5);
	}, [votes, nominations, threads]);

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6">All Threads Insights</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading threads...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<Card className="p-6 mb-8">
						<div className="flex flex-wrap gap-6 items-center">
							<Chip color="primary" variant="flat">
								Total Threads: {totalThreads}
							</Chip>
							<Chip color="success" variant="flat">
								Open: {openThreads}
							</Chip>
							<Chip color="danger" variant="flat">
								Closed: {closedThreads}
							</Chip>
						</div>
						<Divider className="my-4" />
						<h2 className="font-semibold mb-2">Top Performing Threads</h2>
						<ul className="flex flex-wrap gap-4">
							{topThreads.map((t) => (
								<li key={t.id} className="text-sm">
									<Chip color="primary" variant="flat">
										{t.title}: {t.votes} votes
									</Chip>
								</li>
							))}
						</ul>
						<Divider className="my-4" />
						<h2 className="font-semibold mb-2">Top Nominees (MCQ)</h2>
						<ul className="flex flex-wrap gap-4">
							{topNominees.map((n) => (
								<li key={n.id} className="text-sm">
									<Chip color="warning" variant="flat">
										{n.label || n.name} ({n.thread?.title || n.threadId}):{" "}
										{n.votes} votes
									</Chip>
								</li>
							))}
						</ul>
					</Card>
					<Card className="p-6">
						<Table aria-label="Threads Table">
							<TableHeader>
								<TableColumn>Title</TableColumn>
								<TableColumn>Group</TableColumn>
								<TableColumn>Status</TableColumn>
								<TableColumn>Created</TableColumn>
								<TableColumn>Votes</TableColumn>
							</TableHeader>
							<TableBody>
								{threads.map((t) => (
									<TableRow key={t.id}>
										<TableCell>{t.title}</TableCell>
										<TableCell>{t.groupId}</TableCell>
										<TableCell>
											<Chip
												color={t.status === "Open" ? "success" : "danger"}>
												{t.status}
											</Chip>
										</TableCell>
										<TableCell>
											{t.createdAt
												? new Date(t.createdAt).toLocaleString()
												: ""}
										</TableCell>
										<TableCell>{threadVoteCounts[t.id] || 0}</TableCell>
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
