"use client";

import { Mic, MessageSquare, BarChart3, Target } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice input",
    description:
      "Press the mic and speak your expense. Kashio transcribes and parses it instantly — no typing required.",
    example: {
      label: "Say it out loud",
      lines: [
        { icon: "🎙️", text: "\"Grabbed coffee, twelve dollars\"" },
        { icon: "✓", text: "Coffee · $12 · Food", muted: true },
      ],
    },
    accent: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-500",
    ringColor: "ring-rose-500/20",
    dotColor: "bg-rose-500",
  },
  {
    icon: MessageSquare,
    title: "AI chat assistant",
    description:
      "Ask anything about your finances in plain English. Get instant answers about spending habits, totals, and trends.",
    example: {
      label: "Ask your data",
      lines: [
        { icon: "💬", text: "\"How much did I spend on food last month?\"" },
        { icon: "✓", text: "You spent $487 on food in February.", muted: true },
      ],
    },
    accent: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
    ringColor: "ring-violet-500/20",
    dotColor: "bg-violet-500",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    description:
      "See where your money actually goes. Spending charts, category breakdowns, day-of-week patterns, and budget comparisons.",
    example: {
      label: "Your spending at a glance",
      bars: [
        { label: "Food", pct: 72, color: "bg-chart-1" },
        { label: "Transport", pct: 45, color: "bg-chart-2" },
        { label: "Shopping", pct: 30, color: "bg-chart-3" },
      ],
    },
    accent: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
    ringColor: "ring-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  {
    icon: Target,
    title: "Budget tracking",
    description:
      "Set a monthly budget and track it in real time. Know exactly how much you have left and where you're overspending.",
    example: {
      label: "This month",
      budget: { spent: 1840, total: 3000 },
    },
    accent: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
    ringColor: "ring-amber-500/20",
    dotColor: "bg-amber-500",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24 md:py-32"
      aria-label="Features"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-muted-foreground">
            Powerful features designed to make expense tracking effortless
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid gap-4 sm:gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} ring-1 ${feature.ringColor}`}
                >
                  <Icon className={`h-5 w-5 ${feature.iconColor}`} aria-hidden="true" />
                </div>

                {/* Text */}
                <h3 className="mt-4 font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Preview */}
                <div
                  className={`mt-5 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br ${feature.accent}`}
                >
                  <div className="border-b border-border/30 px-3 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {feature.example.label}
                    </span>
                  </div>
                  <div className="p-4">
                    {feature.example.lines && (
                      <div className="space-y-2">
                        {feature.example.lines.map((line, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="text-sm">{line.icon}</span>
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                line.muted ? "text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {feature.example.bars && (
                      <div className="space-y-2.5">
                        {feature.example.bars.map((bar) => (
                          <div key={bar.label}>
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {bar.label}
                              </span>
                              <span className="text-[11px] tabular-nums text-muted-foreground">
                                {bar.pct}%
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                              <div
                                className={`h-full rounded-full ${bar.color}`}
                                style={{ width: `${bar.pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {feature.example.budget && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Spent</span>
                          <span className="font-mono text-sm font-semibold text-foreground">
                            ${feature.example.budget.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted/50">
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all"
                            style={{
                              width: `${Math.round(
                                (feature.example.budget.spent / feature.example.budget.total) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">
                            ${(feature.example.budget.total - feature.example.budget.spent).toLocaleString()} remaining
                          </span>
                          <span className="text-[11px] font-medium text-muted-foreground">
                            of ${feature.example.budget.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Background glow */}
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.accent} blur-[80px]`}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Section background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
    </section>
  );
}
