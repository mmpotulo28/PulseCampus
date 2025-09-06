"use client";
import { useState, useEffect } from "react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/input";
import { useOrganization } from "@clerk/nextjs";
import { useThreads } from "@/hooks/useThreads";
import { useGroup } from "@/hooks/useGroup";
import { useNominations } from "@/hooks/useNominations";
import {
	Spinner,
	Select,
	SelectItem,
	Autocomplete,
	AutocompleteItem,
	Button,
	DateInput,
	TimeInput,
} from "@heroui/react";
import { OrganizationSidePanel } from "../../groups/components";
import type { OrganizationMembershipResource } from "@clerk/types";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CalendarDate, Time } from "@internationalized/date";
import { INomination } from "@/types";

const nomineeSuggestions = [
	{ label: "Anele M.", key: "anele_m", description: "SRC President" },
	{ label: "Thandi S.", key: "thandi_s", description: "Club Treasurer" },
	{ label: "Sipho N.", key: "sipho_n", description: "Residence Committee" },
	{ label: "Lindiwe K.", key: "lindiwe_k", description: "Sports Chair" },
	{ label: "Nomvula D.", key: "nomvula_d", description: "Academic Rep" },
	{ label: "Other", key: "other", description: "Custom nominee" },
];

export default function CreateThreadPage() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [selectedGroupId, setSelectedGroupId] = useState("");
	const [voteType, setVoteType] = useState<"yesno" | "mcq">("yesno");
	const [nominationInput, setNominationInput] = useState<INomination>();
	const [pendingNominations, setPendingNominations] = useState<INomination[]>([]);
	const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
	const [deadlineDate, setDeadlineDate] = useState<CalendarDate | null>(null);
	const [deadlineTime, setDeadlineTime] = useState<Time | null>(null);
	const { organization } = useOrganization();
	const { groups } = useGroup();
	const { createThread, createLoading, createError, createSuccess, isAdmin, thread } =
		useThreads(selectedGroupId);
	const { addNominationError, addNominationSuccess, addNominationLoading } = useNominations(
		thread?.id || "",
	);

	useEffect(() => {
		// Fetch group members when a group is selected
		const fetchMembers = async () => {
			const membersList = await organization?.getMemberships();
			if (membersList) {
				setMembers(membersList.data);
			}
		};

		fetchMembers();
	}, [selectedGroupId, voteType]);

	// Reset nominations when voteType changes
	useEffect(() => {
		if (voteType === "yesno") {
			setPendingNominations([]);
		}
	}, [voteType]);

	const handleAddNomination = (nominee?: INomination) => {
		if (!nominee) return;
		if (nominee.label.length < 2) return;
		if (pendingNominations.some((n) => n.label === nominee.label)) return;
		setPendingNominations((prev) => [
			...prev,
			{
				id: "",
				thread_id: "", // can be set later when thread is created
				name: nominee.name,
				email: nominee.email,
				user_id: nominee.user_id,
				label: nominee.label,
				key: nominee.label.toLowerCase().replace(/\s+/g, "_"),
			},
		]);
		setNominationInput(undefined);
	};

	const handleRemoveNomination = (nominee: INomination) => {
		setPendingNominations((prev) => prev.filter((n) => n !== nominee));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin || !selectedGroupId) return;
		if (title.length < 5 || desc.length < 10) return;
		if (!deadlineDate || !deadlineTime) return;

		const deadline = new Date(
			deadlineDate.year,
			deadlineDate.month - 1,
			deadlineDate.day,
			deadlineTime.hour,
			deadlineTime.minute,
			deadlineTime.second || 0,
		).toISOString();

		if (voteType === "yesno") {
			await createThread(title, desc, "yesno", deadline);
		} else {
			if (pendingNominations.length < 1) return;
			await createThread(title, desc, "mcq", deadline, pendingNominations);
		}
	};

	// Redirect after successful thread creation
	useEffect(() => {
		const isCreatePass = createSuccess && !createLoading && !createError;
		const isTypeMcq = voteType === "mcq";
		const isNominationPass =
			(addNominationSuccess && !addNominationLoading && !addNominationError) || !isTypeMcq;
		if (isCreatePass && isNominationPass) {
			const timer = setTimeout(() => {
				window.location.href = "/dashboard/threads";
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [createSuccess, createLoading, createError]);

	return (
		<div className="py-8 px-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="py-0 px-4 max-w-xl mx-auto flex-2">
				<h2 className="text-xl font-bold mb-4">Create a New Proposal</h2>
				<div className="mb-2 text-sm text-default-500">
					Organization:{" "}
					<span className="font-semibold">{organization?.name || "None selected"}</span>
				</div>
				<div className="mb-2 text-sm text-default-500">
					Your Role:{" "}
					<span className={isAdmin ? "text-success" : "text-danger"}>
						{isAdmin ? "Admin" : "Not Admin"}
					</span>
				</div>
				{!isAdmin && (
					<div className="mb-4 text-danger font-semibold">
						Only organization admins can create proposals.
					</div>
				)}
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Select
						label="Select Group"
						placeholder="Choose a group"
						selectedKeys={selectedGroupId ? [selectedGroupId] : []}
						onSelectionChange={(keys) =>
							setSelectedGroupId(Array.from(keys)[0] as string)
						}
						disabled={!isAdmin || createLoading || groups.length === 0}
						required>
						{groups.map((g) => (
							<SelectItem key={g.id}>{g.name}</SelectItem>
						))}
					</Select>

					<Input
						label="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="e.g. Spring Festival Proposal"
						required
						disabled={!isAdmin || !selectedGroupId || createLoading}
						maxLength={60}
						description="Proposal title (min 5 chars)."
						errorMessage={
							title.length > 0 && title.length < 5 ? "Title too short." : undefined
						}
					/>
					<Input
						label="Description"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						placeholder="Describe your proposal..."
						required
						disabled={!isAdmin || !selectedGroupId || createLoading}
						maxLength={200}
						description="Describe your proposal (min 10 chars)."
						errorMessage={
							desc.length > 0 && desc.length < 10
								? "Description too short."
								: undefined
						}
					/>
					{/* Voting type selector */}
					<div className="flex flex-col gap-2">
						<label className="font-semibold text-sm mb-1">Voting Type</label>
						<div className="flex gap-4">
							<label>
								<input
									type="radio"
									name="voteType"
									value="yesno"
									checked={voteType === "yesno"}
									onChange={() => setVoteType("yesno")}
									disabled={createLoading}
								/>{" "}
								Yes / No
							</label>
							<label>
								<input
									type="radio"
									name="voteType"
									value="mcq"
									checked={voteType === "mcq"}
									onChange={() => setVoteType("mcq")}
									disabled={createLoading}
								/>{" "}
								Multiple Choice
							</label>
						</div>
					</div>
					{/* MCQ nominations input with Autocomplete */}
					{voteType === "mcq" && (
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<Autocomplete
									className="max-w-xs"
									label="Proposed Nominees"
									placeholder="Type or select nominee"
									items={members.map((m) => ({
										label: m.publicUserData?.firstName || "Unknown",
										key: m.publicUserData?.identifier || m.id,
										name: `${m.publicUserData?.firstName} ${m.publicUserData?.lastName}`,
										email: m.publicUserData?.identifier || "",
										user_id: m.id,
										id: m.id,
										thread_id: "", // can be set later when thread is created
									}))}
									disabled={createLoading || !isAdmin || !selectedGroupId}
									onChange={(value) => console.log("value changed", value)}
									multiple={true}>
									{(nominee) => (
										<AutocompleteItem
											key={nominee.key}
											title={nominee.label}
											onClick={() => {
												setNominationInput(nominee);
												console.log("selected", nominee);
											}}
											description={nominee.email}
										/>
									)}
								</Autocomplete>
								<Button
									color="primary"
									variant="bordered"
									size="lg"
									isIconOnly
									type="button"
									disabled={!nominationInput || createLoading}
									onPress={() => handleAddNomination(nominationInput)}>
									Add
								</Button>
							</div>
							<ul className="mt-2 flex flex-wrap gap-2">
								{pendingNominations.map((opt: INomination) => (
									<li
										key={opt.id}
										className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-2">
										{opt.label}
										<Button
											size="sm"
											color="danger"
											variant="light"
											isIconOnly
											onPress={() => handleRemoveNomination(opt)}>
											&times;
										</Button>
									</li>
								))}
							</ul>
							{pendingNominations.length < 1 && (
								<div className="text-danger text-xs mt-1">
									Add at least 1 option.
								</div>
							)}
						</div>
					)}
					<div className="flex flex-col md:flex-row gap-4">
						<DateInput
							className="max-w-sm"
							label="Deadline Date"
							value={deadlineDate}
							onChange={setDeadlineDate}
							placeholderValue={
								new CalendarDate(
									new Date().getFullYear(),
									new Date().getMonth() + 1,
									new Date().getDate(),
								)
							}
							description="Select the voting deadline date."
						/>
						<TimeInput
							label="Deadline Time"
							value={deadlineTime}
							onChange={setDeadlineTime}
							description="Select the voting deadline time."
						/>
					</div>
					<button
						type="submit"
						disabled={
							createLoading ||
							!title ||
							!desc ||
							!isAdmin ||
							!selectedGroupId ||
							title.length < 5 ||
							desc.length < 10 ||
							!deadlineDate ||
							!deadlineTime ||
							(voteType === "mcq" && pendingNominations.length < 1)
						}
						className={buttonStyles({
							color: "secondary",
							radius: "full",
							variant: "shadow",
						})}>
						{createLoading ? <Spinner size="sm" /> : "Create Proposal"}
					</button>
					{createError && <div className="text-danger mt-2">{createError}</div>}
					{createSuccess && <div className="text-success mt-2">{createSuccess}</div>}
				</form>
			</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel isAdmin={isAdmin} groups={groups} />
			</div>
		</div>
	);
}
