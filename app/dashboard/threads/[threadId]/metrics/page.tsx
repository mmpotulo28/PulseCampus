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
	const metrics = useThreadMetrics(threadId as string);

	const {
		thread,
		loading,
		error,
		consensus,
		recentComments,
		recentVotes,
		topNominees,
		winningNominee,
	} = metrics;

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
		<div className="py-8 px-2 md:px-4 max-w-7xl mx-auto">
			<ThreadMetricsHeader thread={thread} />
			<ThreadMetricsGrid metrics={metrics} />
			<ThreadConsensusCard consensus={consensus} />
			<ThreadRecentActivityGrid recentVotes={recentVotes} recentComments={recentComments} />
			{thread?.vote_type === "mcq" && (
				<>
					<ThreadTopNomineesCard
						topNominees={topNominees}
						consensus={consensus}
						thread={thread}
						winningNominee={winningNominee}
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
		</div>
	);
}
