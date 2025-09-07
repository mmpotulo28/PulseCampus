"use client";
import { useParams } from "next/navigation";
import GroupMetricsDashboard from "@/components/GroupMetricsDashboard";
import Link from "next/link";
import { button as buttonStyles } from "@heroui/theme";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function GroupMetricsPage() {
	const { groupId } = useParams();

	return (
		<div className="py-8 px-4 max-w-7xl mx-auto">
			<Link href="/dashboard/metrics" className="text-primary flex items-center gap-2 mb-6">
				<ArrowLeftIcon className="h-5 w-5" />
				Back to Metrics
			</Link>
			<GroupMetricsDashboard groupId={groupId as string} />
		</div>
	);
}
