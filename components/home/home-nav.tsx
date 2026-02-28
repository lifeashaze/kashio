"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getUserInitials } from "@/lib/user";

interface HomeNavProps {
  user: {
    name: string;
    email: string;
  };
}

export function HomeNav({ user }: HomeNavProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home" className="cursor-pointer font-heading text-xl font-bold tracking-tight text-foreground">
            kashio
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MessageSquare className="size-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Link>
          <ThemeToggle />
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 rounded-full border-border/60 bg-background/70 p-0 text-xs font-semibold"
              aria-label="Open profile menu"
              onClick={() => setShowMenu(!showMenu)}
            >
              {getUserInitials(user.name)}
            </Button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-background shadow-lg">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getUserInitials(user.name)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium text-foreground">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setShowMenu(false)}
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                    <button
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      <LogOut className="size-4" />
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
}
