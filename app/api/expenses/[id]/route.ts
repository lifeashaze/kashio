import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { requireAuth } from "@/lib/api/auth";
import { success, serverError, notFound, forbidden } from "@/lib/api/responses";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;
    const { session } = authResult;

    const { id } = await params;

    // Verify expense exists and belongs to user
    const existing = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id))
      .limit(1);

    if (existing.length === 0) {
      return notFound("Expense not found");
    }

    if (existing[0].userId !== session.user.id) {
      return forbidden("You don't have permission to delete this expense");
    }

    await db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, session.user.id)));

    return success({ message: "Expense deleted successfully" });
  } catch (error) {
    return serverError("Failed to delete expense", error);
  }
}
