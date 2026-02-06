"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import type { Expense } from "@/lib/schema";
import {
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/lib/hooks/use-expenses";
import type { UpdateExpensePayload } from "@/lib/types/expense";
import { ExpenseEditDialog } from "@/components/home/stats/expense-edit-dialog";
import { ExpenseRow } from "@/components/home/stats/expense-row";
import { CONFIRM_TIMEOUT_MS } from "@/components/home/stats/helpers";

const MAX_DISPLAYED_EXPENSES = 12;

function TransactionsCardHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
      <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
      <span className="rounded-full border border-border/80 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
          <div className="h-6 w-12 rounded-full bg-muted/60" />
        </div>
        <div className="flex items-center justify-center py-14">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <TransactionsCardHeader count={0} />
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground">
            <ReceiptText className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-foreground">No transactions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first expense to start tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeStats() {
  const { data: expenses = [], isLoading } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const updateExpense = useUpdateExpense();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedExpenses = expenses.slice(0, MAX_DISPLAYED_EXPENSES);

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
    return <LoadingState />;
  }

  if (displayedExpenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <TransactionsCardHeader count={displayedExpenses.length} />

        <div className="hidden border-b border-border/50 bg-muted/30 px-4 py-2 md:block">
          <div className="grid grid-cols-[minmax(0,1.9fr)_140px_120px_120px_92px] items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Description</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Actions</span>
          </div>
        </div>

        <div className="hidden divide-y divide-border/60 md:block">
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
                onEdit={() => setEditingExpense(expense)}
                onDelete={() => handleDelete(expense.id)}
              />
            );
          })}
        </div>

        <div className="divide-y divide-border/60 md:hidden">
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
                onEdit={() => setEditingExpense(expense)}
                onDelete={() => handleDelete(expense.id)}
              />
            );
          })}
        </div>
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
