"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function ChangelogHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to home
      </Link>
      <ThemeToggle />
    </header>
  );
}
