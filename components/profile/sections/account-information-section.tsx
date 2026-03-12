import { Card, CardContent } from "@/components/ui/card";
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
      title="Account"
      description="Your signed-in account details are shown here for reference."
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {getUserInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Read only
              </p>
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
