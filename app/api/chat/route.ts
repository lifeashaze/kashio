import { requireAuth } from "@/lib/api/auth";
import type { UIMessage } from "ai";
import { streamExpenseAssistantResponse } from "@/lib/services/expense-assistant";

export async function POST(req: Request) {
  const authResult = await requireAuth();
  if (!authResult.success) {
    return authResult.response;
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const userId = authResult.session.user.id;

  const result = await streamExpenseAssistantResponse({
    userId,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
