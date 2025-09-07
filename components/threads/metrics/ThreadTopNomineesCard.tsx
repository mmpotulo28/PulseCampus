import { Card, Button } from "@heroui/react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ThreadTopNomineesCard({
	topNominees,
	consensus,
	thread,
	winningNominee,
	onViewNominee,
}: {
	topNominees: { option: string; count: number; name?: string }[];
	consensus: any;
	thread: any;
	winningNominee: string | null;
	// eslint-disable-next-line no-unused-vars
	onViewNominee: (nominee: any) => void;
}) {
	return (
		<Card className="mb-6 p-6 rounded-xl shadow bg-gradient-to-br from-warning/10 to-background/80 border-0">
			<h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
				<ChartBarIcon className="h-5 w-5 text-warning" /> Top Voted Nominees
			</h3>
			<div className="flex flex-col gap-4">
				{topNominees.length === 0 ? (
					<div className="text-xs text-default-400">No votes yet.</div>
				) : (
					topNominees.map((n, idx) => {
						const total = consensus.totalVotes || 1;
						const percent = ((n.count / total) * 100).toFixed(1);
						let badge = null;

						if (idx === 0)
							badge = (
								<span className="ml-2 px-2 py-1 rounded bg-success/20 text-success font-semibold text-xs">
									{thread.status?.toLowerCase() === "closed"
										? "Winner 🏆"
										: "Leader"}
								</span>
							);
						else if (idx === 1)
							badge = (
								<span className="ml-2 px-2 py-1 rounded bg-info/20 text-info font-semibold text-xs">
									Runner-up
								</span>
							);
						else if (idx === 2)
							badge = (
								<span className="ml-2 px-2 py-1 rounded bg-warning/20 text-warning font-semibold text-xs">
									Third Place
								</span>
							);

						return (
							<div
								key={n.option}
								className={`flex flex-col gap-1 p-3 rounded-lg border ${
									idx === 0
										? "border-success/40 bg-success/5"
										: idx === 1
											? "border-info/40 bg-info/5"
											: idx === 2
												? "border-warning/40 bg-warning/5"
												: "border-default-200"
								}`}>
								<div className="flex items-center gap-2">
									<span className="font-bold text-lg">{n.name || n.option}</span>
									{badge}
								</div>
								<div className="flex items-center gap-2 text-xs text-default-500">
									<span>Votes: {n.count}</span>
									<span>({percent}%)</span>
								</div>
								<div className="w-full h-2 bg-default-100 rounded-full mt-1">
									<div
										className={`h-2 rounded-full ${
											idx === 0
												? "bg-success"
												: idx === 1
													? "bg-info"
													: idx === 2
														? "bg-warning"
														: "bg-primary"
										}`}
										style={{ width: `${percent}%` }}
									/>
								</div>
								<div className="flex justify-end mt-2">
									<Button
										size="sm"
										variant="bordered"
										color="primary"
										onClick={() => onViewNominee(n)}>
										View Nominee
									</Button>
								</div>
							</div>
						);
					})
				)}
			</div>
			{thread.status?.toLowerCase() === "closed" && winningNominee && (
				<div className="mt-6 text-success font-bold text-md flex items-center gap-2">
					🏆 Winning Nominee:{" "}
					<span className="px-2 py-1 rounded bg-success/20">{winningNominee}</span>
				</div>
			)}
		</Card>
	);
}
