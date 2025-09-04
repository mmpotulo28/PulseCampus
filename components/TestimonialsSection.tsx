import { Card } from "@heroui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
	{
		name: "Anele M.",
		role: "Student Council President",
		quote: "PulseCampus made our voting process transparent and fun. Engagement is at an all-time high!",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Thandi S.",
		role: "Club Treasurer",
		quote: "We love the real-time features and the dashboard. Our members feel more involved than ever.",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "Sipho N.",
		role: "Residence Committee",
		quote: "The notifications and audit logs keep everyone accountable. Highly recommended for student groups.",
		avatar: "https://randomuser.me/api/portraits/men/65.jpg",
	},
];

export default function TestimonialsSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: false, margin: "-100px" });

	return (
		<section
			ref={ref}
			className="py-12 bg-gradient-to-br from-violet-50 to-white dark:from-zinc-900 dark:to-zinc-800">
			<h2 className="text-2xl font-bold text-center mb-8">What Students Say</h2>
			<div className="flex flex-col md:flex-row gap-6 justify-center items-center">
				{testimonials.map((t, idx) => (
					<Card
						key={t.name}
						className="max-w-xs p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
						<motion.div
							initial={{ scale: 0.7, opacity: 0 }}
							animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.15 }}
							className="flex items-center gap-3 mb-4">
							<img
								src={t.avatar}
								alt={t.name}
								className="w-12 h-12 rounded-full border-2 border-violet-400"
							/>
							<div>
								<div className="font-semibold">{t.name}</div>
								<div className="text-xs text-zinc-500">{t.role}</div>
							</div>
						</motion.div>
						<p className="italic text-zinc-700 dark:text-zinc-300">"{t.quote}"</p>
					</Card>
				))}
			</div>
		</section>
	);
}
