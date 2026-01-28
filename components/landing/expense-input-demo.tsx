"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";

const examples = [
  {
    text: "coffee with sarah $12",
    result: {
      amount: "$12.00",
      category: "Dining",
      merchant: "Coffee Shop",
      with: "Sarah",
    },
  },
  {
    text: "uber to airport ~45",
    result: {
      amount: "$45.00",
      category: "Transportation",
      merchant: "Uber",
      note: "To airport",
    },
  },
  {
    text: "split dinner 4 ways $160",
    result: {
      amount: "$40.00",
      category: "Dining",
      note: "Split 4 ways (total $160)",
    },
  },
  {
    text: "groceries whole foods 87.50",
    result: {
      amount: "$87.50",
      category: "Groceries",
      merchant: "Whole Foods",
    },
  },
];

export function ExpenseInputDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const current = examples[currentIndex];

  useEffect(() => {
    if (isTyping) {
      if (displayText.length < current.text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.text.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setShowResult(true);
        }, 500);
      }
    } else {
      const timeout = setTimeout(() => {
        setShowResult(false);
        setTimeout(() => {
          setDisplayText("");
          setIsTyping(true);
          setCurrentIndex((prev) => (prev + 1) % examples.length);
        }, 300);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [displayText, isTyping, current.text, currentIndex]);

  return (
    <div className="relative w-full max-w-3xl">
      {/* Input container */}
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 transition-all duration-500 hover:shadow-primary/20">
        {/* Ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />

        {/* Input area */}
        <div className="relative border-b border-border/50 bg-background/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-6 py-5">
            <Sparkles className="h-5 w-5 text-primary" />
            <input
              className="flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              value={displayText}
              placeholder="Type an expense..."
              readOnly
            />
            {isTyping && (
              <div className="h-5 w-0.5 animate-pulse bg-primary" />
            )}
            {!isTyping && (
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90">
                Add <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Parsed result */}
        <div
          className={`relative overflow-hidden transition-all duration-500 ${
            showResult ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <Check className="h-4 w-4" />
              Parsed successfully
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-background/40 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-foreground">
                  {current.result.amount}
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/40 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="text-lg font-semibold text-foreground">
                    {current.result.category}
                  </div>
                </div>
              </div>

              {current.result.merchant && (
                <div className="rounded-lg border border-border/50 bg-background/40 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Merchant
                  </div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {current.result.merchant}
                  </div>
                </div>
              )}

              {current.result.with && (
                <div className="rounded-lg border border-border/50 bg-background/40 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    With
                  </div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {current.result.with}
                  </div>
                </div>
              )}

              {current.result.note && (
                <div className="rounded-lg border border-border/50 bg-background/40 p-4 sm:col-span-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Note
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {current.result.note}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient glow */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-primary/30 blur-[60px]" />
      </div>

      {/* Indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {examples.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDisplayText("");
              setIsTyping(true);
              setShowResult(false);
              setCurrentIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex
                ? "w-8 bg-primary"
                : "w-1.5 bg-border hover:bg-border/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
