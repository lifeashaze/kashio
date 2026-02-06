import { ChevronRight, Clock, DollarSign, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import { SettingRow } from "@/components/profile/sections/setting-row";

type AccountPreference = {
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
};

const accountPreferences: AccountPreference[] = [
  {
    title: "Default Currency",
    description: "Used for expense tracking",
    value: "USD",
    icon: DollarSign,
  },
  {
    title: "Language",
    description: "Interface language",
    value: "English",
    icon: Globe,
  },
  {
    title: "Timezone",
    description: "Used for date display",
    value: "UTC-8",
    icon: Clock,
  },
];

export function AccountSettingsSection() {
  return (
    <ProfileSection
      title="Account Settings"
      description="Configure your regional and display preferences"
    >
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {accountPreferences.map((preference, index) => {
            const Icon = preference.icon;

            return (
              <div key={preference.title} className="space-y-4">
                <SettingRow
                  icon={<Icon className="size-4 text-muted-foreground" />}
                  title={preference.title}
                  description={preference.description}
                  action={
                    <Button variant="outline" size="sm" className="shrink-0">
                      {preference.value}
                      <ChevronRight className="ml-1 size-3.5" />
                    </Button>
                  }
                />
                {index < accountPreferences.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
