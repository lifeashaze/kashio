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
import { DatePicker } from "@/components/ui/date-picker";
import { AlertCircle } from "lucide-react";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import { dateOnlyStringToDate, dateToDateOnlyString } from "@/lib/date";
import type { ParsedExpense, ValidatedExpense } from "@/lib/types/expense";
import { getConfirmationMessage } from "@/lib/prompts/expense-parser";

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
  const [date, setDate] = useState(
    dateOnlyStringToDate(parsedExpense.date) ?? new Date()
  );

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && description.trim()) {
      onConfirm({
        amount: numAmount,
        description: description.trim(),
        category,
        date: dateToDateOnlyString(date),
      });
    }
  };

  const isValid = parseFloat(amount) > 0 && description.trim().length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-5 gap-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            Review Expense
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {getConfirmationMessage(
              parsedExpense.confidence,
              parsedExpense.missingFields,
              parsedExpense.reasoning
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2.5">
          {/* Amount */}
          <div className="space-y-1">
            <Label
              htmlFor="amount"
              className={`text-xs ${
                parsedExpense.missingFields.includes("amount")
                  ? "text-red-600"
                  : ""
              }`}
            >
              Amount {parsedExpense.missingFields.includes("amount") && "*"}
            </Label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-6 text-sm h-8"
                placeholder="0.00"
                autoFocus={parsedExpense.missingFields.includes("amount")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label
              htmlFor="description"
              className={`text-xs ${
                parsedExpense.missingFields.includes("description")
                  ? "text-red-600"
                  : ""
              }`}
            >
              Description{" "}
              {parsedExpense.missingFields.includes("description") && "*"}
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy?"
              className="text-sm h-8"
              autoFocus={
                !parsedExpense.missingFields.includes("amount") &&
                parsedExpense.missingFields.includes("description")
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category" className="text-xs">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
            >
              <SelectTrigger id="category" className="text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label className="text-xs">Date</Label>
            <DatePicker
              date={date}
              setDate={setDate}
              className="w-full"
            />
          </div>
        </div>

        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-1">
          <AlertDialogCancel onClick={onCancel} className="text-sm h-8 w-full sm:w-auto m-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!isValid} className="text-sm h-8 w-full sm:w-auto">
            Save Expense
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
