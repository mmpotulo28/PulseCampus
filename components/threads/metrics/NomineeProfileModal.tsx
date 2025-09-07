import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { useProfile } from "@/hooks/useProfile";
import { INomination } from "@/types";
import supabase from "@/lib/db";
import { ExternalLink } from "lucide-react";

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
			const { data, error } = await supabase
				.from("nominations")
				.select("*")
				.eq("id", nominee.option)
				.single();

			if (error) console.error("Error fetching nomination:", error);

			if (!cancelled) {
				setNomination(data || null);
				setLoadingNomination(false);
			}
		}
		if (open && nominee?.option) fetchNomination();

		return () => {
			cancelled = true;
		};
	}, [open, nominee?.option]);

	const { profile, loading: loadingProfile } = useProfile(nomination?.user_id.trim() || "");

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
