"use client";
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CallToActionSection from "@/components/CallToActionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

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
      }}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  return (
    <main>
      <AnimatedSection delay={0}>
        <HeroSection />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <FeaturesSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection delay={0.3}>
        <PricingSection />
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        <CallToActionSection />
      </AnimatedSection>
      <AnimatedSection delay={0.5}>
        <FAQSection />
      </AnimatedSection>
    </main>
  );
}
