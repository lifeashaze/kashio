import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import { getUserInitials } from "@/lib/user";
import type { ProfileUser } from "@/components/profile/types";

type AccountInformationSectionProps = {
  user: ProfileUser;
};

export function AccountInformationSection({
  user,
}: AccountInformationSectionProps) {
  return (
    <ProfileSection
      title="Account Information"
      description="Your basic account details"
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {getUserInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
