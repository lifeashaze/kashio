"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
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
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="xs"
        className="h-7 px-2 text-xs"
        onClick={onEdit}
        disabled={disableEdit}
      >
        <Pencil className="h-3 w-3" />
        Edit
      </Button>

      {isPendingDelete ? (
        <Button
          variant="destructive"
          size="xs"
          className="h-7 px-2 text-xs"
          onClick={onDelete}
          disabled={isDeletingCurrent}
        >
          {isDeletingCurrent ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Confirm"
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="xs"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          disabled={disableDelete}
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      )}
    </div>
  );
}
