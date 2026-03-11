"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Check, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EXPENSE_EXAMPLES, CATEGORY_ICONS, type ExpenseExample } from "@/lib/data/expense-examples";

// Typing speed pattern — varied but deterministic (no Math.random)
const SPEED_PATTERN = [48, 62, 38, 54, 44, 70, 36, 58, 46, 52, 40, 66, 42, 56, 34, 60, 50, 44, 68, 38];

function shuffle(arr: ExpenseExample[]): ExpenseExample[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 1103515245 + 12345) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ExpenseInputDemo() {
  const [examples] = useState<ExpenseExample[]>(() => shuffle(EXPENSE_EXAMPLES));
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "parsing" | "done" | "clearing">("typing");
  const [dotCount, setDotCount] = useState(1);
  const [resultVisible, setResultVisible] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = examples[idx];

  // Animated dots for parsing state
  useEffect(() => {
    if (phase !== "parsing") return;
    const t = setInterval(() => setDotCount((d) => (d % 3) + 1), 280);
    return () => clearInterval(t);
  }, [phase]);

  // Main phase machine
  useEffect(() => {
    if (ref.current) clearTimeout(ref.current);

    if (phase === "typing") {
      if (display.length < current.text.length) {
        const speed = SPEED_PATTERN[display.length % SPEED_PATTERN.length];
        ref.current = setTimeout(() => {
          setDisplay(current.text.slice(0, display.length + 1));
        }, speed);
      } else {
        // Finished typing — brief pause before submitting
        ref.current = setTimeout(() => setPhase("pause"), 500);
      }
      return;
    }

    if (phase === "pause") {
      ref.current = setTimeout(() => setPhase("parsing"), 200);
      return;
    }

    if (phase === "parsing") {
      ref.current = setTimeout(() => {
        setPhase("done");
        setResultVisible(false);
        // Small delay before showing result so it feels like it just appeared
        setTimeout(() => setResultVisible(true), 40);
      }, 900);
      return;
    }

    if (phase === "done") {
      ref.current = setTimeout(() => {
        setResultVisible(false);
        setPhase("clearing");
      }, 2800);
      return;
    }

    if (phase === "clearing") {
      // Erase text quickly
      if (display.length > 0) {
        ref.current = setTimeout(() => {
          setDisplay((d) => d.slice(0, -1));
        }, 18);
      } else {
        ref.current = setTimeout(() => {
          setIdx((p) => (p + 1) % examples.length);
          setPhase("typing");
        }, 300);
      }
      return;
    }

    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [display, phase, current.text, examples.length]);

  const icon = CATEGORY_ICONS[current.category];
  const isActive = phase !== "typing" || display.length > 0;

  return (
    <div className="w-full space-y-2.5">
      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            className={cn(
              "h-11 w-full rounded-xl border bg-muted/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors duration-300",
              phase === "parsing" || phase === "pause"
                ? "border-primary/40 bg-primary/5"
                : phase === "done"
                ? "border-green-400/40 bg-green-50/50 dark:bg-green-900/10"
                : "border-border/70"
            )}
            value={display}
            placeholder="Add expense..."
            readOnly
          />
          {(phase === "typing" || phase === "pause") && (
            <span
              className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[1.5px] -translate-y-1/2 rounded-full bg-primary"
              style={{ animation: "blink-caret 1s step-end infinite" }}
            />
          )}
        </div>

        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-11 w-11 shrink-0 rounded-xl p-0"
          tabIndex={-1}
        >
          <Mic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="lg"
          disabled={!isActive || phase === "clearing"}
          className={cn(
            "h-11 min-w-[80px] shrink-0 rounded-xl px-4 text-xs font-semibold transition-all duration-300",
            phase === "done" && "opacity-100 bg-green-600 hover:bg-green-600 border-green-600",
          )}
          tabIndex={-1}
        >
          {phase === "done" ? (
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" />Saved</span>
          ) : phase === "parsing" || phase === "pause" ? (
            <span className="flex items-center gap-1 font-mono tracking-widest text-[11px]">
              {"•".repeat(dotCount)}{"·".repeat(3 - dotCount)}
            </span>
          ) : (
            <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Add</span>
          )}
        </Button>
      </div>

      {/* Result area — fixed height, all states overlap via absolute positioning */}
      <div
        className="relative overflow-hidden rounded-xl border bg-card shadow-sm transition-colors duration-500"
        style={{
          height: 80,
          borderColor: phase === "done"
            ? "rgb(134 239 172 / 0.5)"
            : phase === "parsing" || phase === "pause"
            ? "color-mix(in oklch, var(--primary) 20%, transparent)"
            : "var(--border)",
        }}
      >
        {/* Idle / typing state */}
        <div className={cn(
          "absolute inset-0 flex items-center px-4 transition-opacity duration-300",
          phase === "typing" || phase === "clearing" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex w-full items-center gap-3">
            <div className="h-7 w-7 shrink-0 rounded-full bg-muted/50" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-1/2 rounded-full bg-muted/40" />
              <div className="h-2 w-1/3 rounded-full bg-muted/25" />
            </div>
          </div>
        </div>

        {/* Parsing state */}
        <div className={cn(
          "absolute inset-0 flex flex-col justify-center gap-3 px-4 transition-opacity duration-300",
          phase === "parsing" || phase === "pause" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-primary/70">Parsing</span>
              <span className="font-mono text-xs text-primary/50">{"•".repeat(dotCount)}</span>
            </div>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-primary/10">
              <div
                key={phase === "parsing" ? "parsing" : "idle"}
                className="h-full rounded-full bg-primary/50"
                style={{ animation: phase === "parsing" ? "parse-progress 0.9s ease-out forwards" : "none" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 shrink-0 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded-full bg-muted animate-pulse" />
              <div className="h-2 w-1/2 rounded-full bg-muted/60 animate-pulse" />
            </div>
            <div className="h-2 w-8 rounded-full bg-muted/40 animate-pulse" />
          </div>
        </div>

        {/* Result state */}
        <div className={cn(
          "absolute inset-0 flex items-center px-4 transition-opacity duration-300",
          phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">{icon}</span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-sm font-bold text-foreground">
                    ${current.amount.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{current.description}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="capitalize rounded-full bg-muted px-2 py-0.5 font-medium">{current.category}</span>
                  <span className="opacity-40">·</span>
                  <span>{current.date}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-[10px] text-muted-foreground/50">{current.parseTime}ms</span>
              <div className="mt-1 flex items-center gap-1 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Logged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink-caret { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes parse-progress { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
