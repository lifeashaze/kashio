"use client";

import { useRef, useState } from "react";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseConfirmationDialog } from "./expense-confirmation-dialog";
import { CATEGORY_ICONS } from "@/lib/constants/categories";
import {
  SUCCESS_DISPLAY_DURATION,
  ERROR_DISPLAY_DURATION,
  VALIDATION_ERROR_DURATION,
} from "@/lib/constants/timing";
import { formatRelativeDateLabel } from "@/lib/date";
import type { ParsedExpense, ValidatedExpense } from "@/lib/types/expense";
import { apiClient, ApiError } from "@/lib/api/client";
import { useCreateExpense } from "@/lib/hooks/use-expenses";

const QUICK_EXAMPLES = [
  "$12 breakfast sandwich",
  "Uber $24 downtown",
  "Groceries 86.40 yesterday",
];

export function HomeInput() {
  const createExpense = useCreateExpense();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    "idle" | "parsing" | "saving" | "saved" | "error"
  >("idle");
  const [parseTime, setParseTime] = useState<number | null>(null);
  const [parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentRawInput, setCurrentRawInput] = useState("");

  const scheduleReset = (duration: number) => {
    setTimeout(() => {
      setStatus("idle");
      setError(null);
    }, duration);
  };

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return "Unknown error";
  };

  const showValidationError = (message: string) => {
    setError(message);
    setStatus("error");
    scheduleReset(VALIDATION_ERROR_DURATION);
  };

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
    } catch (error) {
      setError(resolveErrorMessage(error));
      setStatus("error");
      scheduleReset(ERROR_DISPLAY_DURATION);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const currentInput = trimmed;
    setCurrentRawInput(currentInput);
    const start = Date.now();
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
        showValidationError(
          `${parsed.reasoning} Try something like: "$15 lunch" or "coffee $5 this morning"`
        );
        return;
      }

      // Case 2: Missing amount (critical field)
      if (parsed.missingFields.includes("amount")) {
        showValidationError(
          "I couldn't find an amount. Please include how much you spent (e.g., '$15' or '15 dollars')"
        );
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
    } catch (error) {
      setError(resolveErrorMessage(error));
      setStatus("error");
      scheduleReset(ERROR_DISPLAY_DURATION);
    }
  };

  const isLoading = status === "parsing" || status === "saving";
  const formatDate = (dateStr: string) => formatRelativeDateLabel(dateStr);

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <label htmlFor="expense-input" className="sr-only">
              Enter expense
            </label>
              <input
                id="expense-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type what you spent... e.g. coffee $5 this morning"
                className="h-11 w-full rounded-xl border border-border/70 bg-muted/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background/80 focus:outline-none sm:text-base"
                autoFocus
                disabled={isLoading}
              />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!input.trim() || isLoading}
            className="h-11 shrink-0 rounded-xl px-3 sm:px-4"
          >
            {status === "saved" ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : status === "error" ? (
              <>
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Retry</span>
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">
                  {status === "parsing" ? "Parsing" : "Saving"}
                </span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3">
        {QUICK_EXAMPLES.map((example, index) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setInput(example);
              inputRef.current?.focus();
            }}
            disabled={isLoading}
            className={`h-11 w-full cursor-pointer rounded-xl bg-card px-3 text-center text-sm font-medium text-foreground shadow-sm ring-1 ring-border/60 transition-colors hover:bg-muted/70 hover:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 ${
              index === 2
                ? "col-span-2 w-[calc(50%-0.3125rem)] justify-self-center sm:col-span-1 sm:w-full"
                : ""
            }`}
          >
            {example}
          </button>
        ))}
      </div>

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
          key={currentRawInput}
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
