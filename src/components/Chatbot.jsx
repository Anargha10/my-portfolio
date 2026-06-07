"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FaPaperPlane, FaRedo, FaRobot } from "react-icons/fa";

import ChatMarkdown from "@/components/ChatMarkdown";
import { CHAT_LIMITS } from "@/lib/chat/constants";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm ANARGHAI, the portfolio assistant. Ask me about **skills**, **experience**, **projects**, or how to get in touch.",
};

function createMessageId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Chatbot() {
  const [messages, setMessages] = useState([{ ...WELCOME_MESSAGE, id: createMessageId() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const remainingChars = CHAT_LIMITS.MAX_MESSAGE_LENGTH - input.length;
  const isOverLimit = remainingChars < 0;
  const canSend = input.trim().length > 0 && !loading && !isOverLimit;

  async function sendMessage(event) {
    event?.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading || isOverLimit) return;

    const userMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const payload = nextMessages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to get a response. Please try again.");
      }

      if (!data.reply) {
        throw new Error("The assistant returned an empty response.");
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      if (err.name === "AbortError") return;

      setError(err.message ?? "Something went wrong. Please try again.");
      setMessages((current) => current.filter((message) => message.id !== userMessage.id));
      setInput(trimmed);
    } finally {
      setLoading(false);
      abortRef.current = null;
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    setLoading(false);
    setError(null);
    setInput("");
    setMessages([{ ...WELCOME_MESSAGE, id: createMessageId() }]);
    textareaRef.current?.focus();
  }

  return (
    <section
      aria-label="Portfolio chat assistant"
      className="flex h-[min(32rem,70vh)] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 shadow-xl backdrop-blur"
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-700/50 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700/50">
            <FaRobot className="h-5 w-5 text-cyan-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-100">Portfolio Assistant</h2>
            <p className="hidden text-xs text-slate-400 sm:block">Powered by AI · Answers from site content</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          disabled={loading}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear chat history"
        >
          Clear
        </button>
      </header>

      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsx(
                "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "max-w-[85%] bg-cyan-500/90 text-slate-950"
                  : "max-w-[92%] bg-slate-700/70 text-slate-100"
              )}
            >
              {message.role === "assistant" ? (
                <ChatMarkdown content={message.content} />
              ) : (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="rounded-2xl bg-slate-700/70 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          role="alert"
          className="mx-4 mb-2 flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 text-red-300 hover:text-red-100"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={sendMessage} className="border-t border-slate-700/50 p-4">
        <label htmlFor="chat-input" className="sr-only">
          Message the portfolio assistant
        </label>
        <div className="flex gap-2">
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask about my work, skills, or how to reach me..."
            maxLength={CHAT_LIMITS.MAX_MESSAGE_LENGTH + 100}
            className="min-h-[3rem] flex-1 resize-none rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="flex h-[3rem] w-[3rem] shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {loading ? (
              <FaRedo className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <FaPaperPlane className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="hidden sm:inline">Enter to send · Shift+Enter for new line</span>
          <span className={clsx(isOverLimit && "text-red-400")}>
            {remainingChars} characters left
          </span>
        </div>
      </form>
    </section>
  );
}
