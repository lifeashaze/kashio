"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useSession } from "@/lib/session-context";

export function Nav() {
  const { session, isLoading } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="cursor-pointer font-heading text-xl font-bold tracking-tight text-foreground">
            kashio
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {!isLoading && (
              <>
                {session ? (
                  <Button
                    size="sm"
                    className="bg-primary text-xs sm:text-sm font-medium shadow-lg shadow-primary/30 px-3 sm:px-4"
                    asChild
                  >
                    <Link href="/home" className="cursor-pointer">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs sm:text-sm font-medium px-2 sm:px-3"
                      asChild
                    >
                      <Link href="/login" className="cursor-pointer">Sign in</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary text-xs sm:text-sm font-medium shadow-lg shadow-primary/30 px-3 sm:px-4"
                      asChild
                    >
                      <Link href="/signup" className="cursor-pointer">Get started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
