import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, MessagesSquare, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatReply } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Ask workplace questions about meetings, feedback, prioritisation and difficult conversations and get practical AI guidance.",
      },
      { property: "og:title", content: "AI Workplace Chatbot — Workplace AI" },
      {
        property: "og:description",
        content: "Practical AI guidance for everyday workplace questions.",
      },
    ],
  }),
  component: ChatPage,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const starters = [
  "Help me plan an agenda for a project kickoff meeting.",
  "How do I give constructive feedback to a teammate?",
  "Everything is urgent this week — how should I prioritise?",
  "How should I structure a short pitch deck for leadership?",
];

/** Minimal markdown rendering for bold text and list structure. */
function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(prompt: string) {
    const text = prompt.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setLoading(true);
    const reply = await chatReply(text);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <AppShell
      title="AI Workplace Chatbot"
      description="Ask about meetings, feedback, priorities or tricky conversations and get concrete, usable answers."
    >
      <div className="surface-card flex h-[34rem] flex-col overflow-hidden sm:h-[38rem]">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <span className="brand-gradient flex size-8 items-center justify-center rounded-lg">
            <Bot className="size-4 text-primary-foreground" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Workplace Assistant</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-teal" /> Online · demo responses
            </span>
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center px-2 text-center">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft">
                <MessagesSquare className="size-5 text-primary" />
              </span>
              <p className="mt-4 text-sm font-medium">Start a conversation</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                Try one of these prompts, or ask anything about your working day.
              </p>
              <div className="mt-5 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="cursor-pointer rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-left text-xs leading-relaxed transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    m.role === "user" ? "bg-secondary" : "brand-gradient",
                  )}
                >
                  {m.role === "user" ? (
                    <User className="size-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="size-4 text-primary-foreground" />
                  )}
                </span>
                <div className={cn("max-w-[80%]", m.role === "user" && "text-right")}>
                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 text-left",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    <RichText text={m.content} />
                  </div>
                  {m.role === "assistant" && (
                    <div className="mt-1.5">
                      <CopyButton value={m.content} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3">
              <span className="brand-gradient flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Bot className="size-4 text-primary-foreground" />
              </span>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a workplace question…"
              className="max-h-32 min-h-11 resize-none"
            />
            <Button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              size="icon"
              className="size-11 shrink-0"
              aria-label="Send message"
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
