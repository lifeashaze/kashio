"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";
import type { TextUIPart, UIMessage } from "ai";

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my biggest expense category?",
  "Show me my food and groceries spending",
  "How does this month compare to last month?",
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");
}

interface ChatInterfaceProps {
  userName: string;
}

export function ChatInterface({ userName }: ChatInterfaceProps) {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isWaiting = status === "submitted";
  const isStreaming = status === "streaming";
  const isBusy = isWaiting || isStreaming;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const submit = () => {
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    sendMessage({ text });
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const userInitials = getUserInitials(userName);
  const lastMessageId = messages.at(-1)?.id;

  return (
    <div className="flex flex-1 flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {messages.length === 0 && !isBusy ? (
            <EmptyState onSuggestion={handleSuggestion} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const text = getMessageText(message);
                const isLastMessage = message.id === lastMessageId;
                const showCursor = isStreaming && isLastMessage && message.role === "assistant";

                if (!text && message.role === "assistant") return null;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        message.role === "assistant"
                          ? "bg-primary/10 text-primary"
                          : "bg-foreground text-background"
                      )}
                    >
                      {message.role === "assistant" ? "K" : userInitials}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        message.role === "assistant"
                          ? "rounded-tl-sm bg-card text-card-foreground ring-1 ring-border"
                          : "rounded-tr-sm bg-foreground text-background"
                      )}
                    >
                      <p className="whitespace-pre-wrap">
                        {text}
                        {showCursor && (
                          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-current opacity-70" />
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Waiting for first token */}
              {isWaiting && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    K
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3 ring-1 ring-border">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your expenses…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
            />
            <Button
              onClick={submit}
              size="icon"
              disabled={!input.trim() || isBusy}
              className="h-12 w-12 shrink-0 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <span className="font-heading text-xl font-bold text-primary">K</span>
      </div>
      <h2 className="mb-1 font-heading text-xl font-semibold text-foreground">
        Ask about your expenses
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        I have access to your full expense history and can answer any question about your spending.
      </p>
      <div className="grid w-full max-w-sm gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
