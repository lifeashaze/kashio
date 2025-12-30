import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
        kashio
      </Link>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild className="text-muted-foreground hover:bg-muted hover:text-foreground">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/signup">
            Get Started <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}

