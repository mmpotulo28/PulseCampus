import { Link } from "@heroui/link";

import { Logo, GithubIcon, TwitterIcon, DiscordIcon } from "./icons";

const links = [
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
	{
		label: "GitHub",
		href: "https://github.com/mmpotulo28/pulsecampus",
		icon: <GithubIcon className="h-5 w-5" />,
	},
	{
		label: "Discord",
		href: "https://discord.com/invite/xyz",
		icon: <DiscordIcon className="h-5 w-5" />,
	},
	{
		label: "Twitter",
		href: "https://twitter.com/pulsecampus",
		icon: <TwitterIcon className="h-5 w-5" />,
	},
];

const Footer: React.FC = () => {
	return (
		<footer className="sm:hidden md:hidden lg:flex flex-col w-full border-t border-default-200 bg-primary-50 text-foreground static bottom-0">
			<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
				{/* Branding & Slogan */}
				<div className="flex flex-col items-center md:items-start gap-2">
					<div className="flex items-center gap-2 mb-1">
						<span className="rounded-full bg-background p-2 shadow">
							<Logo size={32} />
						</span>
						<span className="font-bold text-lg tracking-wide">PulseCampus</span>
					</div>
					<span className="text-sm text-foreground/80 text-center md:text-left">
						Empowering Student Organizations & Councils
					</span>
					<span className="text-xs text-foreground/60 mt-1 text-center md:text-left">
						Real-time voting, engagement metrics, and transparent decision-making for
						campus groups.
					</span>
				</div>
				{/* Quick Links */}
				<div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
					<div className="flex flex-wrap gap-3 justify-center md:justify-end">
						{links.slice(0, 3).map((l) => (
							<Link
								key={l.label}
								className="text-foreground/90 hover:text-secondary text-sm font-medium transition-colors"
								href={l.href}>
								{l.label}
							</Link>
						))}
					</div>
					<div className="flex gap-3 justify-center md:justify-end">
						{links.slice(3).map((l) => (
							<Link
								key={l.label}
								isExternal
								aria-label={l.label}
								className="hover:text-secondary transition-colors"
								href={l.href}>
								{l.icon}
							</Link>
						))}
					</div>
					<Link
						isExternal
						className="flex items-center gap-1 text-background/80 hover:text-secondary text-xs mt-2"
						href="https://heroui.com?utm_source=pulsecampus"
						title="heroui.com homepage">
						<span>Powered by</span>
						<p className="text-secondary font-bold">HeroUI</p>
					</Link>
				</div>
			</div>
			<div className="text-center text-xs text-foreground/50 py-2">
				&copy; {new Date().getFullYear()} PulseCampus. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
