"use client";

import type { Expense } from "@/lib/schema";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { ExpenseRowActions } from "@/components/home/stats/expense-row-actions";
import {
  formatExpenseCurrency,
  formatExpenseDate,
} from "@/components/home/stats/helpers";

type ExpenseRowProps = {
  expense: Expense;
  layout: "desktop" | "mobile";
  isPendingDelete: boolean;
  isDeletingCurrent: boolean;
  disableEdit: boolean;
  disableDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function ExpenseRow({
  expense,
  layout,
  isPendingDelete,
  isDeletingCurrent,
  disableEdit,
  disableDelete,
  onEdit,
  onDelete,
}: ExpenseRowProps) {
  const category = expense.category as ExpenseCategory;

  if (layout === "desktop") {
    return (
      <div className="grid grid-cols-[minmax(0,1.8fr)_130px_160px_110px_130px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/35">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight text-foreground">
            <span className="mr-2 inline-block text-base leading-none">
              {CATEGORY_ICONS[category]}
            </span>
            {expense.description}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Added from: {expense.rawInput}
          </p>
        </div>

        <div>
          <span className="inline-flex rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground">
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          {formatExpenseDate(expense.date)}
        </div>

        <div className="text-right">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {formatExpenseCurrency(expense.amount)}
          </span>
        </div>

        <ExpenseRowActions
          isPendingDelete={isPendingDelete}
          isDeletingCurrent={isDeletingCurrent}
          disableEdit={disableEdit}
          disableDelete={disableDelete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            <span className="mr-2 inline-block text-base leading-none">
              {CATEGORY_ICONS[category]}
            </span>
            {expense.description}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {CATEGORY_LABELS[category]} · {formatExpenseDate(expense.date)}
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatExpenseCurrency(expense.amount)}
        </span>
      </div>

      <ExpenseRowActions
        isPendingDelete={isPendingDelete}
        isDeletingCurrent={isDeletingCurrent}
        disableEdit={disableEdit}
        disableDelete={disableDelete}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
