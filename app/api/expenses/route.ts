import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { requireAuth } from "@/lib/api/auth";
import { badRequest, created, success, serverError } from "@/lib/api/responses";
import { desc, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const body = await req.json();
    const { amount, description, category, date, rawInput } = body;

    if (!amount || !description || !category || !date || !rawInput) {
      return badRequest("Missing required fields");
    }

    const result = await db
      .insert(expenses)
      .values({
        userId: session.user.id,
        amount: amount.toString(),
        description,
        category,
        date: new Date(date),
        rawInput,
      })
      .returning();

    return created(result[0]);
  } catch (error) {
    return serverError("Failed to create expense", error);
  }
}

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, session.user.id))
      .orderBy(desc(expenses.date));

    return success(userExpenses);
  } catch (error) {
    return serverError("Failed to fetch expenses", error);
  }
}
