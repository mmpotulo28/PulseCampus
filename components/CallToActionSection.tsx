import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

export default function CallToActionSection() {
	return (
		<section className="py-12 flex flex-col items-center w-full flex-1 min-w-sm">
			<h2 className="text-xl font-bold mb-4">Ready to get started?</h2>
			<p className="mb-6 text-center max-w-md">
				Join PulseCampus and empower your student organization with transparent
				decision-making and real-time engagement.
			</p>
			<Link
				className={buttonStyles({
					color: "primary",
					radius: "full",
					variant: "shadow",
				})}
				href="/signup">
				Get Started
			</Link>
		</section>
	);
}
