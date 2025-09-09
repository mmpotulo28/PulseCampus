"use client";
import { useInView, useAnimation, motion } from "framer-motion";
import { useRef, useEffect } from "react";

const AnimatedSection: React.FC<{
	children: React.ReactNode;
	delay?: number;
}> = ({ children, delay = 0 }) => {
	const ref = useRef(null);
	const inView = useInView(ref, { once: false, margin: "-100px" });
	const controls = useAnimation();

	useEffect(() => {
		if (inView) controls.start("visible");
		else controls.start("hidden");
	}, [inView, controls]);

	return (
		<motion.section
			ref={ref}
			animate={controls}
			initial="hidden"
			style={{ willChange: "transform, opacity" }}
			variants={{
				hidden: { opacity: 0, y: 40, scale: 0.98 },
				visible: {
					opacity: 1,
					y: 0,
					scale: 1,
					transition: { duration: 0.7, delay },
				},
			}}>
			{children}
		</motion.section>
	);
};

export default AnimatedSection;
