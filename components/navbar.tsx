"use client";
import { Navbar as HeroUINavbar, NavbarContent, NavbarBrand, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/react";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Avatar } from "@heroui/react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
import { tabs } from "@/lib/data";

export const Navbar = () => {
	const router = useRouter();
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
		<HeroUINavbar className="bg-background lg:shadow-lg" maxWidth="xl" position="static">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-2" href="/">
						<Logo />
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-6 justify-start ml-4">
					{tabs.map((tab) => (
						<NavbarItem key={tab.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"text-background hover:text-secondary transition-colors font-medium",
								)}
								href={tab.href}>
								{tab.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
						<TwitterIcon className="text-foreground hover:text-secondary" />
					</Link>
					<Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
						<DiscordIcon className="text-foreground hover:text-secondary" />
					</Link>
					<Link isExternal aria-label="Github" href={siteConfig.links.github}>
						<GithubIcon className="text-foreground hover:text-secondary" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<Button
						as={Link}
						className="text-sm font-normal text-primary bg-background hover:border"
						href="/auth/sign-in"
						startContent={<HeartFilledIcon className="text-primary" />}
						variant="flat">
						Join Now
					</Button>
				</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<UserButton
						fallback={
							<Avatar
								size="sm"
								onClick={() => {
									router.push("/auth/sign-in");
								}}
							/>
						}
					/>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal aria-label="Github" href={siteConfig.links.github}>
					<GithubIcon className="text-foreground" />
				</Link>
				<ThemeSwitch />
				<UserButton
					fallback={
						<Avatar
							size="sm"
							onClick={() => {
								router.push("/auth/sign-in");
							}}
						/>
					}
				/>
			</NavbarContent>
		</HeroUINavbar>
	);
};
