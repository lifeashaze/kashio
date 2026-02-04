"use client";

import { useState, useEffect, useRef } from "react";
import type { Expense } from "@/lib/schema";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpenses, useDeleteExpense } from "@/lib/hooks/use-expenses";

const CONFIRM_TIMEOUT = 3000; // 3 seconds to confirm

export function HomeStats() {
  const { data: expenses, isLoading: loading } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayedExpenses = expenses?.slice(0, 10) || [];

  // Auto-cancel delete confirmation after timeout
  useEffect(() => {
    if (pendingDeleteId) {
      timeoutRef.current = setTimeout(() => {
        setPendingDeleteId(null);
      }, CONFIRM_TIMEOUT);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [pendingDeleteId]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date) => {
    const expenseDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = expenseDate.toDateString() === today.toDateString();
    const isYesterday = expenseDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today, ${expenseDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (isYesterday) {
      return `Yesterday, ${expenseDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return expenseDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (pendingDeleteId === expenseId) {
      // Second click - actually delete
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      await deleteExpense.mutateAsync(expenseId);
      setPendingDeleteId(null);
    } else {
      // First click - show confirmation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPendingDeleteId(expenseId);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="rounded-md border border-border/60 bg-card">
          <div className="border-b border-border/60 px-3 py-1.5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Recent Transactions</h2>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (displayedExpenses.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="rounded-md border border-border/60 bg-card">
          <div className="border-b border-border/60 px-3 py-1.5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Recent Transactions</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="text-3xl mb-2 opacity-40">📝</div>
            <p className="text-xs text-muted-foreground">
              No transactions yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-md border border-border/60 bg-card overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/60 px-3 py-1.5">
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Recent Transactions</h2>
        </div>

        {/* Column Headers */}
        <div className="border-b border-border/40 bg-muted/30 px-3 py-1">
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="w-4 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">Description</div>
            <div className="w-24 flex-shrink-0 hidden lg:block">Category</div>
            <div className="w-24 flex-shrink-0 text-right">Amount</div>
            <div className="w-20 flex-shrink-0"></div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="divide-y divide-border/60">
          {displayedExpenses.map((expense) => {
            const isPendingDelete = pendingDeleteId === expense.id;

            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-muted/50 transition-colors group"
              >
                {/* Icon */}
                <div className="w-4 text-sm flex-shrink-0 text-center leading-none">
                  {CATEGORY_ICONS[expense.category as ExpenseCategory]}
                </div>

                {/* Description + Meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate leading-tight">
                    {expense.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {CATEGORY_LABELS[expense.category as ExpenseCategory]} · {formatDate(expense.date)}
                  </p>
                </div>

                {/* Category (desktop only) */}
                <div className="w-24 flex-shrink-0 hidden lg:block">
                  <span className="text-[11px] text-muted-foreground">
                    {CATEGORY_LABELS[expense.category as ExpenseCategory]}
                  </span>
                </div>

                {/* Amount */}
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-xs font-semibold tabular-nums">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                {/* Delete Button */}
                <div className="w-20 flex-shrink-0 flex justify-end items-center">
                  {isPendingDelete ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 text-[10px] px-2 flex items-center gap-1.5"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleteExpense.isPending}
                    >
                      {deleteExpense.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <span>Confirm?</span>
                          {/* Circular countdown timer */}
                          <svg
                            key={expense.id}
                            className="w-3.5 h-3.5 -rotate-90 flex-shrink-0"
                            viewBox="0 0 20 20"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-30"
                            />
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="50.265"
                              className="countdown-timer"
                            />
                          </svg>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
