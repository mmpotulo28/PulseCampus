/* eslint-disable no-unused-vars */
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface IGroupMember {
	name: string;
	role: string;
	userId: string;
}

export interface IGroup {
	id?: string;
	orgId: string;
	name: string;
	description: string;
	members: number;
	membersList: IGroupMember[];
	isPublic: boolean;
	activity: number;
	createdAt: Date;
	owner: string;
}

export interface IThread {
	id?: string;
	groupId: string;
	creatorId: string;
	title: string;
	description: string;
	status: string;
	createdAt: Date;
	deadline: string;
	totalMembers: number;
	voteType: string;
}

export interface IComment {
	id?: string;
	createdAt: Date;
	name: string;
	text: string;
	threadId: string;
	userId: string;
}

export interface INomination {
	id?: string;
	createdAt: Date;
	email: string;
	label: string;
	name: string;
	threadId: string;
	userId: string;
}

export interface IVote {
	id?: string;
	userId: string;
	threadId: string;
	vote: string;
	weight: number;
	createdAt: Date;
	updatedAt?: Date;
}

export interface IVoteOption {
	id: string;
	label: string;
}

export interface IUseVotingOptions {
	threadId: string;
	options?: IVoteOption[];
	anonymous?: boolean;
	weighted?: boolean;
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

export interface iUseCache {
	setCache: (key: string, value: any) => void;
	getCache: <T = any>(key: string) => T | undefined;
	clearCache: () => void;
	purgeCache: (key: string) => void;
	cacheCleared: boolean;
	cacheError: string | null;
	cacheMessage: string | null;
}

export interface CreateGroupFormProps {
	name: string;
	setName: (v: string) => void;
	desc: string;
	setDesc: (v: string) => void;
	isPublic: boolean;
	setIsPublic: (v: boolean) => void;
	activity: number;
	setActivity: (v: number) => void;
	orgId: string;
	orgName: string;
	isAdmin: boolean;
	createGroup: (...args: any[]) => Promise<void>;
	createLoading: boolean;
	createError: string | null;
	createSuccess: string | null;
	groups: any[];
	handleSubmit: (e: React.FormEvent) => void;
}

export interface IUseThreads {
	threads: IThread[];
	threadsLoading: boolean;
	threadsError: string | null;
	createThread: (arg0: IThread) => Promise<void>;
	createLoading: boolean;
	createError: string | null;
	createSuccess: string | null;
	deleteThread: (threadId: string) => Promise<void>;
	deleting: boolean;
	deleteError: string | null;
	deleteSuccess: string | null;
	thread: IThread | null;
	threadLoading: boolean;
	threadError: string | null;
	getThread: (threadId: string) => Promise<void>;
}
