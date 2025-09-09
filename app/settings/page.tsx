"use client";
import { Tabs, Tab, Divider } from "@heroui/react";
import { CogIcon } from "@heroicons/react/24/outline";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AboutSettings from "@/components/settings/AboutSettings";
import { useUser } from "@clerk/nextjs";
import { useProfile } from "@/hooks/useProfile";
import { ProfileCard } from "@/components/ProfileCard";

export default function SettingsPage() {
	const { user } = useUser();
	const { profile, loading: loadingProfile } = useProfile(user?.id || "");

	return (
		<div className="py-8 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
			{/* Main Content */}
			<div className="flex-2">
				<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
					<CogIcon className="h-8 w-8 text-primary" /> Settings
				</h2>
				<Divider className="mb-6" />

				<Tabs aria-label="Settings Tabs" variant="underlined">
					<Tab key="profile" title={<span>Profile</span>}>
						<ProfileSettings />
					</Tab>
					<Tab key="security" title={<span>Security</span>}>
						<SecuritySettings />
					</Tab>
					<Tab key="notifications" title={<span>Notifications</span>}>
						<NotificationSettings />
					</Tab>
					<Tab key="about" title={<span>About</span>}>
						<AboutSettings />
					</Tab>
				</Tabs>
			</div>

			{/* Side Panel */}
			<div className="w-full md:w-80 flex-1">
				<ProfileCard {...profile} loading={loadingProfile} showEmail={false} />
			</div>
		</div>
	);
}
