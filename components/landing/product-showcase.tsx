"use client";

import { ArrowRight } from "lucide-react";

export function ProductShowcase() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24 md:py-32" aria-label="Product showcase">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            See it in action
          </h2>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-muted-foreground">
            From messy input to organized data in milliseconds
          </p>
        </div>

        {/* Flow Visualization */}
        <div className="space-y-12 sm:space-y-16">
          {/* Step 1: Input */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 sm:px-3 py-1 text-xs font-semibold text-primary">
                STEP 1
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Type like you're texting
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                No structure required. Write expenses however they come to mind. Kashio understands context, approximations, and natural phrasing.
              </p>
            </div>

            <div className="hidden lg:flex lg:justify-center" aria-hidden="true">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>

            <div className="overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 sm:px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <span>→</span>
                  <span className="text-foreground">coffee with alex $12</span>
                </div>
                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-primary">
                  <span>→</span>
                  <span className="text-foreground">uber ~45 to airport</span>
                </div>
                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-primary">
                  <span>→</span>
                  <span className="text-foreground">split dinner 4 ways $160</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Parse */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card">
                <div className="border-b border-border bg-muted/30 px-3 sm:px-4 py-2 sm:py-3">
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">Parsed data</div>
                </div>
                <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="rounded-lg border border-border/50 bg-background/50 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Amount</span>
                      <span className="font-mono text-sm sm:text-base font-semibold text-foreground">$12.00</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Category</span>
                      <span className="inline-flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                        <span className="text-xs sm:text-sm font-medium text-foreground">Dining</span>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Note</span>
                      <span className="text-xs sm:text-sm text-foreground">With Alex</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 hidden lg:order-2 lg:flex lg:justify-center" aria-hidden="true">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>

            <div className="order-1 lg:order-3">
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 sm:px-3 py-1 text-xs font-semibold text-primary">
                STEP 2
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                AI does the heavy lifting
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Our parser extracts amounts, merchants, categories, dates, and context. Handles currency symbols, approximations, and splits automatically.
              </p>
            </div>
          </div>

          {/* Step 3: Organize */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 sm:px-3 py-1 text-xs font-semibold text-primary">
                STEP 3
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Everything organized
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                All your expenses categorized, searchable, and ready to analyze. See spending patterns emerge without any manual work.
              </p>
            </div>

            <div className="hidden lg:flex lg:justify-center" aria-hidden="true">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>

            <div className="overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 sm:px-4 py-2 sm:py-3">
                <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">Recent expenses</div>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: "Coffee with Alex", amount: "$12.00", category: "Dining", color: "bg-chart-1" },
                  { name: "Uber to airport", amount: "$45.00", category: "Transport", color: "bg-chart-2" },
                  { name: "Dinner (split)", amount: "$40.00", category: "Dining", color: "bg-chart-1" },
                ].map((expense, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${expense.color} flex-shrink-0`} />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-foreground truncate">{expense.name}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{expense.category}</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                      {expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
