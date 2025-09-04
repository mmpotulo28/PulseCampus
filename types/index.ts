import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface IGroup {
	id: string;
	name: string;
	description: string;
	members: number;
	isPublic: boolean;
	activity: number; // % active members
	createdAt: string; // ISO date string
	owner: string; // Owner name or user id
	membersList: { name: string; role: string }[]; // Array of member objects
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	role: string;
	avatarUrl?: string;
}

export interface IThread {
	id: string;
	groupId: string;
	creatorId: string;
	title: string;
	description: string;
	status: "Open" | "Closed";
	createdAt: string;
	deadline: string;
	votes: { yes: number; no: number };
	totalMembers: number;
	comments: { userId: string; text: string }[];
}

// Add other types as needed:
// export interface IThread { ... }
// export interface IUser { ... }
