"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            kashio
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm font-medium px-2 sm:px-3"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-primary text-xs sm:text-sm font-medium shadow-lg shadow-primary/30 px-3 sm:px-4"
              asChild
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
