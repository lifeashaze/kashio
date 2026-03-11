import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t border-border/40 px-4 sm:px-6 py-7"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          kashio
        </span>

        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <Link
            href="/changelog"
            className="transition-colors hover:text-foreground"
          >
            Changelog
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="transition-colors hover:text-foreground"
          >
            Get started
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground/50">
          © {new Date().getFullYear()} kashio
        </p>
      </div>
    </footer>
  );
}
