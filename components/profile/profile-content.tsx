"use client";

import type { ProfileUser } from "@/components/profile/types";
import { ProfileHeader } from "@/components/profile/sections/profile-header";
import { AccountInformationSection } from "@/components/profile/sections/account-information-section";
import { AccountSettingsSection } from "@/components/profile/sections/account-settings-section";
import { IntegrationsSection } from "@/components/profile/sections/integrations-section";
import { SecuritySection } from "@/components/profile/sections/security-section";
import { NotificationsSection } from "@/components/profile/sections/notifications-section";
import { DataPrivacySection } from "@/components/profile/sections/data-privacy-section";

type ProfileContentProps = {
  user: ProfileUser;
};

export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="space-y-8">
      <ProfileHeader />
      <AccountInformationSection user={user} />
      <AccountSettingsSection />
      <IntegrationsSection />
      <SecuritySection />
      <NotificationsSection />
      <DataPrivacySection />
    </div>
  );
}
