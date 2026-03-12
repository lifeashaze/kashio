import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { userPreferenceKeys } from "@/lib/query-keys";
import type { ClientUserPreferences } from "@/lib/types/expense";

export function useUserPreferences() {
  return useQuery({
    queryKey: userPreferenceKeys.all,
    queryFn: async () => {
      try {
        const data = await apiClient.get<ClientUserPreferences>("/api/user/preferences");
        return data;
      } catch {
        // If no preferences exist yet, return null.
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
      return apiClient.post<ClientUserPreferences>("/api/user/preferences", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPreferenceKeys.all });
      toast.success("Preferences saved successfully");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });
}
