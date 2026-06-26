"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Brain, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";
import type { CoachMessage } from "@/types";
import { formatRelative } from "@/lib/utils/dates";

interface ChatWindowProps {
  initialMessages: CoachMessage[];
}

export function ChatWindow({ initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setStreamingText("");

    const now = new Date().toISOString();
    const tempUserMsg: CoachMessage = {
      id: crypto.randomUUID(),
      user_id: "",
      role: "user",
      content: userMessage,
      tokens_used: null,
      created_at: now,
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        setMessages(prev => [...prev, {
          ...tempUserMsg,
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: `Error: ${err.error ?? "Unknown error"}`,
          created_at: new Date().toISOString(),
        }]);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          full += chunk;
          setStreamingText(full);
        }
      }

      const assistantMsg: CoachMessage = {
        id: crypto.randomUUID(),
        user_id: "",
        role: "assistant",
        content: full,
        tokens_used: null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamingText("");
    } catch {
      setMessages(prev => [...prev, {
        ...tempUserMsg,
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "I missed my habits for 4 days. Help me recover.",
    "I'm losing motivation. What should I do?",
    "Can you reduce my daily workload?",
    "How do I build a consistent morning routine?",
  ];

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Your AI Habit Coach</h3>
              <p className="text-muted-foreground text-sm">Ask me anything about your habits, goals, or motivation.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {examples.map(ex => (
                <button key={ex} onClick={() => setInput(ex)}
                  className="text-left text-sm border rounded-lg p-3 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "assistant" ? "gradient-primary" : "bg-secondary")}>
              {msg.role === "assistant" ? <Brain className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
              msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none")}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={cn("text-xs mt-1 opacity-60", msg.role === "user" ? "text-right" : "text-left")}>
                {formatRelative(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-none px-4 py-2.5 text-sm bg-muted">
              <p className="whitespace-pre-wrap leading-relaxed">{streamingText}<span className="animate-pulse">▌</span></p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
            placeholder="Ask your coach anything... (Enter to send)"
            rows={1}
            className="resize-none"
          />
          <Button onClick={() => void sendMessage()} disabled={loading || !input.trim()} size="icon" className="shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">AI responses are for guidance only. Press Shift+Enter for new line.</p>
      </div>
    </div>
  );
}
