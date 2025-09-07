import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";

function scrollToFeatures() {
  const el = document.getElementById("features");

  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 md:py-20 container mx-auto">
      {/* Animated Left Side */}
      <div className="flex-1 flex justify-center w-full">
        <motion.div
          // Animate swinging like a keyholder
          animate={{ rotate: [10, -10, 10] }}
          className="w-full max-w-xs md:max-w-sm origin-top"
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <Card className="p-6 rounded-2xl shadow-xl bg-background border border-primary/20">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">Student Vote</span>
                <span className="bg-primary text-background px-2 py-1 rounded-full text-xs">
                  Live
                </span>
              </div>
              <div className="font-semibold text-lg mt-2">
                Should we host a Spring Festival?
              </div>
              <div className="flex gap-2 mt-4">
                <button className="bg-primary text-background px-4 py-2 rounded-full font-semibold hover:bg-secondary transition">
                  Yes
                </button>
                <button className="bg-background border border-primary px-4 py-2 rounded-full font-semibold text-primary hover:bg-primary hover:text-background transition">
                  No
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-default-500">
                <span className="rounded-full w-2 h-2 bg-success inline-block" />
                <span>Real-time results</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      {/* Right Side Content */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <span className={title() + " text-primary"}>PulseCampus:&nbsp;</span>
        <br />
        <span className={title({ color: "violet" })}>
          Empowering Student Organizations to Make Smart Decisions
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Centralized platform for proposals, voting, and engagement.
        </div>
        <div className="flex gap-3 mt-8">
          <button
            className={buttonStyles({
              color: "secondary",
              radius: "full",
              variant: "shadow",
            })}
            type="button"
            onClick={scrollToFeatures}
          >
            Learn More
          </button>
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/auth/sign-in"
          >
            Get Started
          </Link>
        </div>
        <div className="mt-6 text-sm text-default-500">
          <span>Try live voting, group management, and more!</span>
        </div>
      </div>
    </section>
  );
}
