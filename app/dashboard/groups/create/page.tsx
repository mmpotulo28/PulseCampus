"use client";
import { useState } from "react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/input";

export default function CreateGroupPage() {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// TODO: Integrate with Supabase to create group
		setTimeout(() => setLoading(false), 1000);
	};

	return (
		<div className="py-8 px-4 max-w-md mx-auto">
			<h2 className="text-xl font-bold mb-4">Create a New Group</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label="Group Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Tech Society"
					required
				/>
				<button
					type="submit"
					disabled={loading || !name}
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}>
					{loading ? "Creating..." : "Create Group"}
				</button>
			</form>
		</div>
	);
}
