"use client";

import { useState } from "react";
import { Link2, LoaderCircle, MessageCircle, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import {
  useCreateTelegramLink,
  useDisconnectTelegram,
  useTelegramIntegration,
} from "@/lib/hooks/use-telegram-integration";

type Integration = {
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isConnected: boolean;
};

const staticIntegrations: Integration[] = [
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
  const [isOpeningBot, setIsOpeningBot] = useState(false);
  const { data, isLoading } = useTelegramIntegration();
  const createLink = useCreateTelegramLink();
  const disconnectTelegram = useDisconnectTelegram();

  const telegramSubtitle = data?.botUsername ? `@${data.botUsername}` : "@telegram";
  const isTelegramConnected = data?.connected ?? false;

  const handleConnectTelegram = async () => {
    const link = await createLink.mutateAsync();
    setIsOpeningBot(true);
    window.open(link.deepLinkUrl, "_blank", "noopener,noreferrer");
    toast.success("Finish linking in Telegram");
    setIsOpeningBot(false);
  };

  const handleOpenTelegram = () => {
    if (!data?.botUsername) {
      toast.error("Telegram bot username is not configured");
      return;
    }

    window.open(
      `https://t.me/${data.botUsername}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <ProfileSection
      title="Integrations"
      description="Connect external services to track expenses anywhere"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          className="group relative overflow-hidden transition-all hover:shadow-lg"
          style={{
            borderColor: "#0088cc33",
          }}
        >
          <div
            className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full transition-transform group-hover:scale-110"
            style={{ backgroundColor: "#0088cc14" }}
          />
          <CardContent className="relative p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#0088cc22" }}
                >
                  <MessageCircle className="size-6" style={{ color: "#0088cc" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Telegram</p>
                  <p className="text-xs text-muted-foreground">
                    {telegramSubtitle}
                  </p>
                </div>
              </div>
              {isLoading ? (
                <Badge variant="outline" className="sm:self-start">
                  Loading
                </Badge>
              ) : isTelegramConnected ? (
                <Badge
                  variant="outline"
                  className="shrink-0 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 sm:self-start"
                >
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="sm:self-start">
                  Not connected
                </Badge>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {isTelegramConnected
                ? `Log expenses and ask spending questions via Telegram${data?.connection?.telegramUsername ? ` as @${data.connection.telegramUsername}` : ""}.`
                : "Log expenses and ask spending questions from Telegram."}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {isTelegramConnected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenTelegram}
                    className="sm:w-auto"
                  >
                    <Link2 className="mr-1.5 size-3.5" />
                    Open Bot
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectTelegram.mutate()}
                    disabled={disconnectTelegram.isPending}
                    className="sm:w-auto"
                  >
                    {disconnectTelegram.isPending ? (
                      <LoaderCircle className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <Link2 className="mr-1.5 size-3.5" />
                    )}
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnectTelegram}
                  disabled={createLink.isPending || isOpeningBot}
                  className="w-full shrink-0 sm:w-auto sm:self-start"
                >
                  {createLink.isPending || isOpeningBot ? (
                    <LoaderCircle className="mr-1.5 size-3.5 animate-spin" />
                  ) : (
                    <Link2 className="mr-1.5 size-3.5" />
                  )}
                  Connect Telegram
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {staticIntegrations.map((integration) => {
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full shrink-0 sm:w-auto sm:self-start"
                    disabled
                  >
                    <Link2 className="mr-1.5 size-3.5" />
                    Coming soon
                  </Button>
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
