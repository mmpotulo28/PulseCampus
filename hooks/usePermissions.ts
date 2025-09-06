import { useUser, useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/**
 * Returns role flags for a user in the given organization.
 * @param user Clerk user object
 * @param organization Clerk organization object
 * @returns { isAdmin, isExco, isMember }
 */
export function usePermissions() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isExco, setIsExco] = useState(false);
	const [isMember, setIsMember] = useState(false);
	const { user } = useUser();
	const { membership } = useOrganization();

	useEffect(() => {
		if (!user || !membership) {
			console.warn("User or membership data is missing.");
			return;
		}

		const role = membership?.role?.toLowerCase();

		setIsAdmin(role === "org:admin");
		setIsExco(
			role === "org:exco" ||
				role === "org:executive" ||
				role === "org:president" ||
				role === "org:chair",
		);
		setIsMember(
			!!role &&
				!["org:admin", "org:exco", "org:executive", "org:president", "org:chair"].includes(
					role,
				),
		);

		console.log(
			`User Role: ${role} | isAdmin: ${isAdmin} | isExco: ${isExco} | isMember: ${isMember}`,
		);
	}, [user, membership]);

	return {
		isAdmin,
		isExco,
		isMember,
	};
}
