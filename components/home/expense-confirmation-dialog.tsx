"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
import { AlertCircle } from "lucide-react";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import type { ParsedExpense, ValidatedExpense } from "@/lib/types/expense";

type ExpenseConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parsedExpense: ParsedExpense;
  onConfirm: (expense: ValidatedExpense) => void;
  onCancel: () => void;
};

export function ExpenseConfirmationDialog({
  open,
  onOpenChange,
  parsedExpense,
  onConfirm,
  onCancel,
}: ExpenseConfirmationDialogProps) {
  const [amount, setAmount] = useState(
    parsedExpense.amount?.toString() || ""
  );
  const [description, setDescription] = useState(
    parsedExpense.description || ""
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    parsedExpense.category
  );
  const [date, setDate] = useState(parsedExpense.date);

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && description.trim()) {
      onConfirm({
        amount: numAmount,
        description: description.trim(),
        category,
        date,
      });
    }
  };

  const isValid = parseFloat(amount) > 0 && description.trim().length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Review Expense
          </AlertDialogTitle>
          <AlertDialogDescription>
            {parsedExpense.reasoning}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className={
                parsedExpense.missingFields.includes("amount")
                  ? "text-red-600"
                  : ""
              }
            >
              Amount {parsedExpense.missingFields.includes("amount") && "*"}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                placeholder="0.00"
                autoFocus={parsedExpense.missingFields.includes("amount")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className={
                parsedExpense.missingFields.includes("description")
                  ? "text-red-600"
                  : ""
              }
            >
              Description{" "}
              {parsedExpense.missingFields.includes("description") && "*"}
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy?"
              autoFocus={
                !parsedExpense.missingFields.includes("amount") &&
                parsedExpense.missingFields.includes("description")
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date.slice(0, 16)}
              onChange={(e) => setDate(e.target.value + ":00")}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!isValid}>
            Save Expense
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
