"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { telegramIntegrationQueryKey } from "@/lib/query-keys";
import type { TelegramLinkStatusResponse } from "@/lib/telegram/types";

type TelegramLinkResponse = {
  botUsername: string;
  deepLinkUrl: string;
  expiresAt: string;
};

export function useTelegramIntegration() {
  return useQuery({
    queryKey: telegramIntegrationQueryKey,
    queryFn: () =>
      apiClient.get<TelegramLinkStatusResponse>("/api/integrations/telegram"),
    staleTime: 60 * 1000,
  });
}

export function useCreateTelegramLink() {
  return useMutation({
    mutationFn: () =>
      apiClient.post<TelegramLinkResponse>("/api/integrations/telegram/link"),
    onError: (error) => {
      console.error("Failed to create Telegram link", error);
      toast.error("Failed to start Telegram connection");
    },
  });
}

export function useDisconnectTelegram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.delete<TelegramLinkStatusResponse>("/api/integrations/telegram"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telegramIntegrationQueryKey });
      toast.success("Telegram disconnected");
    },
    onError: (error) => {
      console.error("Failed to disconnect Telegram", error);
      toast.error("Failed to disconnect Telegram");
    },
  });
}
