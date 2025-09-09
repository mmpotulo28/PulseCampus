import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Autocomplete, AutocompleteItem } from "@heroui/react";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@clerk/nextjs";

const roles = [
	{ label: "Student", key: "student" },
	{ label: "Teacher", key: "teacher" },
	{ label: "Administrator", key: "administrator" },
	{ label: "Researcher", key: "researcher" },
];

const yearsOfStudy = [
	{ label: "1st Year", key: "1" },
	{ label: "2nd Year", key: "2" },
	{ label: "3rd Year", key: "3" },
	{ label: "4th Year", key: "4" },
	{ label: "Postgraduate", key: "postgraduate" },
];

const skillsList = [
	{ label: "JavaScript", key: "javascript" },
	{ label: "Python", key: "python" },
	{ label: "Data Analysis", key: "data_analysis" },
	{ label: "Machine Learning", key: "machine_learning" },
	{ label: "UI/UX Design", key: "ui_ux" },
];

const interestsList = [
	{ label: "Artificial Intelligence", key: "ai" },
	{ label: "Web Development", key: "web_dev" },
	{ label: "Blockchain", key: "blockchain" },
	{ label: "Cybersecurity", key: "cybersecurity" },
	{ label: "Cloud Computing", key: "cloud_computing" },
];

const courses = [
	{ label: "Computer Science", key: "cs" },
	{ label: "Information Technology", key: "it" },
	{ label: "Data Science", key: "ds" },
	{ label: "Software Engineering", key: "se" },
	{ label: "Cybersecurity", key: "cybersecurity" },
];

const locations = [
	{ label: "New York", key: "ny" },
	{ label: "San Francisco", key: "sf" },
	{ label: "London", key: "london" },
	{ label: "Berlin", key: "berlin" },
	{ label: "Tokyo", key: "tokyo" },
];

export default function ProfileSettings() {
	const { user } = useUser();
	const {
		profile,
		updateProfile,
		updateProfileLoading,
		updateProfileError,
		updateProfileSuccess,
	} = useProfile(user?.id || "");
	const [role, setRole] = useState<string>(profile?.role || "");
	const [location, setLocation] = useState<string>(profile?.location || "");
	const [course, setCourse] = useState<string>(profile?.course || "");
	const [yearOfStudy, setYearOfStudy] = useState<string>(profile?.yearOfStudy || "");
	const [skills, setSkills] = useState<string>((profile?.skills || []).join(", "));
	const [interests, setInterests] = useState<string>((profile?.interests || []).join(", "));

	// error states
	const [roleError, setRoleError] = useState<string>("");
	const [locationError, setLocationError] = useState<string>("");
	const [courseError, setCourseError] = useState<string>("");
	const [yearError, setYearError] = useState<string>("");
	const [skillsError, setSkillsError] = useState<string>("");
	const [interestsError, setInterestsError] = useState<string>("");

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// validate inputs
		let hasError = false;

		if (!role.trim()) {
			setRoleError("Role cannot be empty");
			hasError = true;
		} else {
			setRoleError("");
		}
		if (!yearOfStudy.trim()) {
			setYearError("Year of study cannot be empty");
			hasError = true;
		} else {
			setYearError("");
		}
		if (!course.trim()) {
			setCourseError("Course cannot be empty");
			hasError = true;
		} else {
			setCourseError("");
		}
		if (!location.trim()) {
			setLocationError("Location cannot be empty");
			hasError = true;
		} else {
			setLocationError("");
		}
		if (!skills.trim()) {
			setSkillsError("Skills cannot be empty");
			hasError = true;
		} else {
			setSkillsError("");
		}
		if (!interests.trim()) {
			setInterestsError("Interests cannot be empty");
			hasError = true;
		} else {
			setInterestsError("");
		}
		if (hasError) return;

		// call updateProfile
		await updateProfile({
			role,
			location,
			course,
			yearOfStudy,
			skills: skills.split(",").map((skill) => skill.trim()),
			interests: interests.split(",").map((interest) => interest.trim()),
		});
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<h3 className="text-lg font-bold">Update Public Profile</h3>
			</CardHeader>
			<CardBody>
				{updateProfileError && (
					<div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
						{updateProfileError}
					</div>
				)}
				{updateProfileSuccess && (
					<div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
						{updateProfileSuccess}
					</div>
				)}
				<form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Autocomplete
						required
						label="Role"
						placeholder="Select your role"
						defaultItems={roles}
						value={role}
						errorMessage={roleError}
						onInputChange={(value) => {
							console.log("Selected role:", value);
							setRole(value);
						}}>
						{roles.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						required
						label="Year of Study"
						placeholder="Select your year of study"
						defaultItems={yearsOfStudy}
						errorMessage={yearError}
						value={yearOfStudy}
						validationBehavior="native"
						onInputChange={(value) => {
							console.log("Selected year of study:", value);
							setYearOfStudy(value);
						}}>
						{yearsOfStudy.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						required
						label="Course"
						placeholder="Select your course"
						defaultItems={courses}
						value={course}
						errorMessage={courseError}
						onInputChange={(value) => {
							console.log("Selected course:", value);
							setCourse(value);
						}}>
						{courses.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						required
						label="Location"
						placeholder="Select your location"
						defaultItems={locations}
						value={location}
						errorMessage={locationError}
						onInputChange={(value) => {
							console.log("Selected location:", value);
							setLocation(value);
						}}>
						{locations.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						required
						label="Skills"
						placeholder="Enter your skills"
						defaultItems={skillsList}
						value={skills}
						errorMessage={skillsError}
						onInputChange={(value) => {
							console.log("Selected skills:", value);
							setSkills(value);
						}}>
						{skillsList.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						required
						label="Interests"
						placeholder="Enter your interests"
						defaultItems={interestsList}
						value={interests}
						errorMessage={interestsError}
						onInputChange={(value) => {
							console.log("Selected interests:", value);
							setInterests(value);
						}}>
						{interestsList.map((item) => (
							<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
						))}
					</Autocomplete>
					<Button
						type="submit"
						color="primary"
						className="mt-4"
						isLoading={updateProfileLoading}
						disabled={updateProfileLoading}>
						{updateProfileLoading ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardBody>
		</Card>
	);
}
