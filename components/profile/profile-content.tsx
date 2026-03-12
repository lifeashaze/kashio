"use client";

import type { ProfileUser } from "@/components/profile/types";
import { ProfileHeader } from "@/components/profile/sections/profile-header";
import { AccountInformationSection } from "@/components/profile/sections/account-information-section";
import { PreferencesFormSection } from "@/components/profile/sections/preferences-form-section";
import { IntegrationsSection } from "@/components/profile/sections/integrations-section";

type ProfileContentProps = {
  user: ProfileUser;
};

export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="space-y-8">
      <ProfileHeader />
      <AccountInformationSection user={user} />
      <PreferencesFormSection />
      <IntegrationsSection />
    </div>
  );
}
