import { db } from "@/lib/db";
import { changelog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const entries = await db
      .select()
      .from(changelog)
      .orderBy(desc(changelog.date));

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch changelog:", error);
    return NextResponse.json(
      { error: "Failed to fetch changelog" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const [entry] = await db
      .insert(changelog)
      .values({
        date: date ? new Date(date) : new Date(),
        content,
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Failed to create changelog entry:", error);
    return NextResponse.json(
      { error: "Failed to create changelog entry" },
      { status: 500 }
    );
  }
}

