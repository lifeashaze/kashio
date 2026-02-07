"use client";

import { Check, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExpenseRowActionsProps = {
  isPendingDelete: boolean;
  isDeletingCurrent: boolean;
  disableEdit: boolean;
  disableDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function ExpenseRowActions({
  isPendingDelete,
  isDeletingCurrent,
  disableEdit,
  disableDelete,
  onEdit,
  onDelete,
}: ExpenseRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        className="h-7 w-7 border-border/60 text-muted-foreground transition-all hover:border-border hover:text-foreground hover:shadow-sm"
        onClick={onEdit}
        disabled={disableEdit}
        aria-label="Edit transaction"
        title="Edit transaction"
      >
        <Pencil className="h-3 w-3" />
      </Button>

      {isPendingDelete ? (
        <Button
          variant="destructive"
          size="icon-sm"
          className="h-7 w-7 border border-destructive/40 shadow-sm"
          onClick={onDelete}
          disabled={isDeletingCurrent}
          aria-label="Confirm delete"
          title="Confirm delete"
        >
          {isDeletingCurrent ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon-sm"
          className="h-7 w-7 border-border/60 text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive hover:shadow-sm"
          onClick={onDelete}
          disabled={disableDelete}
          aria-label="Delete transaction"
          title="Delete transaction"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
