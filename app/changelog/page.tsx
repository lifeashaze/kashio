import { Footer } from "@/components/landing";
import { ChangelogHeader } from "@/components/changelog-header";
import { db } from "@/lib/db";
import { changelog } from "@/lib/schema";
import { desc } from "drizzle-orm";

async function getChangelog() {
  try {
    const entries = await db
      .select()
      .from(changelog)
      .orderBy(desc(changelog.date));
    return entries;
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function ChangelogPage() {
  const entries = await getChangelog();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">

      <ChangelogHeader />

      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Changelog</h1>
        <p className="mb-12 text-muted-foreground">
          What&apos;s new in Kashio
        </p>

        {entries.length > 0 ? (
          <div className="space-y-10">
            {entries.map((entry) => (
              <article key={entry.id} className="group">
                <time className="text-sm font-medium text-primary">
                  {formatDate(entry.date)}
                </time>
                <div className="mt-2 whitespace-pre-wrap text-foreground/90">
                  {entry.content}
                </div>
                <div className="mt-6 h-px bg-border/50 group-last:hidden" />
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              No changelog entries yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
