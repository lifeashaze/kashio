"use client";

import type { LucideIcon } from "lucide-react";
import {
  Car,
  CircleHelp,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Plane,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import type { Expense } from "@/lib/schema";
import {
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { cn } from "@/lib/utils";
import { ExpenseRowActions } from "@/components/home/stats/expense-row-actions";
import {
  EXPENSE_TABLE_GRID_COLUMNS,
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

const CATEGORY_META: Record<
  ExpenseCategory,
  {
    icon: LucideIcon;
    iconClassName: string;
    badgeClassName: string;
  }
> = {
  food: {
    icon: UtensilsCrossed,
    iconClassName:
      "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    badgeClassName:
      "border-amber-200/80 bg-amber-50/90 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  },
  transport: {
    icon: Car,
    iconClassName:
      "border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    badgeClassName:
      "border-sky-200/80 bg-sky-50/90 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300",
  },
  entertainment: {
    icon: Clapperboard,
    iconClassName:
      "border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
    badgeClassName:
      "border-violet-200/80 bg-violet-50/90 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300",
  },
  shopping: {
    icon: ShoppingBag,
    iconClassName:
      "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300",
    badgeClassName:
      "border-orange-200/80 bg-orange-50/90 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300",
  },
  bills: {
    icon: ReceiptText,
    iconClassName:
      "border-slate-300/80 bg-slate-100 text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300",
    badgeClassName:
      "border-slate-300/80 bg-slate-100 text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/50 dark:text-slate-300",
  },
  health: {
    icon: HeartPulse,
    iconClassName:
      "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
    badgeClassName:
      "border-rose-200/80 bg-rose-50/90 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
  },
  groceries: {
    icon: ShoppingCart,
    iconClassName:
      "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    badgeClassName:
      "border-emerald-200/80 bg-emerald-50/90 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  travel: {
    icon: Plane,
    iconClassName:
      "border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300",
    badgeClassName:
      "border-cyan-200/80 bg-cyan-50/90 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300",
  },
  education: {
    icon: GraduationCap,
    iconClassName:
      "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
    badgeClassName:
      "border-blue-200/80 bg-blue-50/90 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
  },
  other: {
    icon: CircleHelp,
    iconClassName:
      "border-zinc-300/80 bg-zinc-100 text-zinc-700 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-300",
    badgeClassName:
      "border-zinc-300/80 bg-zinc-100 text-zinc-700 dark:border-zinc-700/70 dark:bg-zinc-900/50 dark:text-zinc-300",
  },
};

function isExpenseCategory(value: string): value is ExpenseCategory {
  return value in CATEGORY_META;
}

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
  const category = isExpenseCategory(expense.category)
    ? expense.category
    : "other";
  const { icon: CategoryIcon, iconClassName, badgeClassName } =
    CATEGORY_META[category];

  if (layout === "desktop") {
    return (
      <div
        className={cn(
          "grid items-center gap-4 px-4 py-3.5 transition-colors",
          EXPENSE_TABLE_GRID_COLUMNS,
          isPendingDelete ? "bg-destructive/8" : "hover:bg-muted/30"
        )}
      >
        <div className="flex min-w-0 items-center gap-3.5">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
              iconClassName
            )}
          >
            <CategoryIcon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium leading-5 text-foreground"
              title={expense.rawInput}
            >
              {expense.description}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <span
            className={cn(
              "inline-flex h-7 max-w-full items-center rounded-full border px-2.5 text-xs font-semibold tracking-[0.01em]",
              badgeClassName
            )}
          >
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {formatExpenseDate(expense.date)}
        </div>

        <div className="justify-self-end">
          <span className="inline-flex min-w-[6.75rem] justify-end text-base font-semibold tabular-nums text-foreground">
            {formatExpenseCurrency(expense.amount)}
          </span>
        </div>

        <div className="justify-self-end">
          <ExpenseRowActions
            isPendingDelete={isPendingDelete}
            isDeletingCurrent={isDeletingCurrent}
            disableEdit={disableEdit}
            disableDelete={disableDelete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-3 px-4 py-3.5",
        isPendingDelete && "bg-destructive/8"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
              iconClassName
            )}
          >
            <CategoryIcon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium leading-5 text-foreground"
              title={expense.rawInput}
            >
              {expense.description}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-base font-semibold tabular-nums text-foreground">
          {formatExpenseCurrency(expense.amount)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold tracking-[0.01em]",
              badgeClassName
            )}
          >
            {CATEGORY_LABELS[category]}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {formatExpenseDate(expense.date)}
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
    </div>
  );
}
