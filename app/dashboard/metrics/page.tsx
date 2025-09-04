"use client";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export default function MetricsPage() {
	return (
		<div className="py-8 px-4 max-w-3xl mx-auto">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
				<ChartBarIcon className="h-6 w-6 text-success" /> Engagement Metrics
			</h2>
			<div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-4">
				<div>
					<span className="font-semibold">Pulse Score:</span>
					<span className="ml-2 text-primary text-lg">82%</span>
				</div>
				<div>
					<span className="font-semibold">Voting Heatmap:</span>
					{/* TODO: Add heatmap visualization */}
					<div className="mt-2 h-24 bg-gradient-to-r from-primary to-secondary rounded"></div>
				</div>
				<div>
					<span className="font-semibold">Active Members:</span>
					<span className="ml-2 text-success">36</span>
				</div>
			</div>
		</div>
	);
}
