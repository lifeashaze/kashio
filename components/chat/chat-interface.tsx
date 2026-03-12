"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Send, Loader2, Copy, Check, ChevronDown, Sparkles, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";
import type { TextUIPart, UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useVoiceInput } from "@/lib/hooks/use-voice-input";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent"
      aria-label="Copy message"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

interface ChatInterfaceProps {
  userName: string;
}

export function ChatInterface({ userName }: ChatInterfaceProps) {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const supportsMediaRecorder =
    isClient && typeof MediaRecorder !== "undefined";
  const voice = useVoiceInput();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isWaiting = status === "submitted";
  const isStreaming = status === "streaming";
  const isBusy = isWaiting || isStreaming;

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, scrollToBottom]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollButton(distFromBottom > 100);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleVoiceClick = async () => {
    if (voice.status === "recording") {
      try {
        const text = await voice.stopRecording();
        if (text.trim()) {
          sendMessage({ text: text.trim() });
        }
      } catch {
        // error already set in hook
      }
    } else if (voice.status === "idle" || voice.status === "error") {
      voice.reset();
      await voice.startRecording();
    }
  };

  const userInitials = getUserInitials(userName);
  const lastMessageId = messages.at(-1)?.id;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages area + scroll button */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {messages.length === 0 && !isBusy ? (
            <EmptyState onSuggestion={handleSuggestion} />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const text = getMessageText(message);
                const isLastMessage = message.id === lastMessageId;
                const showCursor = isStreaming && isLastMessage && message.role === "assistant";

                if (!text && message.role === "assistant") return null;

                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold mb-0.5",
                        !isUser
                          ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                          : "bg-foreground/90 text-background"
                      )}
                    >
                      {!isUser ? "K" : userInitials}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "group relative max-w-[82%]",
                        isUser ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          !isUser
                            ? "rounded-bl-sm bg-card text-card-foreground ring-1 ring-border/60 shadow-sm"
                            : "rounded-br-sm bg-foreground text-background"
                        )}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{text}</p>
                        ) : (
                          <div
                            className={cn(
                              "prose prose-sm max-w-none",
                              "prose-p:my-1 prose-p:leading-relaxed",
                              "prose-ul:my-1.5 prose-ul:pl-4",
                              "prose-ol:my-1.5 prose-ol:pl-4",
                              "prose-li:my-0.5",
                              "prose-strong:font-semibold prose-strong:text-foreground",
                              "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono",
                              "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-3",
                              "prose-headings:font-semibold prose-headings:text-foreground",
                              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                              "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                              "text-card-foreground"
                            )}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {text}
                            </ReactMarkdown>
                            {showCursor && (
                              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-current opacity-70" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Copy button for AI messages */}
                      {!isUser && text && !showCursor && (
                        <div className="mt-1 flex justify-start pl-1">
                          <CopyButton text={text} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Waiting for first token */}
              {isWaiting && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/20 mb-0.5">
                    K
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-card px-4 py-3 ring-1 ring-border/60 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Scroll to bottom
          </button>
        </div>
      )}
      </div>

      {/* Input */}
      <div className="bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 pb-5 pt-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your expenses…"
              rows={1}
              autoComplete="off"
              className="flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
              style={{ minHeight: "48px", maxHeight: "140px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
              }}
            />
            {supportsMediaRecorder && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleVoiceClick}
                disabled={isBusy || voice.status === "transcribing"}
                className={cn(
                  "mb-0.5 h-10 w-10 shrink-0 rounded-xl",
                  voice.status === "recording" && "border-red-400 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
                )}
                title={voice.status === "recording" ? "Stop recording" : "Voice input"}
              >
                {voice.status === "transcribing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : voice.status === "recording" ? (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <MicOff className="relative h-4 w-4" />
                  </span>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              onClick={submit}
              size="icon"
              disabled={!input.trim() || isBusy}
              className="mb-0.5 h-10 w-10 shrink-0 rounded-xl"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <h2 className="mb-2 font-heading text-xl font-semibold text-foreground">
        Ask about your expenses
      </h2>
      <p className="mb-8 max-w-xs text-sm text-muted-foreground">
        I have access to your full expense history and can answer any question about your spending habits.
      </p>
      <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-accent hover:text-foreground hover:shadow-none"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
