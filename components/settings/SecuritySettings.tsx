import { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";

export default function SecuritySettings() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleUpdatePassword = () => {
		// Handle password update logic here
		console.log({ currentPassword, newPassword, confirmPassword });
	};

	return (
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
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
					<Input
						label="New Password"
						placeholder="Enter new password"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<Input
						label="Confirm Password"
						placeholder="Confirm new password"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<Button color="primary" className="mt-4" onClick={handleUpdatePassword}>
					Update Password
				</Button>
			</CardBody>
		</Card>
	);
}
