import React from "react";
import { Card, CardBody, Avatar, Button, Badge, Divider } from "@heroui/react";
import {
	UserPlus,
	MessageSquare,
	BadgeCheck,
	Check,
	MapPin,
	Mail,
	BookOpen,
	Calendar,
	Linkedin,
	Twitter,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
	name: string;
	role: string;
	location: string;
	avatar: string;
	isVerified?: boolean;
	email?: string;
	course?: string;
	yearOfStudy?: string;
	skills?: string[];
	interests?: string[];
	socialLinks?: {
		platform: string;
		url: string;
		icon: string;
	}[];
	totalVotes: number;
	totalComments: number;
	totalGroups: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
	name,
	role,
	location,
	avatar,
	isVerified = false,
	email,
	course,
	yearOfStudy,
	skills = [],
	interests = [],
	socialLinks = [],
	totalVotes,
	totalComments,
	totalGroups,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			className="w-full max-w-md">
			<Card className="overflow-visible">
				<CardBody className="overflow-visible p-0">
					{/* Background Header - Enhanced with more creative pattern */}
					<div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-lg relative overflow-hidden">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_70%)]" />
						<div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
						<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
					</div>

					<div className="flex justify-center -mt-16 px-5">
						<Badge
							content={isVerified ? <Check className="text-white text-xs" /> : null}
							color="primary"
							shape="circle"
							placement="bottom-right"
							isInvisible={!isVerified}>
							<Avatar
								src={avatar}
								className="w-28 h-28 ring-4 ring-white shadow-md"
								isBordered
								color="default"
							/>
						</Badge>
					</div>

					<div className="text-center px-5 mt-3">
						<div className="flex items-center justify-center gap-1">
							<h2 className="text-xl font-semibold text-foreground">{name}</h2>
							{isVerified && <BadgeCheck className="text-blue-500 ml-1" />}
						</div>
						<p className="text-primary-500 font-medium">{role}</p>
						<div className="flex items-center justify-center gap-1 text-default-400 text-sm mt-1">
							<MapPin className="text-xs" />
							<span>{location || "123 Main St, Anytown, USA"}</span>
						</div>

						{/* Social Media Icons */}
						<div className="flex justify-center gap-3 mt-3">
							{socialLinks.map((link, index) => (
								<motion.a
									key={index}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-transparent p-2 rounded-full text-default-500 hover:text-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-4"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}>
									<Linkedin className="text-lg" />
									<Twitter className="text-lg" />
									<Mail className="text-lg" />
								</motion.a>
							))}
						</div>
					</div>

					{/* Additional User Information */}
					<div className="px-6 py-4 mt-2 bg-default-50 rounded-lg mx-4">
						<div className="space-y-2">
							{email && (
								<div className="flex items-center gap-2">
									<Mail className="text-default-400" />
									<span className="text-sm text-default-700">{email}</span>
								</div>
							)}

							{course && (
								<div className="flex items-center gap-2">
									<BookOpen className="text-default-400" />
									<span className="text-sm text-default-700">{course}</span>
								</div>
							)}

							{yearOfStudy && (
								<div className="flex items-center gap-2">
									<Calendar className="text-default-400" />
									<span className="text-sm text-default-700">{yearOfStudy}</span>
								</div>
							)}
						</div>

						{/* Skills */}
						{skills.length > 0 && (
							<div className="mt-3">
								<p className="text-xs font-medium text-default-500 mb-2">SKILLS</p>
								<div className="flex flex-wrap gap-2">
									{skills.map((skill, index) => (
										<Badge
											key={index}
											color="primary"
											variant="flat"
											className="text-xs">
											{skill}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Interests */}
						{interests.length > 0 && (
							<div className="mt-3">
								<p className="text-xs font-medium text-default-500 mb-2">
									INTERESTS
								</p>
								<div className="flex flex-wrap gap-2">
									{interests.map((interest, index) => (
										<Badge
											key={index}
											color="secondary"
											variant="flat"
											className="text-xs">
											{interest}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Stats - replaced with votes/comments/groups */}
					<div className="flex justify-between px-8 py-4 mt-4">
						<div className="text-center">
							<p className="font-semibold text-foreground">{totalVotes}</p>
							<p className="text-xs text-default-500">Total Votes</p>
						</div>
						<Divider orientation="vertical" />
						<div className="text-center">
							<p className="font-semibold text-foreground">{totalComments}</p>
							<p className="text-xs text-default-500">Total Comments</p>
						</div>
						<Divider orientation="vertical" />
						<div className="text-center">
							<p className="font-semibold text-foreground">{totalGroups}</p>
							<p className="text-xs text-default-500">Groups Joined</p>
						</div>
					</div>

					{/* Actions - Enhanced with animation */}
					<div className="flex gap-3 px-5 pb-5 mt-2">
						<Button
							className="flex-1 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
							color="primary"
							startContent={<UserPlus />}>
							Follow
						</Button>
						<Button
							className="flex-1 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
							variant="flat"
							startContent={<MessageSquare />}>
							Message
						</Button>
					</div>
				</CardBody>
			</Card>
		</motion.div>
	);
};
