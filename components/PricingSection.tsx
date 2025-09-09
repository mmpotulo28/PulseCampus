import { PricingTable } from "@clerk/nextjs";

import { title } from "./primitives";

export default function PricingSection() {
	return (
		<section className="py-12 px-4 flex flex-col items-center ">
			<h2 className={`${title({ color: "blue" })} mb-8 line-height-1 text-center max-w-2xl`}>
				Pricing for Every Student Group
			</h2>
			<PricingTable />
		</section>
	);
}
