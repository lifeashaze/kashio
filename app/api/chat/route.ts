import { requireAuth } from "@/lib/api/auth";
import type { UIMessage } from "ai";
import { streamExpenseAssistantResponse } from "@/lib/services/expense-assistant";

export async function POST(req: Request) {
  const authResultPromise = requireAuth();
  const bodyPromise = req.json() as Promise<{ messages: UIMessage[] }>;

  const authResult = await authResultPromise;
  if (!authResult.success) {
    return authResult.response;
  }

  const { messages } = await bodyPromise;
  const userId = authResult.session.user.id;

  const result = await streamExpenseAssistantResponse({
    userId,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
