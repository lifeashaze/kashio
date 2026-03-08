"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import type { Expense } from "@/lib/schema";
import {
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/lib/hooks/use-expenses";
import { useUserPreferences } from "@/lib/hooks/use-user-preferences";
import type { UpdateExpensePayload } from "@/lib/types/expense";
import { ExpenseEditDialog } from "@/components/home/stats/expense-edit-dialog";
import { ExpenseRow } from "@/components/home/stats/expense-row";
import { CATEGORY_META } from "@/components/home/stats/expense-row";
import { HomeStatsSkeleton } from "@/components/skeletons";
import { CONFIRM_TIMEOUT_MS, EXPENSE_TABLE_GRID_COLUMNS } from "@/components/home/stats/helpers";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

function EmptyState({ hasExpenses }: { hasExpenses: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
        <ReceiptText className="h-3.5 w-3.5" />
      </div>
      <p className="text-[13px] font-semibold text-foreground">
        {hasExpenses ? "No transactions this month" : "No transactions yet"}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {hasExpenses
          ? "Try a different month or category."
          : "Add your first expense to start tracking."}
      </p>
    </div>
  );
}

export function HomeStats() {
  const { data: expenses = [], isLoading } = useExpenses();
  const { data: prefs } = useUserPreferences();
  const deleteExpense = useDeleteExpense();
  const updateExpense = useUpdateExpense();

  const currency = prefs?.currency || "USD";

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive the earliest month with data to clamp back navigation
  const earliestMonth = useMemo(() => {
    if (expenses.length === 0) {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() };
    }
    const minDateStr = expenses.reduce(
      (min, e) => (e.date < min ? e.date : min),
      expenses[0].date,
    );
    const [y, m] = minDateStr.split("-").map(Number);
    return { year: y, month: m - 1 };
  }, [expenses]);

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth();
  }, [selectedMonth]);

  const isAtEarliestMonth = useMemo(
    () =>
      selectedMonth.year === earliestMonth.year &&
      selectedMonth.month === earliestMonth.month,
    [selectedMonth, earliestMonth],
  );

  const monthLabel = useMemo(
    () =>
      new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [selectedMonth],
  );

  const prevMonth = () => {
    if (isAtEarliestMonth) return;
    setSelectedCategory(null);
    setSelectedMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const nextMonth = () => {
    if (isCurrentMonth) return;
    setSelectedCategory(null);
    setSelectedMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Parse YYYY-MM-DD without timezone ambiguity
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const [y, m] = e.date.split("-").map(Number);
        return y === selectedMonth.year && m - 1 === selectedMonth.month;
      }),
    [expenses, selectedMonth],
  );

  const monthlyTotal = useMemo(
    () => monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [monthlyExpenses],
  );

  const usedCategories = useMemo(() => {
    const present = new Set(monthlyExpenses.map((e) => e.category));
    return EXPENSE_CATEGORIES.filter((c) => present.has(c));
  }, [monthlyExpenses]);

  useEffect(() => {
    if (selectedCategory && !usedCategories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [usedCategories, selectedCategory]);

  const filteredExpenses = useMemo(
    () =>
      selectedCategory
        ? monthlyExpenses.filter((e) => e.category === selectedCategory)
        : monthlyExpenses,
    [monthlyExpenses, selectedCategory],
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    if (!pendingDeleteId) return;
    timeoutRef.current = setTimeout(() => setPendingDeleteId(null), CONFIRM_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pendingDeleteId]);

  const handleDelete = async (expenseId: string) => {
    if (pendingDeleteId === expenseId) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      try {
        await deleteExpense.mutateAsync(expenseId);
      } finally {
        setPendingDeleteId(null);
      }
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPendingDeleteId(expenseId);
  };

  const handleSaveEdit = async (payload: UpdateExpensePayload) => {
    try {
      await updateExpense.mutateAsync(payload);
      setEditingExpense(null);
    } catch {
      // Mutation hook shows toast.
    }
  };

  if (isLoading) {
    return <HomeStatsSkeleton />;
  }

  const navBtn = (disabled: boolean) =>
    cn(
      "flex h-5 w-5 items-center justify-center rounded transition-colors text-muted-foreground",
      disabled
        ? "cursor-not-allowed opacity-30"
        : "cursor-pointer hover:bg-muted/60 hover:text-foreground",
    );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2">

      {/* ── Month picker + category pills — one unified control row ── */}
      <div className="flex w-full items-center gap-1.5">
        {/* "All" pill */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center rounded-full border px-2 py-1 text-[11px] font-semibold transition-colors",
            selectedCategory === null
              ? "border-foreground/20 bg-foreground text-background"
              : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          )}
        >
          All
        </button>

        {usedCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isActive ? null : cat)}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center rounded-full border px-2 py-1 text-[11px] font-semibold transition-colors",
                isActive
                  ? CATEGORY_META[cat].badgeClassName
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* ── Transactions card ── */}
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">

        {/* Header: month navigation as title, total right */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              disabled={isAtEarliestMonth}
              aria-label="Previous month"
              className={navBtn(isAtEarliestMonth)}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <h2 className="select-none text-[13px] font-semibold tracking-tight text-foreground">
              {monthLabel}
            </h2>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              aria-label="Next month"
              className={navBtn(isCurrentMonth)}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <span className="font-mono text-[12px] font-semibold tabular-nums text-muted-foreground">
            {formatCurrency(filteredExpenses.reduce((s, e) => s + Number(e.amount), 0))}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <EmptyState hasExpenses={expenses.length > 0} />
        ) : (
          <>
            <div className="hidden border-b border-border/40 bg-muted/20 px-4 py-1.5 md:block">
              <div
                className={`grid ${EXPENSE_TABLE_GRID_COLUMNS} items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80`}
              >
                <span>Description</span>
                <span>Category</span>
                <span>Date</span>
                <span className="justify-self-end">Amount</span>
                <span className="justify-self-end">Actions</span>
              </div>
            </div>

            <div className="hidden divide-y divide-border/40 md:block">
              {filteredExpenses.map((expense) => {
                const isPendingDelete = pendingDeleteId === expense.id;
                return (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    layout="desktop"
                    isPendingDelete={isPendingDelete}
                    isDeletingCurrent={deleteExpense.isPending && isPendingDelete}
                    disableEdit={deleteExpense.isPending || updateExpense.isPending}
                    disableDelete={updateExpense.isPending}
                    currency={currency}
                    onEdit={() => setEditingExpense(expense)}
                    onDelete={() => handleDelete(expense.id)}
                  />
                );
              })}
            </div>

            <div className="divide-y divide-border/40 md:hidden">
              {filteredExpenses.map((expense) => {
                const isPendingDelete = pendingDeleteId === expense.id;
                return (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    layout="mobile"
                    isPendingDelete={isPendingDelete}
                    isDeletingCurrent={deleteExpense.isPending && isPendingDelete}
                    disableEdit={deleteExpense.isPending || updateExpense.isPending}
                    disableDelete={updateExpense.isPending}
                    currency={currency}
                    onEdit={() => setEditingExpense(expense)}
                    onDelete={() => handleDelete(expense.id)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      <ExpenseEditDialog
        key={editingExpense?.id ?? "no-expense-selected"}
        expense={editingExpense}
        isSaving={updateExpense.isPending}
        onClose={() => {
          if (!updateExpense.isPending) setEditingExpense(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
