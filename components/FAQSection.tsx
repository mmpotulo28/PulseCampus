import { Accordion, AccordionItem } from "@heroui/react";

const faqs = [
	{
		q: "Who can use PulseCampus?",
		a: "Any student group, club, society, or residence committee at a university can use PulseCampus.",
	},
	{
		q: "Is my data secure?",
		a: "Yes! We use Supabase and Clerk for secure authentication and data storage.",
	},
	{
		q: "Can we customize our group page?",
		a: "Absolutely. Paid tiers allow custom branding with your logo and colors.",
	},
	{
		q: "How do we invite members?",
		a: "Admins can invite members via email directly from the platform.",
	},
];

export default function FAQSection() {
	return (
		<section className="py-12 flex flex-col items-center">
			<h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
			<div className="max-w-2xl w-full">
				<Accordion>
					{faqs.map((faq, idx) => (
						<AccordionItem key={idx} title={faq.q}>
							<div className="text-sm text-zinc-600 dark:text-zinc-300">{faq.a}</div>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
