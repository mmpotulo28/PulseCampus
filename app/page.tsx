"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const AnimatedSection = dynamic(() => import("@/components/AnimatedSection"), { ssr: true });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), { ssr: true });
const PricingSection = dynamic(() => import("@/components/PricingSection"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
	ssr: true,
});
const CallToActionSection = dynamic(() => import("@/components/CallToActionSection"), {
	ssr: true,
});
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: true });

export default function Home() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<main className="container mx-auto max-w-7xl flex flex-col gap-16">
				<AnimatedSection delay={0}>
					<HeroSection />
				</AnimatedSection>
				<AnimatedSection delay={0.1}>
					<FeaturesSection />
				</AnimatedSection>

				<AnimatedSection delay={0.3}>
					<PricingSection />
				</AnimatedSection>

				<AnimatedSection delay={0.2}>
					<TestimonialsSection />
				</AnimatedSection>

				<AnimatedSection delay={0.4}>
					<div className="flex w-full max-w-7xl justify-between px-4 flex-wrap gap-8 mx-auto mt-8">
						<CallToActionSection />
						<FAQSection />
					</div>
				</AnimatedSection>
			</main>
		</Suspense>
	);
}
