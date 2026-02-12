import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { UserPreferences } from "@/lib/schema";
import { toast } from "sonner";

export function useUserPreferences() {
  return useQuery({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      try {
        const data = await apiClient.get<UserPreferences>("/api/user/preferences");
        return data;
      } catch (err) {
        // If no preferences exist yet, return null (user hasn't completed onboarding)
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: {
      monthlyBudget: number;
      currency: string;
      timezone: string;
      language: string;
      dateFormat: string;
      enabledCategories: string[];
    }) => {
      return apiClient.post<UserPreferences>("/api/user/preferences", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      toast.success("Preferences saved successfully");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });
}

export function useUpdateOnboardingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ completed, step }: { completed?: boolean; step?: number }) => {
      return apiClient.patch("/api/user/onboarding", { completed, step });
    },
    onSuccess: () => {
      // Invalidate session to get updated onboarding status
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: () => {
      toast.error("Failed to update onboarding status");
    },
  });
}
