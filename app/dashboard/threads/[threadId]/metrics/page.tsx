"use client";
import { useParams } from "next/navigation";
import { useThreadMetrics } from "@/hooks/useThreadMetrics";
import { useState } from "react";
import ThreadMetricsHeader from "@/components/threads/metrics/ThreadMetricsHeader";
import ThreadMetricsGrid from "@/components/threads/metrics/ThreadMetricsGrid";
import ThreadConsensusCard from "@/components/threads/metrics/ThreadConsensusCard";
import ThreadRecentActivityGrid from "@/components/threads/metrics/ThreadRecentActivityGrid";
import ThreadTopNomineesCard from "@/components/threads/metrics/ThreadTopNomineesCard";
import NomineeProfileModal from "@/components/threads/metrics/NomineeProfileModal";

export default function ThreadMetricsPage() {
	const { threadId } = useParams();
	const { metrics, thread, loading, error } = useThreadMetrics(threadId as string);

	const [selectedNominee, setSelectedNominee] = useState<any | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleViewNominee = (nominee: any) => {
		setSelectedNominee(nominee);
		setModalOpen(true);
	};
	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedNominee(null);
	};

	if (loading) return <ThreadMetricsHeader loading />;
	if (error || !thread) return <ThreadMetricsHeader error={error || "Thread not found."} />;

	return (
		<section className="px-2 md:px-4 max-w-7xl mx-auto">
			<ThreadMetricsHeader thread={thread} />
			<ThreadMetricsGrid metrics={metrics} />
			<ThreadConsensusCard consensus={metrics?.consensus} />
			<ThreadRecentActivityGrid
				recentVotes={metrics?.recentVotes || []}
				recentComments={metrics?.recentComments || []}
			/>
			{thread?.voteType === "mcq" && (
				<>
					<ThreadTopNomineesCard
						topNominees={metrics?.topNominees || []}
						consensus={metrics?.consensus}
						thread={thread}
						winningNominee={metrics?.winningNominee}
						onViewNominee={handleViewNominee}
					/>
					{selectedNominee && (
						<NomineeProfileModal
							nominee={selectedNominee}
							open={modalOpen}
							onClose={handleCloseModal}
						/>
					)}
				</>
			)}
		</section>
	);
}
