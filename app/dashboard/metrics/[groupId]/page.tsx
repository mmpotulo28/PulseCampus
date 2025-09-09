"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import GroupMetricsDashboard from "@/components/GroupMetricsDashboard";

export default function GroupMetricsPage() {
	const { groupId } = useParams();

	return (
		<div className="max-w-7xl mx-auto">
			<Link className="text-primary flex items-center gap-2 mb-6" href="/dashboard/metrics">
				<ArrowLeftIcon className="h-5 w-5" />
				Back to Metrics
			</Link>
			<GroupMetricsDashboard groupId={groupId as string} />
		</div>
	);
}
