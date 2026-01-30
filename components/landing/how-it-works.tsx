"use client";

import { Type, Sparkles, BarChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Type,
    title: "Type naturally",
    description: "Express yourself however feels natural. \"coffee $5\", \"split dinner with 3 friends $120\", or \"uber ~$15\".",
    example: {
      input: "lunch with client $45",
      bg: "from-chart-1/10 to-chart-1/5",
    },
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI parses instantly",
    description: "Our AI extracts everything—amount, category, merchant, splits, context—in milliseconds. Zero manual work required.",
    example: {
      parsed: ["$45.00", "Dining", "Business lunch"],
      bg: "from-primary/10 to-primary/5",
    },
  },
  {
    number: "03",
    icon: BarChart,
    title: "Track and analyze",
    description: "Watch your finances organize themselves. Get insights, trends, and breakdowns that help you make better decisions.",
    example: {
      chart: true,
      bg: "from-chart-2/10 to-chart-2/5",
    },
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-muted-foreground">
            Three simple steps to effortless expense tracking
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-gradient-to-r from-border via-primary/50 to-border lg:block" />
                )}

                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-6 sm:p-8">
                  <div className="relative z-10">
                    {/* Number badge */}
                    <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 ring-1 ring-primary/20">
                      <span className="font-heading text-base sm:text-lg font-bold text-primary">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-4 sm:mt-6 inline-flex rounded-lg sm:rounded-xl bg-gradient-to-br p-2.5 sm:p-3 ring-1 ring-border">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="mt-4 sm:mt-6 font-heading text-xl sm:text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>

                    {/* Example visual */}
                    <div className={`mt-4 sm:mt-6 rounded-lg sm:rounded-xl border border-border/50 bg-gradient-to-br ${step.example.bg} p-3 sm:p-4`}>
                      {step.example.input && (
                        <div className="font-mono text-xs sm:text-sm text-foreground">
                          → {step.example.input}
                        </div>
                      )}
                      {step.example.parsed && (
                        <div className="space-y-1.5 sm:space-y-2">
                          {step.example.parsed.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span className="font-medium text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {step.example.chart && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs">
                            <span className="text-muted-foreground">This week</span>
                            <span className="font-mono font-semibold text-foreground">$487</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-[65%] rounded-full bg-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Background gradient */}
                  <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${step.example.bg} blur-[60px]`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-chart-2/10 blur-[100px]" />
      </div>
    </section>
  );
}
