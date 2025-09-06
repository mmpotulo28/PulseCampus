import { INomination, IVoteWithCounts } from "@/types";
import { Progress, Slider } from "@heroui/react";

interface MultipleVoteInsightsProps {
	nominations: INomination[];
	votes: IVoteWithCounts;
}

const MultipleVoteInsights = ({ nominations, votes }: MultipleVoteInsightsProps) => {
	const totalVotes = Object.values(votes.voteCounts).reduce((a, b) => a + b, 0);

	return (
		<div className="">
			{nominations.map((nominee) => {
				const count = votes.voteCounts[nominee.id] || 0;
				const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

				return (
					<div key={nominee.id} className="mb-3">
						<div className="flex justify-between items-center mb-1">
							<span className="font-semibold text-primary">{nominee.label}</span>
							<span className="text-xs text-default-500">
								{count} votes ({percent}%)
							</span>
						</div>

						<Slider
							classNames={{
								base: "max-w-md gap-3",
								track: "border-s-secondary-100",
								filler: "bg-linear-to-r from-secondary-100 to-secondary-500",
							}}
							value={percent}
							label={nominee.label}
							renderThumb={(props) => (
								<div
									{...props}
									className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing">
									<span className="transition-transform bg-linear-to-br shadow-small from-secondary-100 to-secondary-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
								</div>
							)}
							size="sm"
						/>
					</div>
				);
			})}
		</div>
	);
};

export default MultipleVoteInsights;
