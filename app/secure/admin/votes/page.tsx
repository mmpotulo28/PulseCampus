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

function getTopNominees(votes: any[], threads: any[], nominations: any[]) {
	// Only MCQ threads
	const mcqThreads = threads.filter((t) => t.voteType === "mcq");
	const nomineeVoteCounts: Record<string, number> = {};

	votes.forEach((v) => {
		nomineeVoteCounts[v.vote] = (nomineeVoteCounts[v.vote] || 0) + 1;
	});
	const topNominees = nominations
		.map((n) => ({
			...n,
			votes: nomineeVoteCounts[n.id || ""] || 0,
			thread: mcqThreads.find((t) => t.id === n.threadId),
		}))
		.sort((a, b) => b.votes - a.votes)
		.slice(0, 5);

	return topNominees;
}

export default function AdminVotesPage() {
	const [loading, setLoading] = useState(true);
	const [votes, setVotes] = useState<any[]>([]);
	const [threads, setThreads] = useState<any[]>([]);
	const [nominations, setNominations] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			setError(null);
			try {
				const [votesRes, threadsRes, nominationsRes] = await Promise.all([
					axios.get("/api/admin/votes"),
					axios.get("/api/admin/threads"),
					axios
						.get("/api/admin/nominations")
						.catch(() => ({ data: { nominations: [] } })),
				]);

				setVotes(votesRes.data.votes || []);
				setThreads(threadsRes.data.threads || []);
				setNominations(nominationsRes.data.nominations || []);
			} catch (err: any) {
				console.error(err);
				setError("Failed to load votes data");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const totalVotes = votes.length;
	const mcqVotes = votes.filter((v) =>
		threads.find((t) => t.id === v.threadId && t.voteType === "mcq"),
	);
	const topNominees = useMemo(
		() => getTopNominees(mcqVotes, threads, nominations),
		[mcqVotes, threads, nominations],
	);

	const voteDistribution = useMemo(() => {
		const dist: Record<string, number> = {};

		votes.forEach((v) => {
			dist[v.vote] = (dist[v.vote] || 0) + 1;
		});

		return dist;
	}, [votes]);

	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6">All Votes Insights</h1>
			{loading ? (
				<div className="flex items-center gap-2 text-default-500">
					<Spinner color="secondary" size="sm" />
					<span>Loading votes...</span>
				</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
					<Card className="p-6 mb-8">
						<div className="flex flex-wrap gap-6 items-center">
							<Chip color="primary" variant="flat">
								Total Votes: {totalVotes}
							</Chip>
							<Chip color="secondary" variant="flat">
								Unique Voters: {new Set(votes.map((v) => v.userId)).size}
							</Chip>
							<Chip color="success" variant="flat">
								MCQ Votes: {mcqVotes.length}
							</Chip>
						</div>
						<Divider className="my-4" />
						<div>
							<h2 className="font-semibold mb-2">Vote Distribution</h2>
							<ul className="flex flex-wrap gap-4">
								{Object.entries(voteDistribution).map(([vote, count]) => (
									<li key={vote} className="text-sm">
										<Chip color="primary" variant="flat">
											{vote}: {count}
										</Chip>
									</li>
								))}
							</ul>
						</div>
					</Card>
					<Card className="p-6 mb-8">
						<h2 className="font-bold mb-4">Top Voted Nominees (MCQ)</h2>
						{topNominees.length === 0 ? (
							<div className="text-default-400 text-sm">No MCQ votes yet.</div>
						) : (
							<Table aria-label="Top Nominees Table">
								<TableHeader>
									<TableColumn>Nominee</TableColumn>
									<TableColumn>Votes</TableColumn>
									<TableColumn>Thread</TableColumn>
								</TableHeader>
								<TableBody>
									{topNominees.map((n) => (
										<TableRow key={n.id}>
											<TableCell>{n.label || n.name}</TableCell>
											<TableCell>{n.votes}</TableCell>
											<TableCell>{n.thread?.title || n.threadId}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</Card>
					<Card className="p-6">
						<Table aria-label="Votes Table">
							<TableHeader>
								<TableColumn>User</TableColumn>
								<TableColumn>Thread</TableColumn>
								<TableColumn>Vote</TableColumn>
								<TableColumn>Weight</TableColumn>
								<TableColumn>Date</TableColumn>
							</TableHeader>
							<TableBody>
								{votes.map((v) => (
									<TableRow key={v.id}>
										<TableCell>{v.userId}</TableCell>
										<TableCell>{v.threadId}</TableCell>
										<TableCell>{v.vote}</TableCell>
										<TableCell>{v.weight}</TableCell>
										<TableCell>
											{v.createdAt
												? new Date(v.createdAt).toLocaleString()
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
