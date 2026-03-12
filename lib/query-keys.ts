export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export const userPreferenceKeys = {
  all: ["userPreferences"] as const,
};

export const telegramIntegrationQueryKey = ["telegramIntegration"] as const;
