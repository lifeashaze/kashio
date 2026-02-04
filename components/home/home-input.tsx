"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseConfirmationDialog } from "./expense-confirmation-dialog";
import { CATEGORY_ICONS } from "@/lib/constants/categories";
import {
  SUCCESS_DISPLAY_DURATION,
  ERROR_DISPLAY_DURATION,
  VALIDATION_ERROR_DURATION,
} from "@/lib/constants/timing";
import type { ParsedExpense, ValidatedExpense } from "@/lib/types/expense";
import { apiClient, ApiError } from "@/lib/api/client";
import { useCreateExpense } from "@/lib/hooks/use-expenses";

export function HomeInput() {
  const createExpense = useCreateExpense();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "parsing" | "saving" | "saved" | "error"
  >("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [parseTime, setParseTime] = useState<number | null>(null);
  const [parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentRawInput, setCurrentRawInput] = useState("");

  const saveExpense = async (expense: ValidatedExpense, rawInput: string) => {
    try {
      setStatus("saving");

      await createExpense.mutateAsync({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
        rawInput,
      });

      setStatus("saved");
      setInput("");
      setTimeout(() => {
        setStatus("idle");
        setParsedExpense(null);
      }, SUCCESS_DISPLAY_DURATION);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unknown error"
      );
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setError(null);
      }, ERROR_DISPLAY_DURATION);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const currentInput = trimmed;
    setCurrentRawInput(currentInput);
    const start = Date.now();
    setStartTime(start);
    setParseTime(null);
    setParsedExpense(null);
    setError(null);
    setStatus("parsing");

    try {
      // Parse expense with AI
      const parsed = await apiClient.post<ParsedExpense>("/api/parse-expense", {
        prompt: currentInput,
      });

      setParsedExpense(parsed);
      setParseTime(Date.now() - start);
      setStatus("idle");

      // Case 1: Not an expense at all
      if (!parsed.isValidExpense) {
        setError(
          `${parsed.reasoning} Try something like: "$15 lunch at chipotle" or "coffee $5 this morning"`
        );
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, VALIDATION_ERROR_DURATION);
        return;
      }

      // Case 2: Missing amount (critical field)
      if (parsed.missingFields.includes("amount")) {
        setError(
          "I couldn't find an amount. Please include how much you spent (e.g., '$15' or '15 dollars')"
        );
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, VALIDATION_ERROR_DURATION);
        return;
      }

      // Case 3: Low confidence or missing fields - show confirmation dialog
      if (
        parsed.confidence === "low" ||
        parsed.missingFields.length > 0 ||
        parsed.confidence === "medium"
      ) {
        setShowConfirmDialog(true);
        return;
      }

      // Case 4: High confidence - auto-save with preview
      if (parsed.amount && parsed.description) {
        await saveExpense(
          {
            amount: parsed.amount,
            description: parsed.description,
            category: parsed.category,
            date: parsed.date,
          },
          currentInput
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unknown error"
      );
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setError(null);
      }, ERROR_DISPLAY_DURATION);
    }
  };

  const isLoading = status === "parsing" || status === "saving";
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (date.toDateString() === today.toDateString())
      return `today at ${time}`;
    if (date.toDateString() === yesterday.toDateString())
      return `yesterday at ${time}`;
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} at ${time}`;
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-end gap-2 rounded-xl sm:rounded-2xl border border-border/60 bg-card p-2 shadow-sm">
          <div className="flex-1 min-w-0">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type an expense... e.g. 'Coffee $5'"
              className="w-full resize-none bg-transparent px-2 sm:px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
              disabled={isLoading}
            />
            {!input && status === "idle" && (
              <p className="px-2 sm:px-3 pb-2 text-[10px] sm:text-xs text-muted-foreground">
                <span className="hidden sm:inline">Try: "$15 lunch at chipotle" or "coffee $5 this morning"</span>
                <span className="sm:hidden">Try: "Coffee $5" or "$15 lunch"</span>
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="h-8 sm:h-9 shrink-0 rounded-lg sm:rounded-xl px-3 sm:px-4"
          >
            {status === "saved" ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : status === "error" ? (
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Status Feedback */}
      {status === "parsing" && (
        <div className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-border/40 bg-muted/30 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm">
          <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <span className="text-muted-foreground">Parsing expense...</span>
        </div>
      )}

      {parsedExpense && parsedExpense.isValidExpense && parsedExpense.amount != null && parsedExpense.description && (
        <div className="space-y-2 sm:space-y-3 rounded-lg sm:rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-sm">
          {/* Mobile: Stack vertically, Desktop: Single line */}
          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            {/* Main expense info */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
              <span className="text-base sm:text-lg">
                {CATEGORY_ICONS[parsedExpense.category]}
              </span>
              <span className="font-semibold text-foreground">
                ${parsedExpense.amount.toFixed(2)}
              </span>
              <span className="text-muted-foreground">for</span>
              <span className="font-medium text-foreground">{parsedExpense.description}</span>

              {/* Metadata on new line on mobile */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 w-full sm:w-auto sm:contents">
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="capitalize text-muted-foreground">
                  {parsedExpense.category}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  {formatDate(parsedExpense.date)}
                </span>
              </div>
            </div>

            {/* Parse time */}
            {parseTime !== null && (
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {parseTime}ms
              </span>
            )}
          </div>

          {status === "saving" && (
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Saving to database...
            </p>
          )}
          {status === "saved" && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600">
              <Check className="h-3 w-3" />
              <span>Saved successfully!</span>
            </div>
          )}

          {/* Debug Mode - JSON Output */}
          <details className="mt-2 sm:mt-3">
            <summary className="cursor-pointer text-[10px] sm:text-xs text-muted-foreground hover:text-foreground">
              Debug Output
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-2 sm:p-3 text-[10px] sm:text-xs">
              {JSON.stringify(parsedExpense, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {parsedExpense && (
        <ExpenseConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          parsedExpense={parsedExpense}
          onConfirm={(expense) => {
            setShowConfirmDialog(false);
            saveExpense(expense, currentRawInput);
          }}
          onCancel={() => {
            setShowConfirmDialog(false);
            setStatus("idle");
          }}
        />
      )}
    </div>
  );
}
