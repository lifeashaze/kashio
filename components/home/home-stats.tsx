"use client";

import { useEffect, useRef, useState } from "react";
import { ReceiptText } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { HomeStatsSkeleton } from "@/components/skeletons";
import {
  CONFIRM_TIMEOUT_MS,
  EXPENSE_TABLE_GRID_COLUMNS,
} from "@/components/home/stats/helpers";

const INITIAL_DISPLAYED_EXPENSES = 5;
const LOAD_MORE_STEP = 5;

function TransactionsCardHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
      <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Recent Transactions</h2>
      <span className="rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <TransactionsCardHeader count={0} />
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
            <ReceiptText className="h-3.5 w-3.5" />
          </div>
          <p className="text-[13px] font-semibold text-foreground">No transactions yet</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Add your first expense to start tracking.
          </p>
        </div>
      </div>
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAYED_EXPENSES);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedExpenses = expenses.slice(0, visibleCount);
  const hasMoreExpenses = expenses.length > displayedExpenses.length;
  const remainingExpenses = expenses.length - displayedExpenses.length;

  useEffect(() => {
    if (!pendingDeleteId) return;

    timeoutRef.current = setTimeout(() => {
      setPendingDeleteId(null);
    }, CONFIRM_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pendingDeleteId]);

  const handleDelete = async (expenseId: string) => {
    if (pendingDeleteId === expenseId) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        await deleteExpense.mutateAsync(expenseId);
      } finally {
        setPendingDeleteId(null);
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setPendingDeleteId(expenseId);
  };

  const handleSaveEdit = async (payload: UpdateExpensePayload) => {
    try {
      await updateExpense.mutateAsync(payload);
      setEditingExpense(null);
    } catch {
      // Mutation hook displays toast feedback.
    }
  };

  if (isLoading) {
    return <HomeStatsSkeleton />;
  }

  if (displayedExpenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <TransactionsCardHeader count={expenses.length} />

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
          {displayedExpenses.map((expense) => {
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
          {displayedExpenses.map((expense) => {
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

        {hasMoreExpenses && (
          <div className="border-t border-border/40 px-4 py-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-[11px] font-semibold"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + LOAD_MORE_STEP, expenses.length)
                )
              }
            >
              Load {Math.min(LOAD_MORE_STEP, remainingExpenses)} more
            </Button>
          </div>
        )}
      </div>

      <ExpenseEditDialog
        key={editingExpense?.id ?? "no-expense-selected"}
        expense={editingExpense}
        isSaving={updateExpense.isPending}
        onClose={() => {
          if (!updateExpense.isPending) {
            setEditingExpense(null);
          }
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
