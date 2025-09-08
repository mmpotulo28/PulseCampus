"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

import { clerkConfig } from "@/lib/config/clerk";
import { AgentOptions } from "@newrelic/browser-agent/src/loaders/agent.js";

let BrowserAgent: typeof import("@newrelic/browser-agent/loaders/browser-agent").BrowserAgent;

if (typeof window !== "undefined") {
	import("@newrelic/browser-agent/loaders/browser-agent").then((mod) => {
		BrowserAgent = mod.BrowserAgent;

		// The agent loader code executes immediately on instantiation.
		const options: AgentOptions = {
			info: {
				applicationID: process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID || "",
				beacon: "bam.nr-data.net",
				errorBeacon: "bam.nr-data.net",
				licenseKey: process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY || "",
				sa: 1,
			},
			init: {
				ajax: {
					deny_list: ["bam.nr-data.net"],
				},
				distributed_tracing: {
					allowed_origins: [],
					cors_use_newrelic_header: false,
					cors_use_tracecontext_headers: false,
					enabled: true,
					exclude_newrelic_header: false,
				},
				privacy: {
					cookies_enabled: true,
				},
				session_replay: {
					autoStart: true,
					block_selector: "",
					collect_fonts: true,
					enabled: true,
					error_sampling_rate: 100,
					fix_stylesheets: true,
					inline_images: false,
					mask_all_inputs: true,
					mask_input_options: {},
					mask_text_selector: "*",
					preload: true,
					sampling_rate: 10,
				},
			},
			loader_config: {
				accountID: process.env.NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID,
				agentID: process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_AGENT_ID,
				applicationID: process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID,
				licenseKey: process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY,
				trustKey: process.env.NEXT_PUBLIC_NEW_RELIC_TRUST_KEY,
			},
		};
		new BrowserAgent(options);
	});
}

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
	}
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	return (
		<HeroUIProvider navigate={router.push}>
			<ClerkProvider appearance={clerkConfig.appearance}>
				<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
			</ClerkProvider>
		</HeroUIProvider>
	);
}
