"use client";

import { useState, useEffect } from "react";
import { Send, Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const examples = [
  {
    text: "coffee with sarah $12",
    result: {
      amount: "$12.00",
      category: "Dining",
      merchant: "Coffee Shop",
    },
  },
  {
    text: "uber to airport ~45",
    result: {
      amount: "$45.00",
      category: "Transportation",
      merchant: "Uber",
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
  {
    text: "netflix subscription $15.99",
    result: {
      amount: "$15.99",
      category: "Subscriptions",
      merchant: "Netflix",
    },
  },
  {
    text: "lunch chipotle 18",
    result: {
      amount: "$18.00",
      category: "Dining",
      merchant: "Chipotle",
    },
  },
  {
    text: "gas station shell $52",
    result: {
      amount: "$52.00",
      category: "Transportation",
      merchant: "Shell",
    },
  },
  {
    text: "gym membership $89/month",
    result: {
      amount: "$89.00",
      category: "Health & Fitness",
      merchant: "Gym",
    },
  },
];

export function ExpenseInputDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const current = examples[currentIndex];

  useEffect(() => {
    // Start typing after a brief delay
    if (!isTyping && !isProcessing && !showResult && displayText.length === 0) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }

    if (isTyping) {
      if (displayText.length < current.text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.text.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setShowResult(true);
          }, 800);
        }, 500);
      }
    } else if (showResult) {
      const timeout = setTimeout(() => {
        setShowResult(false);
        setDisplayText("");
        setCurrentIndex((prev) => (prev + 1) % examples.length);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [displayText, isTyping, isProcessing, showResult, current.text, currentIndex]);

  return (
    <div className="relative w-full max-w-5xl">
      {/* Split view container */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left side - Input */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />

          <div className="relative p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">You type</h3>
              <p className="text-xs text-muted-foreground">Natural language, no forms</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    value={displayText}
                    placeholder="Type an expense..."
                    readOnly
                  />
                  {isTyping && displayText && (
                    <div className="h-5 w-0.5 animate-pulse bg-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Parsed result */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-primary/5" />

          <div className="relative p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">We understand</h3>
                <p className="text-xs text-muted-foreground">Automatically parsed</p>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary animate-in fade-in duration-300">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Parsing
                </div>
              )}
              {showResult && (
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary animate-in fade-in slide-in-from-right-2 duration-300">
                  <Check className="h-3 w-3" />
                  Added
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className={`rounded-xl border border-border bg-background p-4 transition-all duration-300 ${
                !showResult ? 'opacity-40 blur-[2px]' : ''
              }`}>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-foreground">
                  {showResult ? current.result.amount : "$0.00"}
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div className={`rounded-xl border border-border bg-background p-4 transition-all duration-300 ${
                  !showResult ? 'opacity-40 blur-[2px]' : ''
                }`}>
                  <div className="text-xs font-medium text-muted-foreground">Category</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${showResult ? 'bg-primary' : 'bg-border'}`} />
                    <div className="text-sm font-semibold text-foreground">
                      {showResult ? current.result.category : "—"}
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl border border-border bg-background p-4 transition-all duration-300 ${
                  !showResult ? 'opacity-40 blur-[2px]' : ''
                }`}>
                  <div className="text-xs font-medium text-muted-foreground">Merchant</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">
                    {showResult ? current.result.merchant : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {examples.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDisplayText("");
              setIsTyping(false);
              setIsProcessing(false);
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
