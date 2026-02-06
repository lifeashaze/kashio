"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Expense } from "@/lib/schema";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { dateToDateOnlyString } from "@/lib/date";
import type { UpdateExpensePayload } from "@/lib/types/expense";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { buildEditFormState } from "@/components/home/stats/helpers";

type ExpenseEditDialogProps = {
  expense: Expense | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: UpdateExpensePayload) => Promise<void>;
};

export function ExpenseEditDialog({
  expense,
  isSaving,
  onClose,
  onSave,
}: ExpenseEditDialogProps) {
  const initialFormState = expense
    ? buildEditFormState(expense)
    : {
        amount: "",
        description: "",
        category: "other" as ExpenseCategory,
        date: new Date(),
      };

  const [amount, setAmount] = useState(initialFormState.amount);
  const [description, setDescription] = useState(initialFormState.description);
  const [category, setCategory] = useState<ExpenseCategory>(
    initialFormState.category
  );
  const [date, setDate] = useState(initialFormState.date);

  const canSave =
    Number.isFinite(Number(amount)) &&
    Number(amount) > 0 &&
    description.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!expense || !canSave) return;

    await onSave({
      id: expense.id,
      amount: Number(amount),
      description: description.trim(),
      category,
      date: dateToDateOnlyString(date),
    });
  };

  return (
    <AlertDialog
      open={expense !== null}
      onOpenChange={(open) => {
        if (!open && !isSaving) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="max-w-md p-5">
        <AlertDialogHeader className="space-y-1 text-left">
          <AlertDialogTitle className="text-base">Edit transaction</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Update the amount, description, category, or date.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="edit-amount" className="text-xs">
              Amount
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-8 pl-6 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-description" className="text-xs">
              Description
            </Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-category" className="text-xs">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
            >
              <SelectTrigger id="edit-category" className="h-8 w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((expenseCategory) => (
                  <SelectItem
                    key={expenseCategory}
                    value={expenseCategory}
                    className="text-sm"
                  >
                    {CATEGORY_LABELS[expenseCategory]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Date</Label>
            <DatePicker date={date} setDate={setDate} className="w-full" />
          </div>

          <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!canSave || isSaving}
              className="h-8"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
