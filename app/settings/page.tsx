"use client";
import {
	Tabs,
	Tab,
	Divider,
	Button,
	Input,
	Switch,
	Card,
	CardBody,
	CardHeader,
} from "@heroui/react";
import { useState } from "react";
import {
	UserIcon,
	LockClosedIcon,
	BellIcon,
	CogIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ProfileCard } from "@/components/ProfileCard";
import { OrganizationSidePanel } from "../dashboard/groups/components";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [darkMode, setDarkMode] = useState(false);

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
					<Tab
						key="profile"
						title={
							<div className="flex items-center space-x-2">
								<UserIcon className="h-5 w-5" />
								<span>Profile</span>
							</div>
						}>
						<Card className="mb-6">
							<CardHeader>
								<h3 className="text-lg font-bold">Update Profile</h3>
							</CardHeader>
							<CardBody>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input label="First Name" placeholder="Enter your first name" />
									<Input label="Last Name" placeholder="Enter your last name" />
									<Input
										label="Email Address"
										placeholder="Enter your email"
										type="email"
									/>
									<Input
										label="Phone Number"
										placeholder="Enter your phone number"
										type="tel"
									/>
								</div>
								<Button color="primary" className="mt-4">
									Save Changes
								</Button>
							</CardBody>
						</Card>
					</Tab>

					<Tab
						key="security"
						title={
							<div className="flex items-center space-x-2">
								<LockClosedIcon className="h-5 w-5" />
								<span>Security</span>
							</div>
						}>
						<Card className="mb-6">
							<CardHeader>
								<h3 className="text-lg font-bold">Change Password</h3>
							</CardHeader>
							<CardBody>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input
										label="Current Password"
										placeholder="Enter current password"
										type="password"
									/>
									<Input
										label="New Password"
										placeholder="Enter new password"
										type="password"
									/>
									<Input
										label="Confirm Password"
										placeholder="Confirm new password"
										type="password"
									/>
								</div>
								<Button color="primary" className="mt-4">
									Update Password
								</Button>
							</CardBody>
						</Card>
					</Tab>

					<Tab
						key="notifications"
						title={
							<div className="flex items-center space-x-2">
								<BellIcon className="h-5 w-5" />
								<span>Notifications</span>
							</div>
						}>
						<Card className="mb-6">
							<CardHeader>
								<h3 className="text-lg font-bold">Notification Preferences</h3>
							</CardHeader>
							<CardBody>
								<div className="flex items-center justify-between mb-4">
									<span className="text-sm text-gray-600">
										Enable Email Notifications
									</span>
									<Switch
										checked={notificationsEnabled}
										onChange={() =>
											setNotificationsEnabled(!notificationsEnabled)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Enable Dark Mode</span>
									<Switch
										checked={darkMode}
										onChange={() => setDarkMode(!darkMode)}
									/>
								</div>
								<Button color="primary" className="mt-4">
									Save Preferences
								</Button>
							</CardBody>
						</Card>
					</Tab>

					<Tab
						key="about"
						title={
							<div className="flex items-center space-x-2">
								<InformationCircleIcon className="h-5 w-5" />
								<span>About</span>
							</div>
						}>
						<Card className="mb-6">
							<CardHeader>
								<h3 className="text-lg font-bold">About This Application</h3>
							</CardHeader>
							<CardBody>
								<p className="text-sm text-gray-600">
									This application is designed to help users manage their
									profiles, security settings, and notification preferences. Stay
									tuned for more features!
								</p>
							</CardBody>
						</Card>
					</Tab>
				</Tabs>
			</div>

			{/* Side Panel */}
			<div className="w-full md:w-80 flex-1">
				<ProfileCard {...profile} loading={loadingProfile} showEmail={false} />
				{/* <OrganizationSidePanel /> */}
			</div>
		</div>
	);
}
