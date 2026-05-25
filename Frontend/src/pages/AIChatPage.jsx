import React, { useEffect, useRef, useState } from "react";
import { FiCpu, FiMessageSquare, FiRefreshCw, FiSend, FiShield, FiZap } from "react-icons/fi";
import { sendAiChatApi } from "../api/aiApi";

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "I'm Kesar King AI. Ask me about sales, pending payments, delivery status, purchases, or expenses.",
  },
];

const QUICK_PROMPTS = [
  "How much pending payment is there today?",
  "Show this month's total purchase cost",
  "Which customers still have pending delivery?",
  "Give me a summary of other expenses",
];

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[92%] rounded-[1.5rem] border px-4 py-3 shadow-lg sm:max-w-[80%] ${
          isUser
            ? "border-blue-400/25 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-sky-500/10 text-white"
            : "border-blue-500/15 bg-[#08101f]/90 text-slate-100"
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-sky-500/10 ring-1 ring-white/10">
              <FiCpu className="h-4 w-4 text-cyan-300" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="whitespace-pre-wrap text-sm leading-6 text-slate-100">{message.content}</div>
          </div>

          {isUser && (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 via-cyan-500/10 to-blue-400/10 ring-1 ring-white/10">
              <FiMessageSquare className="h-4 w-4 text-sky-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-[92%] rounded-[1.5rem] border border-blue-500/15 bg-[#08101f]/90 px-4 py-3 shadow-lg sm:max-w-[80%]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-sky-500/10 ring-1 ring-white/10">
            <FiCpu className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">Thinking...</div>
            <div className="mt-1 flex gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIChatPage({ toast }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const isEmpty = messages.length <= 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = scrollAreaRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [messages, isSending]);

  const focusComposer = () => inputRef.current?.focus();

  const submitQuestion = async (rawQuestion) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        role: "user",
        content: trimmed,
      },
    ]);
    setQuestion("");

    try {
      const data = await sendAiChatApi(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: data?.answer || "I couldn't get a response right now. Please try again in a moment.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: "I couldn't fetch the data right now. Please try again in a moment.",
        },
      ]);
      toast?.error("I couldn't fetch the data right now");
    } finally {
      setIsSending(false);
      setTimeout(() => focusComposer(), 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitQuestion(question);
    setQuestion("");
  };

  const handleQuickPrompt = (prompt) => {
    void submitQuestion(prompt);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setQuestion("");
    toast?.info("Chat cleared");
    setTimeout(() => focusComposer(), 0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-orb -top-24 -right-20 h-96 w-96 bg-blue-500/20" />
        <div className="aurora-orb top-32 -left-20 h-80 w-80 bg-cyan-500/14" />
        <div className="aurora-orb bottom-[-120px] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 bg-sky-500/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-xl flex-col px-4 py-5 sm:px-6 sm:py-6">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              <FiShield className="h-3 w-3" />
              Business assistant
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Kesar King AI Chat</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Ask in plain English. I'll check the records and reply with a short, clear answer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              <FiRefreshCw className="h-4 w-4" />
              Clear chat
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-blue-500/15 bg-[#08101f]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-sky-500/10 ring-1 ring-white/10">
                  <FiZap className="h-5 w-5 text-sky-300" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">How to ask</p>
                  <p className="text-sm font-semibold text-white">Use simple English</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-blue-500/15 bg-black/25 p-3">
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Example
                  </span>
                  <p className="mt-1">How much pending payment is there today?</p>
                </div>
                <div className="rounded-2xl border border-blue-500/15 bg-black/25 p-3">
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    Example
                  </span>
                  <p className="mt-1">Which customers still have pending delivery?</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-blue-500/15 bg-[#08101f]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Quick prompts</p>
                <p className="mt-1 text-sm font-semibold text-white">Tap to search instantly</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isSending}
                    className="rounded-2xl border border-blue-500/15 bg-black/25 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 min-h-[70vh] flex-col overflow-hidden rounded-[2rem] border border-blue-500/15 bg-black/90 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 border-b border-blue-500/15 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Conversation</p>
                <h2 className="mt-1 text-lg font-display font-extrabold text-white">Ask the business assistant</h2>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.8)]" />
                Ready
              </div>
            </div>

            <div ref={scrollAreaRef} className="chat-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 scroll-smooth sm:px-6 sm:py-5">
              {isEmpty && (
                <div className="rounded-[1.75rem] border border-dashed border-blue-500/15 bg-black/25 p-6 text-center text-slate-300">
                  <p className="text-sm font-medium">Type your first question and I'll answer in simple English.</p>
                  <p className="mt-1 text-xs text-slate-500">Example: "How much pending payment is there today?"</p>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isSending && <TypingBubble />}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-blue-500/15 bg-black/30 p-3 sm:p-4">
              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Ask anything
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Example: How much pending payment is there today?"
                    className="w-full rounded-[1.35rem] border border-blue-500/15 bg-[#05070f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !question.trim()}
                  className="inline-flex h-[52px] min-w-[96px] items-center justify-center gap-2 rounded-[1.35rem] bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSend className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
