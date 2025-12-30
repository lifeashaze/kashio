import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">kashio</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="text-muted-foreground hover:bg-muted hover:text-foreground">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/signup">Get Started</Link> <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

