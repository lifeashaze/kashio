"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface CategoriesStepProps {
  enabledCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const CATEGORIES = [
  { id: "food", name: "Food" },
  { id: "transport", name: "Transport" },
  { id: "entertainment", name: "Entertainment" },
  { id: "shopping", name: "Shopping" },
  { id: "bills", name: "Bills" },
  { id: "health", name: "Health" },
  { id: "groceries", name: "Groceries" },
  { id: "travel", name: "Travel" },
  { id: "education", name: "Education" },
  { id: "other", name: "Other" },
];

export function CategoriesStep({
  enabledCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
}: CategoriesStepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {enabledCategories.length} of {CATEGORIES.length} selected
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="h-7 text-xs px-2"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            className="h-7 text-xs px-2"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {CATEGORIES.map((category) => {
          const isChecked = enabledCategories.includes(category.id);
          return (
            <label
              key={category.id}
              className={`flex items-center gap-2 border rounded px-2.5 py-1.5 cursor-pointer transition-colors ${
                isChecked
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-accent"
              }`}
            >
              <Checkbox
                id={category.id}
                checked={isChecked}
                onCheckedChange={() => onToggleCategory(category.id)}
                className="h-3.5 w-3.5"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
