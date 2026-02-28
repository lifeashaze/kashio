import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { requireAuth } from "@/lib/api/auth";
import { eq, desc } from "drizzle-orm";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const authResult = await requireAuth();
  if (!authResult.success) {
    return authResult.response;
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const userId = authResult.session.user.id;

  const userExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));

  const today = new Date().toISOString().split("T")[0];

  const expensesContext =
    userExpenses.length > 0
      ? userExpenses
          .map((e) => `${e.date}: ${e.description} [${e.category}] $${e.amount}`)
          .join("\n")
      : "No expenses recorded yet.";

  const result = streamText({
    model: groq("moonshotai/kimi-k2-instruct-0905"),
    system: `You are a helpful financial assistant for Kashio, a personal expense tracking app.
Today's date is ${today}.

The user's complete expense history (format: date: description [category] $amount):
${expensesContext}

Guidelines:
- Answer questions about spending patterns, totals by category or date range, and trends
- Be concise, friendly, and precise with numbers
- Format amounts as dollars (e.g., $42.50)
- When calculating totals, be exact using the data provided
- Use plain text formatting — no markdown bold or headers, just clear sentences and line breaks
- If the user has no expenses, encourage them to add some on the home page
- Stay focused on expense and financial topics; gently redirect off-topic questions`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
