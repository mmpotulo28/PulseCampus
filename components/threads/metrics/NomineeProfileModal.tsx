import { Modal, ModalContent, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { useProfile } from "@/hooks/useProfile";
import { INomination } from "@/types";

import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";

export default function NomineeProfileModal({
	nominee,
	open,
	onClose,
}: {
	nominee: { option: string }; // option is nomination id
	open: boolean;
	onClose: () => void;
}) {
	const [nomination, setNomination] = useState<INomination | null>(null);
	const [loadingNomination, setLoadingNomination] = useState(false);

	// Fetch nomination from DB using option (nomination id)
	useEffect(() => {
		let cancelled = false;

		async function fetchNomination() {
			if (!open || !nominee?.option) return;
			setLoadingNomination(true);
			const noms = await prisma.nominations.findUnique({
				where: { id: nominee.option },
			});

			if (!noms) {
				console.error("Nomination not found");
			}

			if (!cancelled) {
				setNomination(noms || null);
				setLoadingNomination(false);
			}
		}
		if (open && nominee?.option) fetchNomination();

		return () => {
			cancelled = true;
		};
	}, [open, nominee?.option]);

	const { profile, loading: loadingProfile } = useProfile(nomination?.userId.trim() || "");

	if (!open || !nominee?.option) return null;

	return (
		<Modal isOpen={open} onOpenChange={onClose} size="sm" placement="center">
			<ModalContent>
				{(close) => (
					<>
						<ModalBody className="p-0">
							{loadingNomination ? (
								<div className="text-center py-8">
									<Spinner /> Loading nominee...
								</div>
							) : !nomination ? (
								<div className="text-center py-8 text-danger">
									Nominee not found.
								</div>
							) : loadingProfile ? (
								<div className="text-center py-8">
									<Spinner /> Loading profile...
								</div>
							) : profile ? (
								<ProfileCard {...profile} />
							) : (
								<div className="text-center py-8 text-danger">
									Profile not found.
								</div>
							)}
						</ModalBody>
						<ModalFooter className="p-0 m-2">
							<Button
								color="danger"
								onPress={close}
								endContent={<ExternalLink size={16} />}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
