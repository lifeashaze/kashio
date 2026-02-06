import { Bell, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import { SettingRow } from "@/components/profile/sections/setting-row";

type NotificationPreference = {
  title: string;
  description: string;
  defaultChecked?: boolean;
  icon: LucideIcon;
};

const notificationPreferences: NotificationPreference[] = [
  {
    title: "Expense Reminders",
    description: "Daily reminder to log expenses",
    defaultChecked: true,
    icon: Bell,
  },
  {
    title: "Budget Alerts",
    description: "Get notified when approaching budget limits",
    defaultChecked: true,
    icon: DollarSign,
  },
  {
    title: "Weekly Summary",
    description: "Receive weekly spending report",
    icon: Bell,
  },
  {
    title: "Product Updates",
    description: "News about features and updates",
    defaultChecked: true,
    icon: Bell,
  },
];

export function NotificationsSection() {
  return (
    <ProfileSection
      title="Notifications"
      description="Choose what you want to be notified about"
    >
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {notificationPreferences.map((preference, index) => {
            const Icon = preference.icon;

            return (
              <div key={preference.title} className="space-y-4">
                <SettingRow
                  icon={<Icon className="size-4 text-muted-foreground" />}
                  title={preference.title}
                  description={preference.description}
                  action={
                    <Switch
                      defaultChecked={preference.defaultChecked}
                      className="shrink-0"
                    />
                  }
                />
                {index < notificationPreferences.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
