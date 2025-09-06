import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface IGroup {
	id: string;
	orgId: string; // Organization ID
	name: string;
	description?: string;
	members?: number;
	isPublic?: boolean;
	activity?: number;
	createdAt?: string;
	owner?: string;
	membersList?: { name: string; role: string }[];
}

export interface IThread {
	id: string;
	groupId: string; // Group ID
	creatorId?: string;
	title: string;
	description?: string;
	status?: string;
	createdAt?: string;
	deadline?: string;
	votes?: Record<string, number>;
	totalMembers?: number;
	comments?: { userId: string; text: string }[];
	voteOptions?: IVoteOption[]; // MCQ support
	vote_type?: "yesno" | "mcq";
}
export interface IVoteOption {
	id: string;
	label: string;
}

export interface IUseVotingOptions {
	thread_id: string;
	options?: IVoteOption[];
	anonymous?: boolean;
	weighted?: boolean;
}

export interface IVote {
	id?: string;
	thread_id: string;
	user_id: string | null;
	vote: string | string[]; // MCQ support
	weight: number;
	created_at?: string;
	updated_at?: string;
}

export interface IVoteWithCounts {
	votes: IVote[];
	voteCounts: Record<string, number>;
}

export interface IConsensus {
	agreement: number;
	engagement: number;
	reached: boolean;
	yesVotes: number;
	noVotes: number;
	totalVotes: number;
}

export interface IComment {
	id: string;
	thread_id: string;
	user_id: string;
	name: string;
	text: string;
	created_at?: string;
}

export interface INomination {
	id: string;
	thread_id: string;
	name: string;
	user_id: string;
	email: string;
	label: string;
	key: string;
	created_at?: string;
}
