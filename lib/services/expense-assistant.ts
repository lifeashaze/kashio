import { createGroq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  generateText,
  streamText,
  type UIMessage,
} from "ai";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

async function getExpensesContext(userId: string) {
  const userExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));

  if (userExpenses.length === 0) {
    return "No expenses recorded yet.";
  }

  return userExpenses
    .map((expense) => {
      return `${expense.date}: ${expense.description} [${expense.category}] $${expense.amount}`;
    })
    .join("\n");
}

async function getAssistantSystemPrompt(userId: string) {
  const today = getTodayDateString();
  const expensesContext = await getExpensesContext(userId);

  return `You are a helpful financial assistant for Kashio, a personal expense tracking app.
Today's date is ${today}.

The user's complete expense history (format: date: description [category] $amount):
${expensesContext}

Guidelines:
- Answer questions about spending patterns, totals by category or date range, and trends
- Be concise, friendly, and precise with numbers
- Format amounts as dollars (e.g., $42.50)
- When calculating totals, be exact using the data provided
- Use markdown formatting: bold for key amounts, bullet lists for breakdowns, tables for comparisons
- If the user has no expenses, encourage them to add some on the home page
- Stay focused on expense and financial topics; gently redirect off-topic questions`;
}

export async function streamExpenseAssistantResponse({
  userId,
  messages,
}: {
  userId: string;
  messages: UIMessage[];
}) {
  const systemPromise = getAssistantSystemPrompt(userId);
  const modelMessagesPromise = convertToModelMessages(messages);
  const [system, modelMessages] = await Promise.all([
    systemPromise,
    modelMessagesPromise,
  ]);

  return streamText({
    model: groq("openai/gpt-oss-120b"),
    system,
    messages: modelMessages,
  });
}

export async function answerExpenseQuestion({
  userId,
  prompt,
}: {
  userId: string;
  prompt: string;
}): Promise<{ text: string }> {
  const system = await getAssistantSystemPrompt(userId);

  const result = await generateText({
    model: groq("openai/gpt-oss-120b"),
    system,
    prompt,
  });

  return { text: result.text };
}
