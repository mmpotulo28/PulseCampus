import { Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { HeartFilledIcon } from "@/components/icons";
import { UserGroupIcon, SparklesIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

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
			<h2 className="text-2xl font-bold mb-8">Pricing for Every Student Group</h2>
			<div className="flex flex-col md:flex-row gap-8 justify-center">
				{tiers.map((tier) => (
					<Card
						key={tier.name}
						className={`p-8 rounded-2xl shadow-lg min-w-[220px] transition-all duration-300
							${tier.highlight ? "border-2 border-primary scale-105 z-10" : "border border-default-200"}
							hover:scale-105 hover:shadow-xl`}>
						<div className="flex flex-col items-center mb-4">
							{tier.icon}
							<h3
								className={`font-semibold text-lg mt-2 ${tier.highlight ? "text-primary" : ""}`}>
								{tier.name}
							</h3>
						</div>
						<div
							className={`text-2xl font-bold mb-4 ${tier.highlight ? "text-primary" : "text-secondary"}`}>
							{tier.price}
						</div>
						<ul className="mb-6 list-disc list-inside text-sm text-zinc-600 dark:text-zinc-300">
							{tier.features.map((f) => (
								<li key={f}>{f}</li>
							))}
						</ul>
						<button
							className={buttonStyles({
								color: tier.highlight ? "primary" : "secondary",
								radius: "full",
								variant: tier.highlight ? "shadow" : "bordered",
								class: "w-full mt-2 font-bold",
							})}>
							Choose {tier.name}
						</button>
					</Card>
				))}
			</div>
			<div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
				Need a campus-wide plan?{" "}
				<a href="/contact" className="underline text-primary font-semibold">
					Contact us
				</a>
			</div>
		</section>
	);
}
