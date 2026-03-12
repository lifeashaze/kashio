import { cache } from "react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { type CreateExpensePayload, type UpdateExpenseInput } from "@/lib/expenses/schemas";
import type { ClientExpense } from "@/lib/types/expense";

export async function createExpenseForUser(
  userId: string,
  expense: CreateExpensePayload
) {
  const result = await db
    .insert(expenses)
    .values({
      userId,
      amount: String(expense.amount),
      description: expense.description,
      category: expense.category,
      date: expense.date,
      rawInput: expense.rawInput,
    })
    .returning();

  return result[0];
}

export const listExpensesForUser = cache(async function listExpensesForUser(
  userId: string
): Promise<ClientExpense[]> {
  return db
    .select({
      id: expenses.id,
      amount: expenses.amount,
      description: expenses.description,
      category: expenses.category,
      date: expenses.date,
      rawInput: expenses.rawInput,
    })
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.createdAt));
});

export async function findOwnedExpense(id: string, userId: string) {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1);

  return expense;
}

export async function updateExpenseForUser(
  userId: string,
  expenseId: string,
  updates: UpdateExpenseInput
) {
  const result = await db
    .update(expenses)
    .set({
      amount: String(updates.amount),
      description: updates.description,
      category: updates.category,
      date: updates.date,
    })
    .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)))
    .returning();

  return result[0];
}

export async function deleteExpenseForUser(userId: string, expenseId: string) {
  await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));
}
