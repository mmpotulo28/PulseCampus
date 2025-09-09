import { useState } from "react";
import { Card, CardBody, CardHeader, Switch, Button } from "@heroui/react";

export default function SecuritySettings() {
	const [trackLocation, setTrackLocation] = useState(false);
	const [trackActivity, setTrackActivity] = useState(false);
	const [trackDevice, setTrackDevice] = useState(false);

	const handleSaveSettings = () => {
		// Handle saving privacy-related security settings here
		console.log({ trackLocation, trackActivity, trackDevice });
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<h3 className="text-lg font-bold">Privacy & Security Settings</h3>
			</CardHeader>
			<CardBody>
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm text-gray-600">Track Location</span>
					<Switch
						checked={trackLocation}
						onChange={() => setTrackLocation(!trackLocation)}
					/>
				</div>
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm text-gray-600">Track Activity</span>
					<Switch
						checked={trackActivity}
						onChange={() => setTrackActivity(!trackActivity)}
					/>
				</div>
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm text-gray-600">Track Device Usage</span>
					<Switch checked={trackDevice} onChange={() => setTrackDevice(!trackDevice)} />
				</div>
				<Button color="primary" className="mt-4" onClick={handleSaveSettings}>
					Save Settings
				</Button>
			</CardBody>
		</Card>
	);
}
