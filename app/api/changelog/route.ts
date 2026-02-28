import { db } from "@/lib/db";
import { changelog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { created, success } from "@/lib/api/responses";
import {
  parseRequestBody,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";

const changelogRequestSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
  date: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Invalid date value",
    })
    .optional(),
});

export async function GET() {
  return withServerErrorBoundary("fetch changelog", async () => {
    const entries = await db
      .select()
      .from(changelog)
      .orderBy(desc(changelog.date));

    return success(entries);
  });
}

export async function POST(request: Request) {
  return withServerErrorBoundary("create changelog entry", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(request, changelogRequestSchema);
    if (!body.ok) return body.response;

    const [entry] = await db
      .insert(changelog)
      .values({
        date: body.data.date ? new Date(body.data.date) : new Date(),
        content: body.data.content,
      })
      .returning();

    return created(entry);
  });
}
