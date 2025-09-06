"use client";
import { useState } from "react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/input";
import { useOrganization } from "@clerk/nextjs";
import { useThreads } from "@/hooks/useThreads";
import { useGroup } from "@/hooks/useGroup";
import { Tooltip, Spinner, Select, SelectItem } from "@heroui/react";
import { OrganizationSidePanel } from "../../groups/components";

export default function CreateThreadPage() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [selectedGroupId, setSelectedGroupId] = useState("");
	const { organization } = useOrganization();
	const { groups } = useGroup();
	const { createThread, createLoading, createError, createSuccess, isAdmin } =
		useThreads(selectedGroupId);

	const selectedGroup = groups.find((g) => g.id === selectedGroupId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAdmin || !selectedGroupId) return;

		if (title.length < 5 || desc.length < 10) return;
		await createThread(title, desc);
	};

	return (
		<div className="py-8 px-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-10 my-10">
			<div className="py-8 px-4 max-w-xl mx-auto flex-2">
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
					{selectedGroup && (
						<div className="text-xs text-default-500 mb-2">
							Group: <span className="font-semibold">{selectedGroup.name}</span>
						</div>
					)}
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
					<button
						type="submit"
						disabled={
							createLoading ||
							!title ||
							!desc ||
							!isAdmin ||
							!selectedGroupId ||
							title.length < 5 ||
							desc.length < 10
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
