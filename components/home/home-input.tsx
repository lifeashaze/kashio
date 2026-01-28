"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export function HomeInput() {
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Start tracking…"
          className="h-14 rounded-full border-border/60 bg-background pl-6 pr-14 text-base shadow-sm md:text-lg"
          autoFocus
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:shadow-md disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Submit expense"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
