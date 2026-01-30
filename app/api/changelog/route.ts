import { db } from "@/lib/db";
import { changelog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { badRequest, created, success, serverError } from "@/lib/api/responses";

export async function GET() {
  try {
    const entries = await db
      .select()
      .from(changelog)
      .orderBy(desc(changelog.date));

    return success(entries);
  } catch (error) {
    return serverError("Failed to fetch changelog", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, content } = body;

    if (!content) {
      return badRequest("Content is required");
    }

    const [entry] = await db
      .insert(changelog)
      .values({
        date: date ? new Date(date) : new Date(),
        content,
      })
      .returning();

    return created(entry);
  } catch (error) {
    return serverError("Failed to create changelog entry", error);
  }
}

