import {
	Navbar as HeroUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
	TwitterIcon,
	GithubIcon,
	DiscordIcon,
	HeartFilledIcon,
	SearchIcon,
	Logo,
} from "@/components/icons";

// Custom nav items for PulseCampus
const navItems = [
	{ label: "Home", href: "/" },
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
	{ label: "Sign Up", href: "/signup" },
];

export const Navbar = () => {
	const searchInput = (
		<Input
			aria-label="Search"
			classNames={{
				inputWrapper: "bg-default-100",
				input: "text-sm",
			}}
			endContent={
				<Kbd className="hidden lg:inline-block" keys={["command"]}>
					K
				</Kbd>
			}
			labelPlacement="outside"
			placeholder="Search PulseCampus..."
			startContent={
				<SearchIcon className="text-base text-secondary-500 pointer-events-none flex-shrink-0" />
			}
			type="search"
		/>
	);

	return (
		<HeroUINavbar maxWidth="xl" position="sticky" className="bg-background shadow-lg">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-2" href="/">
						<Logo />
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-6 justify-start ml-4">
					{navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"text-background hover:text-secondary transition-colors font-medium",
								)}
								href={item.href}>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
						<TwitterIcon className="text-background hover:text-secondary" />
					</Link>
					<Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
						<DiscordIcon className="text-background hover:text-secondary" />
					</Link>
					<Link isExternal aria-label="Github" href={siteConfig.links.github}>
						<GithubIcon className="text-background hover:text-secondary" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<Button
						as={Link}
						className="text-sm font-normal text-primary bg-background"
						href="/signup"
						startContent={<HeartFilledIcon className="text-primary" />}
						variant="flat">
						Join Now
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal aria-label="Github" href={siteConfig.links.github}>
					<GithubIcon className="text-background" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle className="text-background" />
			</NavbarContent>

			<NavbarMenu>
				{searchInput}
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{navItems.map((item, index) => (
						<NavbarMenuItem key={`${item.label}-${index}`}>
							<Link
								color={index === navItems.length - 1 ? "primary" : "foreground"}
								href={item.href}
								size="lg"
								className={
									index === navItems.length - 1 ? "text-primary font-bold" : ""
								}>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	);
};
