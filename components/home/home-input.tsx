"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-sm">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type an expense... e.g. 'Coffee $5'"
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:text-base"
          autoFocus
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim()}
          className="h-9 shrink-0 rounded-xl px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
