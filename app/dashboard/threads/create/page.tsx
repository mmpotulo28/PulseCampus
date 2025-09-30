"use client";
import type { OrganizationMembershipResource } from "@clerk/types";

import { useState, useEffect } from "react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/input";
import { useOrganization } from "@clerk/nextjs";
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
import { CalendarDate, Time } from "@internationalized/date";

import { useThreads } from "@/hooks/useThreads";
import { useGroup } from "@/hooks/useGroup";
import { useNominations } from "@/hooks/useNominations";
import { INomination } from "@/types";
import { usePermissions } from "@/hooks/usePermissions";
import { OrganizationSidePanel } from "@/components/OgranizationSidePanel";

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
	const { createThread, createLoading, createError, createSuccess, thread } =
		useThreads(selectedGroupId);
	const { isAdmin, isExco } = usePermissions();
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
		if ((!isAdmin && !isExco) || !selectedGroupId) return;
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
			await createThread(title, desc, "mcq", deadline);
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
		<div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="py-0 px-4 max-w-xl mx-auto flex-2">
				<h2 className="text-xl font-bold mb-4">Create a New Proposal</h2>
				<div className="mb-2 text-sm text-default-500">
					Organization:{" "}
					<span className="font-semibold">{organization?.name || "None selected"}</span>
				</div>
				<div className="mb-2 text-sm text-default-500">
					Your Role:{" "}
					<span className={isAdmin || isExco ? "text-success" : "text-danger"}>
						{isAdmin && "Admin"}
						{isAdmin && isExco && " & "}
						{isExco && "Exco"}
						{!isAdmin && !isExco && "Member"}
					</span>
				</div>
				{!isAdmin && !isExco && (
					<div className="mb-4 text-danger font-semibold">
						Only organization admins can create proposals.
					</div>
				)}
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<Select
						required
						disabled={(!isAdmin && !isExco) || createLoading || groups.length === 0}
						label="Select Group"
						placeholder="Choose a group"
						selectedKeys={selectedGroupId ? [selectedGroupId] : []}
						onSelectionChange={(keys) =>
							setSelectedGroupId(Array.from(keys)[0] as string)
						}>
						{groups.map((g) => (
							<SelectItem key={g.id}>{g.name}</SelectItem>
						))}
					</Select>

					<Input
						required
						description="Proposal title (min 5 chars)."
						disabled={(!isAdmin && !isExco) || !selectedGroupId || createLoading}
						errorMessage={
							title.length > 0 && title.length < 5 ? "Title too short." : undefined
						}
						label="Title"
						maxLength={60}
						placeholder="e.g. Spring Festival Proposal"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Input
						required
						description="Describe your proposal (min 10 chars)."
						disabled={(!isAdmin && !isExco) || !selectedGroupId || createLoading}
						errorMessage={
							desc.length > 0 && desc.length < 10
								? "Description too short."
								: undefined
						}
						label="Description"
						maxLength={200}
						placeholder="Describe your proposal..."
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
					{/* Voting type selector */}
					<div className="flex flex-col gap-2">
						<span className="font-semibold text-sm mb-1">Voting Type</span>
						<div className="flex gap-4">
							<label>
								<input
									checked={voteType === "yesno"}
									disabled={createLoading}
									name="voteType"
									type="radio"
									value="yesno"
									onChange={() => setVoteType("yesno")}
								/>{" "}
								Yes / No
							</label>
							<label>
								<input
									checked={voteType === "mcq"}
									disabled={createLoading}
									name="voteType"
									type="radio"
									value="mcq"
									onChange={() => setVoteType("mcq")}
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
									disabled={
										createLoading || (!isAdmin && !isExco) || !selectedGroupId
									}
									items={members.map((m) => ({
										label: m.publicUserData?.firstName || "Unknown",
										key: m.publicUserData?.identifier || m.id,
										name: `${m.publicUserData?.firstName} ${m.publicUserData?.lastName}`,
										email: m.publicUserData?.identifier || "",
										user_id: m.id,
										id: m.id,
										thread_id: "", // can be set later when thread is created
									}))}
									label="Proposed Nominees"
									multiple={true}
									placeholder="Type or select nominee"
									onChange={(value) => console.log("value changed", value)}>
									{(nominee) => (
										<AutocompleteItem
											key={nominee.key}
											description={nominee.email}
											title={nominee.label}
											onClick={() => {
												setNominationInput(nominee);
												console.log("selected", nominee);
											}}
										/>
									)}
								</Autocomplete>
								<Button
									isIconOnly
									color="primary"
									disabled={!nominationInput || createLoading}
									size="lg"
									type="button"
									variant="bordered"
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
											isIconOnly
											color="danger"
											size="sm"
											variant="light"
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
							description="Select the voting deadline date."
							label="Deadline Date"
							placeholderValue={
								new CalendarDate(
									new Date().getFullYear(),
									new Date().getMonth() + 1,
									new Date().getDate(),
								)
							}
							value={deadlineDate}
							onChange={setDeadlineDate}
						/>
						<TimeInput
							description="Select the voting deadline time."
							label="Deadline Time"
							value={deadlineTime}
							onChange={setDeadlineTime}
						/>
					</div>
					<button
						className={buttonStyles({
							color: "secondary",
							radius: "full",
							variant: "shadow",
						})}
						disabled={
							createLoading ||
							!title ||
							!desc ||
							(!isAdmin && !isExco) ||
							!selectedGroupId ||
							title.length < 5 ||
							desc.length < 10 ||
							!deadlineDate ||
							!deadlineTime ||
							(voteType === "mcq" && pendingNominations.length < 1)
						}
						type="submit">
						{createLoading ? <Spinner size="sm" /> : "Create Proposal"}
					</button>
					{createError && <div className="text-danger mt-2">{createError}</div>}
					{createSuccess && <div className="text-success mt-2">{createSuccess}</div>}
				</form>
			</div>
			<div className="w-full flex-1">
				<OrganizationSidePanel />
			</div>
		</div>
	);
}
