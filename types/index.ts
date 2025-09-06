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

export interface IUser {
	id: string;
	fullName: string;
	object: "user";
	hasImage: boolean;
	imageUrl: string;
	primaryEmailAddressId: string;
	passwordEnabled: boolean;
	passkeys: any[];
	twoFactorEnabled: boolean;
	emailAddresses: {
		id: string;
		object: "email_address";
		emailAddress: string;
		verification: {
			status: string;
			strategy: string;
			attempts: number;
			expireAt: number;
			error: string | null;
		};
		linkedTo: any[];
		createdAt: number;
		updatedAt: number;
	}[];
	phoneNumbers: any[];
	web3Wallets: any[];
	externalAccounts: {
		id: string;
		object: string;
		provider: string;
		identificationId: string;
		providerUserId: string;
		approvedScopes: string;
		emailAddress: string;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		publicMetadata: Record<string, any>;
		createdAt: number;
		updatedAt: number;
	}[];
	enterpriseAccounts: any[];
	publicMetadata: Record<string, any>;
	privateMetadata: Record<string, any>;
	unsafeMetadata: Record<string, any>;
	lastSignInAt: number;
	lastActiveAt: number;
	createdAt: number;
	updatedAt: number;
	banned: boolean;
	locked: boolean;
	lockoutExpiresInSeconds: number | null;
	deleteSelfEnabled: boolean;
	createOrganizationEnabled: boolean;
	createOrganizationsLimit: number;
	totpEnabled: boolean;
	backupCodeEnabled: boolean;
	legalAcceptedAt: number | null;
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
	thread_id: string; // Thread ID
	user_id: string | null;
	vote: string | string[];
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
	text: string;
	created_at?: string;
}
