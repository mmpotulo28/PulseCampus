import { Card } from "@heroui/react";
import {
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    title: "Transparent Voting",
    description:
      "Real-time, secure voting with multiple types and consensus detection.",
    icon: <CheckCircleIcon className="h-7 w-7 text-primary" />,
  },
  {
    title: "Group Management",
    description:
      "Create, manage, and brand student groups with role-based access.",
    icon: <UserGroupIcon className="h-7 w-7 text-secondary" />,
  },
  {
    title: "Engagement Metrics",
    description:
      "Track participation and visualize activity with dashboards and heatmaps.",
    icon: <ChartBarIcon className="h-7 w-7 text-success" />,
  },
  {
    title: "Notifications & Audit",
    description:
      "Stay informed and export decision history for accountability.",
    icon: <BellAlertIcon className="h-7 w-7 text-warning" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-8 md:py-12 flex flex-col items-center" id="features">
      <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="p-6 rounded-xl shadow bg-white dark:bg-zinc-900 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 mb-2">
              {feature.icon}
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
