import { Card, CardBody, CardHeader } from "@heroui/react";

export default function AboutSettings() {
	return (
		<Card className="mb-6">
			<CardHeader>
				<h3 className="text-lg font-bold">About This Application</h3>
			</CardHeader>
			<CardBody>
				<p className="text-sm text-gray-600">
					This application is designed to help users manage their profiles, security
					settings, and notification preferences. Stay tuned for more features!
				</p>
			</CardBody>
		</Card>
	);
}
