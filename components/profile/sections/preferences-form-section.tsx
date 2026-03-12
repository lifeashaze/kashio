"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";
import {
  createDefaultUserPreferences,
  CURRENCIES,
  DEFAULT_TIMEZONE,
} from "@/lib/constants/preferences";
import {
  useSaveUserPreferences,
  useUserPreferences,
} from "@/lib/hooks/use-user-preferences";
import type { ClientUserPreferences } from "@/lib/types/expense";

type PreferencesFormValues = {
  monthlyBudget: number;
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  enabledCategories: string[];
};

function mapPreferencesToFormValues(
  preferences: ClientUserPreferences | null | undefined,
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
    enabledCategories: [...EXPENSE_CATEGORIES],
  };
}

function serializePreferences(values: PreferencesFormValues | null) {
  if (!values) {
    return "";
  }

  return JSON.stringify({
    ...values,
    enabledCategories: [...EXPENSE_CATEGORIES],
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
