"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import type { UserPreferences } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSection } from "@/components/profile/sections/profile-section";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/constants/categories";
import {
  createDefaultUserPreferences,
  CURRENCIES,
  DEFAULT_TIMEZONE,
} from "@/lib/constants/preferences";
import {
  useSaveUserPreferences,
  useUserPreferences,
} from "@/lib/hooks/use-user-preferences";

type PreferencesFormValues = {
  monthlyBudget: number;
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  enabledCategories: string[];
};

function sortEnabledCategories(categories: string[]) {
  return [...categories].sort(
    (left, right) =>
      EXPENSE_CATEGORIES.indexOf(left as ExpenseCategory) -
      EXPENSE_CATEGORIES.indexOf(right as ExpenseCategory)
  );
}

function mapPreferencesToFormValues(
  preferences: UserPreferences | null | undefined,
  browserTimezone: string
): PreferencesFormValues {
  if (!preferences) {
    return createDefaultUserPreferences(browserTimezone);
  }

  return {
    monthlyBudget: Number(preferences.monthlyBudget),
    currency: preferences.currency,
    timezone: preferences.timezone,
    language: preferences.language,
    dateFormat: preferences.dateFormat,
    enabledCategories: sortEnabledCategories(preferences.enabledCategories),
  };
}

function serializePreferences(values: PreferencesFormValues | null) {
  if (!values) {
    return "";
  }

  return JSON.stringify({
    ...values,
    enabledCategories: sortEnabledCategories(values.enabledCategories),
  });
}

export function PreferencesFormSection() {
  const { data, isLoading } = useUserPreferences();
  const savePreferences = useSaveUserPreferences();
  const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(
    null
  );
  const [formValues, setFormValues] = useState<PreferencesFormValues | null>(null);

  const browserTimezone =
    typeof Intl === "undefined"
      ? DEFAULT_TIMEZONE
      : Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const nextValues = mapPreferencesToFormValues(data, browserTimezone);
    setInitialValues(nextValues);
    setFormValues(nextValues);
  }, [browserTimezone, data, isLoading]);

  const isDirty = useMemo(
    () => serializePreferences(formValues) !== serializePreferences(initialValues),
    [formValues, initialValues]
  );

  const isCurrencyValid = formValues
    ? CURRENCIES.some((currency) => currency.code === formValues.currency)
    : false;
  const isBudgetValid = Boolean(formValues && formValues.monthlyBudget > 0);
  const isSaveDisabled =
    !formValues ||
    !initialValues ||
    !isDirty ||
    !isCurrencyValid ||
    !isBudgetValid ||
    isLoading ||
    savePreferences.isPending;

  const handleToggleCategory = (category: ExpenseCategory) => {
    if (!formValues) {
      return;
    }

    const enabledCategories = formValues.enabledCategories.includes(category)
      ? formValues.enabledCategories.filter((current) => current !== category)
      : [...formValues.enabledCategories, category];

    setFormValues({
      ...formValues,
      enabledCategories: sortEnabledCategories(enabledCategories),
    });
  };

  const handleSelectAll = () => {
    if (!formValues) {
      return;
    }

    setFormValues({
      ...formValues,
      enabledCategories: [...EXPENSE_CATEGORIES],
    });
  };

  const handleClearAll = () => {
    if (!formValues) {
      return;
    }

    setFormValues({
      ...formValues,
      enabledCategories: [],
    });
  };

  const handleSave = async () => {
    if (isSaveDisabled || !formValues) {
      return;
    }

    await savePreferences.mutateAsync(formValues);
  };

  return (
    <ProfileSection
      title="Preferences"
      description="Edit the settings Kashio actually uses today."
    >
      <Card>
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget" className="text-sm font-medium">
                Monthly Budget
              </Label>
              <Input
                id="monthlyBudget"
                type="number"
                min="1"
                step="1"
                value={formValues?.monthlyBudget ?? ""}
                disabled={isLoading || savePreferences.isPending}
                onChange={(event) =>
                  setFormValues((current) =>
                    current
                      ? {
                          ...current,
                          monthlyBudget:
                            Number.parseFloat(event.target.value) || 0,
                        }
                      : current
                  )
                }
                aria-invalid={!isBudgetValid}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Used in your budget cards and spending analytics.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium">
                Default Currency
              </Label>
              <Select
                value={formValues?.currency}
                disabled={isLoading || savePreferences.isPending}
                onValueChange={(currency) =>
                  setFormValues((current) =>
                    current ? { ...current, currency } : current
                  )
                }
              >
                <SelectTrigger id="currency" className="h-11">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="font-mono mr-2">{currency.symbol}</span>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Applied anywhere amounts are formatted across the app.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium">Expense Categories</h3>
                <p className="text-xs text-muted-foreground">
                  Control which categories are available when logging expenses.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isLoading || savePreferences.isPending}
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isLoading || savePreferences.isPending}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {EXPENSE_CATEGORIES.map((category) => {
                const isChecked = formValues?.enabledCategories.includes(category);

                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5 transition-colors hover:bg-accent"
                  >
                    <Checkbox
                      checked={Boolean(isChecked)}
                      disabled={isLoading || savePreferences.isPending}
                      onCheckedChange={() => handleToggleCategory(category)}
                    />
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="text-sm font-medium">
                        {CATEGORY_LABELS[category]}
                      </span>
                      {isChecked ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading your current preferences."
                : isDirty
                  ? "You have unsaved changes."
                  : "No unsaved changes."}
            </div>
            <Button onClick={handleSave} disabled={isSaveDisabled} className="sm:min-w-32">
              {savePreferences.isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProfileSection>
  );
}
