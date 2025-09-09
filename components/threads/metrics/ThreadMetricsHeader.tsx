import Link from "next/link";
import { Button, Card, Spinner } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { title } from "@/components/primitives";
import type { IThread } from "@/types";

export default function ThreadMetricsHeader({
	thread,
	loading,
	error,
}: {
	thread?: IThread;
	loading?: boolean;
	error?: string;
}) {
	if (loading)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Spinner color="primary" size="lg" />
			</div>
		);

	if (error)
		return (
			<div className="flex justify-center items-center min-h-[40vh]">
				<Card className="p-8 text-danger">{error}</Card>
			</div>
		);

	return (
		<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md mb-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-2 border-b border-default-100">
			<div className="flex items-center gap-3">
				<Link href={`/dashboard/threads/${thread?.id}`}>
					<ArrowLeftIcon className="h-5 w-5 text-primary" />
				</Link>
				<h2
					className={`${title({ size: "sm", color: "violet", className: "flex items-center gap-2" })}`}>
					{thread?.title}
				</h2>
			</div>
			<div className="flex gap-2">
				<Button
					variant="bordered"
					color="warning"
					size="sm"
					as={Link}
					href={`/dashboard/metrics/${thread?.group_id}`}>
					View Group Metrics
				</Button>
				<Button
					variant="bordered"
					as={Link}
					color="primary"
					size="sm"
					href={`/dashboard/threads/${thread?.id}`}>
					Thread Details
				</Button>
			</div>
		</div>
	);
}
