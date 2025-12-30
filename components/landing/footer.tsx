import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-center gap-4 text-sm md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-foreground">kashio</span>
          </Link>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link 
              href="/changelog" 
              className="transition-colors hover:text-foreground"
            >
              Changelog
            </Link>
            <span className="text-muted-foreground/40">·</span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

