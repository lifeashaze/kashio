"use client";

import { Mic, Sparkles, BarChart3 } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Mic,
    title: "Type or speak",
    body: "Write expenses how they come to mind. \"coffee $12\", \"split dinner with friends $80\", \"uber ~45\". Or tap the mic and just say it — Kashio handles both.",
    preview: (
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground font-mono">split dinner 4 ways $160</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground font-mono">gym $89/month</span>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    icon: Sparkles,
    title: "AI parses it instantly",
    body: "No templates, no dropdowns. Kashio extracts the amount, category, merchant, and date from whatever you typed — even approximate values and shorthand.",
    preview: (
      <div className="space-y-2">
        {[
          { label: "Amount", value: "$40.00" },
          { label: "Category", value: "Food & Dining" },
          { label: "Date", value: "Today, 7:30 PM" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
          >
            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
            <span className="font-mono text-xs font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    icon: BarChart3,
    title: "Track, analyze, ask",
    body: "Every expense is organized and searchable. See spending charts by category, track your monthly budget, or ask the AI: \"how much did I spend on food last month?\"",
    preview: (
      <div className="space-y-2.5">
        {[
          { label: "Food", pct: 72, color: "bg-chart-1" },
          { label: "Transport", pct: 45, color: "bg-chart-2" },
          { label: "Shopping", pct: 28, color: "bg-chart-3" },
        ].map(({ label, pct, color }) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24"
      aria-label="How it works"
    >
      {/* Subtle top divider */}
      <div className="mx-auto mb-14 sm:mb-20 max-w-7xl">
        <div className="h-px w-full bg-border/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Three steps.
            <br />
            <span className="text-muted-foreground/60">Zero friction.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
              >
                {/* Step number — background watermark */}
                <span className="absolute -right-3 -top-4 font-heading text-[80px] font-bold leading-none text-muted/30 select-none pointer-events-none">
                  {step.n}
                </span>

                {/* Icon */}
                <div className="relative mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
                  <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                </div>

                {/* Text */}
                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

                {/* Preview */}
                <div>{step.preview}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-t from-primary/8 to-transparent blur-[100px]"
        aria-hidden="true"
      />
    </section>
  );
}
