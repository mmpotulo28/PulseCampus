"use client";
import { useState } from "react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/input";

export default function CreateThreadPage() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// TODO: Integrate with Supabase to create thread
		setTimeout(() => setLoading(false), 1000);
	};

	return (
		<div className="py-8 px-4 max-w-md mx-auto">
			<h2 className="text-xl font-bold mb-4">Create a New Proposal</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="e.g. Spring Festival Proposal"
					required
				/>
				<Input
					label="Description"
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					placeholder="Describe your proposal..."
					required
				/>
				<button
					type="submit"
					disabled={loading || !title || !desc}
					className={buttonStyles({
						color: "secondary",
						radius: "full",
						variant: "shadow",
					})}>
					{loading ? "Creating..." : "Create Proposal"}
				</button>
			</form>
		</div>
	);
}
