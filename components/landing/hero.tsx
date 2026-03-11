"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session-context";

const CHIPS = [
  "coffee with sarah $12",
  "uber to airport ~45",
  "whole foods 87.50",
  "netflix $15.99",
  "gym monthly 89",
];

export function Hero() {
  const { session, isLoading } = useSession();

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 md:pt-28 md:pb-36"
      aria-label="Hero"
    >
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          AI-powered expense tracking
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[1.04] tracking-tight text-foreground">
          Type what you spent.
          <br />
          <span className="text-primary">We handle the rest.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          No forms. No dropdowns. Write expenses the way you think about them — Kashio parses, categorizes, and organizes everything instantly.
        </p>

        {/* CTA */}
        {!isLoading && (
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-12 w-full px-8 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
              asChild
            >
              <Link href={session ? "/home" : "/signup"}>
                {session ? "Go to dashboard" : "Start for free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {!session && (
              <Button
                size="lg"
                variant="ghost"
                className="h-12 w-full px-8 text-sm font-medium text-muted-foreground hover:text-foreground sm:w-auto"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        )}

        {/* Static example chips */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:mt-14">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground shadow-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/18 via-primary/6 to-transparent blur-[110px]"
        aria-hidden="true"
      />
    </section>
  );
}
