import { ProfileHeader } from "@/components/profile/sections/profile-header";
import { AccountInformationSection } from "@/components/profile/sections/account-information-section";
import { PreferencesFormSection } from "@/components/profile/sections/preferences-form-section";
import { IntegrationsSection } from "@/components/profile/sections/integrations-section";

type ProfileContentProps = {
  name: string;
  email: string;
};

export function ProfileContent({ name, email }: ProfileContentProps) {
  return (
    <div className="space-y-8">
      <ProfileHeader />
      <AccountInformationSection name={name} email={email} />
      <PreferencesFormSection />
      <IntegrationsSection />
    </div>
  );
}
