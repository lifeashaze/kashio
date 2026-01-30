import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground">
            kashio
          </span>

          <Link
            href="/changelog"
            className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Changelog
          </Link>
        </div>
      </div>
    </footer>
  );
}
