import { useState } from "react";
import { Card, CardBody, CardHeader, Switch, Button } from "@heroui/react";

export default function NotificationSettings() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [darkMode, setDarkMode] = useState(false);

	const handleSavePreferences = () => {
		// Handle save preferences logic here
		console.log({ notificationsEnabled, darkMode });
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<h3 className="text-lg font-bold">Notification Preferences</h3>
			</CardHeader>
			<CardBody>
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm text-gray-600">Enable Email Notifications</span>
					<Switch
						checked={notificationsEnabled}
						onChange={() => setNotificationsEnabled(!notificationsEnabled)}
					/>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Enable Dark Mode</span>
					<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
				</div>
				<Button color="primary" className="mt-4" onClick={handleSavePreferences}>
					Save Preferences
				</Button>
			</CardBody>
		</Card>
	);
}
