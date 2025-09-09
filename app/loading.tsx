"use client";
import { Spinner } from "@heroui/react";

const Loading: React.FC<{ title?: string }> = ({ title }) => {
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<Spinner
				label={title || "We are loading your content..."}
				variant="wave"
				className="m-auto h-screen w-full"
				size="lg"
			/>

			{/* <Progress
				label={title || "We are loading your content..."}
				isIndeterminate
				isStriped
				aria-label="Loading..."
				className="max-w-md"
				color="secondary"
			/> */}
		</div>
	);
};

export default Loading;
