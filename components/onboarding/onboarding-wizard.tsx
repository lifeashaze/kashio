"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BudgetStep } from "./steps/budget-step";
import { CategoriesStep } from "./steps/categories-step";
import { useSaveUserPreferences, useUpdateOnboardingStatus } from "@/lib/hooks/use-user-preferences";
import { toast } from "sonner";

const TOTAL_STEPS = 2;

const STEP_TITLES = [
  "Set your monthly budget",
  "Choose expense categories",
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const savePreferences = useSaveUserPreferences();
  const updateOnboarding = useUpdateOnboardingStatus();

  const [formData, setFormData] = useState({
    monthlyBudget: 2000,
    currency: "USD",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    enabledCategories: [
      "food",
      "transport",
      "entertainment",
      "shopping",
      "bills",
      "health",
      "groceries",
      "travel",
      "education",
      "other",
    ],
  });

  const handleNext = async () => {
    await updateOnboarding.mutateAsync({ step: currentStep + 1 });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = async () => {
    if (currentStep === TOTAL_STEPS) {
      await handleComplete();
    } else {
      await updateOnboarding.mutateAsync({ step: currentStep + 1 });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await savePreferences.mutateAsync(formData);
      await updateOnboarding.mutateAsync({ completed: true });
      router.push("/home");
    } catch (error) {
      toast.error("Failed to complete onboarding. Please try again.");
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.monthlyBudget > 0 && formData.currency.length === 3;
    }
    return true;
  };

  const handleToggleCategory = (category: string) => {
    setFormData({
      ...formData,
      enabledCategories: formData.enabledCategories.includes(category)
        ? formData.enabledCategories.filter((c) => c !== category)
        : [...formData.enabledCategories, category],
    });
  };

  const handleSelectAllCategories = () => {
    setFormData({
      ...formData,
      enabledCategories: [
        "food",
        "transport",
        "entertainment",
        "shopping",
        "bills",
        "health",
        "groceries",
        "travel",
        "education",
        "other",
      ],
    });
  };

  const handleDeselectAllCategories = () => {
    setFormData({
      ...formData,
      enabledCategories: [],
    });
  };

  return (
    <Dialog open={true} modal={true}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] sm:max-h-[85vh] p-0 gap-0 w-[95vw] sm:w-full"
        hideClose={true}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Welcome to Kashio
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {STEP_TITLES[currentStep - 1]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 w-8 sm:w-10 rounded-full transition-colors ${
                      step <= currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
            {currentStep === 1 && (
              <BudgetStep
                monthlyBudget={formData.monthlyBudget}
                currency={formData.currency}
                onMonthlyBudgetChange={(value) =>
                  setFormData({ ...formData, monthlyBudget: value })
                }
                onCurrencyChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              />
            )}

            {currentStep === 2 && (
              <CategoriesStep
                enabledCategories={formData.enabledCategories}
                onToggleCategory={handleToggleCategory}
                onSelectAll={handleSelectAllCategories}
                onDeselectAll={handleDeselectAllCategories}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 border-t flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  size="sm"
                  className="h-8 sm:h-9"
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Step {currentStep} of {TOTAL_STEPS}
              </span>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || updateOnboarding.isPending}
                  size="sm"
                  className="h-8 sm:h-9"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleComplete}
                  disabled={!canProceed() || savePreferences.isPending || updateOnboarding.isPending}
                  size="sm"
                  className="h-8 sm:h-9"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
