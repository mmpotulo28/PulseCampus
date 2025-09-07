import { Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { HeartFilledIcon } from "@/components/icons";
import { UserGroupIcon, SparklesIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { PricingTable } from "@clerk/nextjs";
import { title } from "./primitives";

const tiers = [
	{
		name: "Free",
		price: "$0",
		icon: <UserGroupIcon className="h-8 w-8 text-primary" />,
		features: ["Up to 10 members", "Basic voting", "3 decision threads"],
		highlight: false,
	},
	{
		name: "Starter",
		price: "$9/mo",
		icon: <SparklesIcon className="h-8 w-8 text-secondary" />,
		features: ["Unlimited members", "Custom branding", "Analytics & export logs"],
		highlight: true,
	},
	{
		name: "Pro",
		price: "$29/mo",
		icon: <AcademicCapIcon className="h-8 w-8 text-success" />,
		features: ["Slack/Discord integration", "Advanced consensus", "API access"],
		highlight: false,
	},
];

export default function PricingSection() {
	return (
		<section className="py-12 flex flex-col items-center ">
			<h2 className={`${title({ color: "pink" })} mb-8 line-height-1 text-center max-w-2xl`}>
				Pricing for Every Student Group
			</h2>
			<PricingTable />
		</section>
	);
}
