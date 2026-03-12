"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { expenseKeys } from "@/lib/query-keys";
import type {
  ClientExpense,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "@/lib/types/expense";

// Fetch all expenses
export function useExpenses() {
  return useQuery({
    queryKey: expenseKeys.lists(),
    queryFn: async () => {
      const data = await apiClient.get<ClientExpense[]>("/api/expenses");
      return data;
    },
  });
}

// Create expense
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: CreateExpensePayload) => {
      return await apiClient.post<ClientExpense>("/api/expenses", expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      console.error("Failed to create expense:", error);
      toast.error("Failed to add expense");
    },
  });
}

// Delete expense
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      // No success toast - visual feedback of row disappearing is enough
    },
    onError: (error) => {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    },
  });
}

// Update expense
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: UpdateExpensePayload) => {
      const { id, ...payload } = expense;
      return await apiClient.put<ClientExpense>(`/api/expenses/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success("Expense updated");
    },
    onError: (error) => {
      console.error("Failed to update expense:", error);
      toast.error("Failed to update expense");
    },
  });
}
