"use client";

import { ExpenseInputDemo } from "./expense-input-demo";

export function ProductShowcase() {
  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-24"
      aria-label="See it in action"
    >
      <div className="mx-auto mb-14 sm:mb-20 max-w-7xl">
        <div className="h-px w-full bg-border/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            In action
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            See it work
          </h2>
        </div>

        {/* Demo — same max-width as the actual home input */}
        <ExpenseInputDemo />
      </div>
    </section>
  );
}
