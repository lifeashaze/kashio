"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function HomeNav() {
  return (
    <nav className="sticky top-0 z-30 bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          kashio
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-full border-border/60 bg-background/70 p-0 text-xs font-semibold"
            aria-label="Open profile"
          >
            AR
          </Button>
        </div>
      </div>
    </nav>
  );
}
