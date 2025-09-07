import { Card } from "@heroui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { BsQuote } from "react-icons/bs";

import { title } from "./primitives";

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
			className="py-12 bg-gradient-to-br rounded-2xl from-primary/10 via-background to-secondary/10 dark:from-zinc-800 dark:to-zinc-900 flex flex-col items-center gap-8 px-4">
			<h2
				className={`${title({ color: "pink" })} mb-8 line-height-1 text-center max-w-2xl mx-auto`}>
				What Students Say
			</h2>
			<div className="flex flex-col md:flex-row gap-6 justify-center items-center">
				{testimonials.map((t, idx) => (
					<Card
						key={t.name}
						className="max-w-xs p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
						<motion.div
							animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
							className="flex items-center gap-3 mb-4"
							initial={{ scale: 0.7, opacity: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.15 }}>
							<Image
								alt={t.name}
								className="w-12 h-12 rounded-full border-2 border-violet-400"
								height={48}
								src={t.avatar}
								width={48}
							/>
							<div>
								<div className="font-semibold">{t.name}</div>
								<div className="text-xs text-zinc-500">{t.role}</div>
							</div>
						</motion.div>
						<p className="italic text-zinc-700 dark:text-zinc-300">
							<BsQuote /> {t.quote} <BsQuote />
						</p>
					</Card>
				))}
			</div>
		</section>
	);
}
