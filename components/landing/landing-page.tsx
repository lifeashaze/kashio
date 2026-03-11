"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExpenseInputDemo } from "./expense-input-demo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session-context";

const STEPS = [
  {
    n: "01",
    title: "Type or speak",
    body: "Write it how you think it. \"split dinner $80\", \"uber ~45\". Or tap the mic and say it out loud.",
  },
  {
    n: "02",
    title: "AI parses it instantly",
    body: "Amount, category, merchant, and date are extracted and structured in under a second.",
  },
  {
    n: "03",
    title: "Track, analyze, ask",
    body: "Charts, budgets, and an AI you can ask: \"how much did I spend on food last month?\"",
  },
];

export function LandingPage() {
  const { session, isLoading } = useSession();

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden">

      {/* ── Nav ── */}
      <nav className="shrink-0 bg-background/90 backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight text-foreground">
            kashio
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isLoading && (
              session ? (
                <Button size="sm" className="bg-primary text-xs font-semibold shadow-sm shadow-primary/20 px-4" asChild>
                  <Link href="/home">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" className="bg-primary text-xs font-semibold shadow-sm shadow-primary/20 px-4" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">

        {/* ── Left panel ── */}
        <div className="flex w-full flex-col justify-center gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:w-[44%] lg:shrink-0 lg:gap-12 lg:border-r lg:border-border/40 lg:px-14 lg:py-16 xl:px-20">

          {/* Headline + CTA */}
          <div>
            <h1 className="font-heading text-[clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-foreground">
              Stop logging.<br />
              <span className="text-primary">Start typing.</span>
            </h1>

            <p className="mt-4 max-w-[400px] text-[15px] leading-[1.75] text-muted-foreground">
              Kashio reads plain English and turns it into structured expense data in real time. No forms, no categories to pick, no friction at all.
            </p>

            {!isLoading && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="h-11 gap-2 px-6 text-[13px] font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25"
                  asChild
                >
                  <Link href={session ? "/home" : "/signup"}>
                    {session ? "Go to dashboard" : "Start for free"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                {!session && (
                  <Button variant="ghost" size="lg" className="h-11 px-5 text-[13px] text-muted-foreground hover:text-foreground" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="hidden md:block">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">How it works</p>
            <div>
              {STEPS.map((step, i) => (
                <div key={step.n}>
                  <div className="flex items-start gap-4 py-4">
                    <span className="mt-px shrink-0 font-mono text-[10px] font-semibold text-primary/50 lg:text-[11px]">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-heading text-[13px] font-bold leading-snug text-foreground lg:text-[14px]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground lg:text-[13px]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <div className="h-px bg-border/40" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-muted/25 px-5 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-12">

          {/* Background grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            aria-hidden="true"
            style={{
              backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Radial vignette over grid */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, var(--background) 100%)",
            }}
          />

          {/* Primary glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[72px]"
            aria-hidden="true"
          />

          {/* App window */}
          <div className="relative z-10 w-full max-w-[480px]">
            {/* Top accent line */}
            <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

            {/* Window body */}
            <div className="rounded-b-2xl border border-t-0 border-border/60 bg-card/90 px-6 py-6 shadow-2xl shadow-foreground/8 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary/60">
                  Add expense
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/30">kashio</span>
              </div>
              <ExpenseInputDemo />
            </div>

          </div>

          {/* Steps on mobile */}
          <div className="relative z-10 mt-8 w-full max-w-[480px] md:hidden">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">How it works</p>
            {STEPS.map((step, i) => (
              <div key={step.n}>
                <div className="flex items-start gap-4 py-3.5">
                  <span className="mt-px shrink-0 font-mono text-[10px] font-semibold text-primary/50">{step.n}</span>
                  <div>
                    <p className="font-heading text-[13px] font-bold text-foreground">{step.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="h-px bg-border/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="shrink-0 bg-card/40 px-5 sm:px-8" role="contentinfo">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between">
          <Link href="/" className="font-heading text-sm font-bold tracking-tight text-foreground">
            kashio
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/changelog" className="text-[11px] text-muted-foreground transition-colors hover:text-foreground">
              Changelog
            </Link>
            <a
              href="https://github.com/lifeashaze"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
