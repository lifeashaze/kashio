import {
  Lock,
  LogOut,
  Shield,
  Smartphone,
  Laptop,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import { SettingRow } from "@/components/profile/sections/setting-row";

type SecurityAction = {
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
};

type SessionDevice = {
  name: string;
  details: string;
  icon: LucideIcon;
  isCurrent?: boolean;
  disableSignOut?: boolean;
};

const securityActions: SecurityAction[] = [
  {
    title: "Change Password",
    description: "Update your password",
    cta: "Change",
    icon: Lock,
  },
  {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security",
    cta: "Enable",
    icon: Shield,
  },
];

const sessionDevices: SessionDevice[] = [
  {
    name: "MacBook Pro",
    details: "San Francisco, US • Last active now",
    icon: Laptop,
    isCurrent: true,
    disableSignOut: true,
  },
  {
    name: "iPhone 15 Pro",
    details: "San Francisco, US • 2 hours ago",
    icon: Smartphone,
  },
];

export function SecuritySection() {
  return (
    <ProfileSection
      title="Security"
      description="Manage your account security and active sessions"
    >
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {securityActions.map((action) => {
            const Icon = action.icon;

            return (
              <div key={action.title} className="space-y-4">
                <SettingRow
                  icon={<Icon className="size-4 text-muted-foreground" />}
                  title={action.title}
                  description={action.description}
                  action={
                    <Button variant="outline" size="sm" className="shrink-0">
                      {action.cta}
                    </Button>
                  }
                />
                <Separator />
              </div>
            );
          })}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Smartphone className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-xs text-muted-foreground">
                  Devices where you&apos;re signed in
                </p>
              </div>
            </div>

            <div className="space-y-2 sm:ml-12">
              {sessionDevices.map((device) => {
                const Icon = device.icon;

                return (
                  <div
                    key={device.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                        <Icon className="size-4 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-medium">{device.name}</p>
                          {device.isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{device.details}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      disabled={device.disableSignOut}
                    >
                      <LogOut className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
