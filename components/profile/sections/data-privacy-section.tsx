import { Download, Shield, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import { SettingRow } from "@/components/profile/sections/setting-row";

export function DataPrivacySection() {
  return (
    <ProfileSection
      title="Data & Privacy"
      description="Control your data and privacy settings"
    >
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SettingRow
            icon={<Shield className="size-4 text-muted-foreground" />}
            title="Data Sharing"
            description="Share anonymous usage data"
            action={<Switch defaultChecked className="shrink-0" />}
          />

          <Separator />

          <SettingRow
            icon={<Download className="size-4 text-muted-foreground" />}
            title="Export Data"
            description="Download all your expense data"
            action={
              <Button variant="outline" size="sm" className="shrink-0">
                Export
              </Button>
            }
          />

          <Separator />

          <SettingRow
            icon={<Trash2 className="size-4 text-destructive" />}
            iconContainerClassName="bg-destructive/10"
            title="Delete Account"
            titleClassName="text-destructive"
            description="Permanently delete your account and data"
            action={
              <Button variant="destructive" size="sm" className="shrink-0">
                Delete
              </Button>
            }
          />
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
