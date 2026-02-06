import { Link2, MessageCircle, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSection } from "@/components/profile/sections/profile-section";

type Integration = {
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isConnected: boolean;
};

const integrations: Integration[] = [
  {
    name: "Telegram",
    subtitle: "@kashio_bot",
    description: "Log expenses via Telegram",
    icon: MessageCircle,
    color: "#0088cc",
    isConnected: true,
  },
  {
    name: "Discord",
    subtitle: "Bot commands",
    description: "Track expenses in Discord",
    icon: MessagesSquare,
    color: "#5865F2",
    isConnected: false,
  },
];

export function IntegrationsSection() {
  return (
    <ProfileSection
      title="Integrations"
      description="Connect external services to track expenses anywhere"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon;

          return (
            <Card
              key={integration.name}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
              style={{
                borderColor: `${integration.color}33`,
              }}
            >
              <div
                className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${integration.color}14` }}
              />
              <CardContent className="relative p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${integration.color}22` }}
                    >
                      <Icon className="size-6" style={{ color: integration.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {integration.subtitle}
                      </p>
                    </div>
                  </div>
                  {integration.isConnected ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 sm:self-start"
                    >
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full shrink-0 sm:w-auto sm:self-start"
                    >
                      <Link2 className="mr-1.5 size-3.5" />
                      Connect
                    </Button>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {integration.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ProfileSection>
  );
}
