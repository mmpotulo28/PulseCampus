import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body
				className={clsx(
					"min-h-screen text-foreground bg-background font-sans antialiased",
					fontSans.variable,
				)}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
							{children}
						</main>
						<footer className="w-full flex flex-col items-center justify-center py-6 bg-primary text-background border-t border-default-200">
							<div className="flex flex-col items-center gap-2">
								<div className="flex items-center gap-2 mb-1">
									{/* Logo icon */}
									<span className="rounded-full bg-background p-2 shadow">
										{/* Use your Logo component */}
										{/* If you want a small logo, adjust size prop */}
										{/* <Logo size={32} /> */}
										<img
											src="/logo-icon.png"
											alt="PulseCampus Logo"
											width={32}
											height={32}
										/>
									</span>
									<span className="font-bold text-lg tracking-wide">
										PulseCampus
									</span>
								</div>
								<span className="text-sm text-background/80">
									Empowering Student Organizations & Councils
								</span>
								<div className="flex items-center gap-2 mt-2">
									<Link
										isExternal
										className="flex items-center gap-1 text-background hover:text-secondary"
										href="https://heroui.com?utm_source=pulsecampus"
										title="heroui.com homepage">
										<span className="text-background">Powered by</span>
										<p className="text-secondary font-bold">HeroUI</p>
									</Link>
									<span className="text-background/40">|</span>
									<Link
										isExternal
										className="text-background hover:text-secondary"
										href="https://github.com/pulsecampus"
										title="PulseCampus GitHub">
										GitHub
									</Link>
								</div>
							</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
