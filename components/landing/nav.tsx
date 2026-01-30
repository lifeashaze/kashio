"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function Nav() {
  const [session, setSession] = useState<{ user: { name: string; email: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (mounted) {
          setSession(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
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
