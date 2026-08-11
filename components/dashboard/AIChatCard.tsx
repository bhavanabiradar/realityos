"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { Sparkles, ArrowRight, Brain, Zap } from "lucide-react";
import {
  getChatMessages,
  saveChatMessages,
  type RealityChatMessage,
} from "@/lib/realityStore";

const quickActions = [
  "Prepare notes",
  "Reschedule sync",
  "Summarize email",
];

const welcomeMessage: RealityChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "I've analyzed your schedule for today. You have a 2-hour deep work block available before your 2:30 PM meeting. Would you like me to prepare the research notes for Project Reality?",
};

export const AIChatCard = () => {
  const [messages, setMessages] = useState<RealityChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedMessages = getChatMessages();

    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  const sendMessage = async (promptOverride?: string) => {
    const trimmedInput = (promptOverride ?? input).trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: RealityChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedInput,
    };

    const conversationForRequest = [...messages, userMessage];

    setMessages(conversationForRequest);
    saveChatMessages(conversationForRequest);

    setInput("");
    setError("");
    setIsLoading(true);

    try {
      console.log("REALITYOS: Sending message to /api/chat");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          messages: conversationForRequest.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      console.log(
        "REALITYOS: /api/chat status:",
        response.status
      );

      const data = await response.json();

      console.log("REALITYOS: /api/chat response:", data);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `API request failed with status ${response.status}`
        );
      }

      if (!data?.text) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      const assistantReply: RealityChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: String(data.text).trim(),
      };

      setMessages((current) => {
        const updated = [...current, assistantReply];

        saveChatMessages(updated);

        return updated;
      });
    } catch (requestError) {
      console.error(
        "REALITYOS FRONTEND CHAT ERROR:",
        requestError
      );

      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while contacting Reality Assistant.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <GlassCard className="h-full min-h-[600px] flex flex-col p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-blue-400"
            />

            <h2 className="text-sm font-semibold text-white">
              Reality Assistant
            </h2>
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            Your intelligent RealityOS workspace assistant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-400 flex items-center gap-1">
            <Brain size={10} />
            Gemini
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-1">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border p-4 text-sm leading-relaxed ${
              message.role === "assistant"
                ? "bg-white/5 border-white/5 text-zinc-300"
                : "ml-auto max-w-[85%] bg-blue-500/10 border-blue-500/20 text-white"
            }`}
          >
            {message.content}
          </motion.div>
        ))}

        {/* LOADING */}
        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-zinc-400">
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:240ms]" />
            </span>

            Reality Assistant is thinking...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-3 text-xs text-red-300">
            <div className="font-semibold mb-1">
              Reality Assistant error
            </div>

            <div>{error}</div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {quickActions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void sendMessage(suggestion)}
              disabled={isLoading}
              className="whitespace-nowrap rounded-full border border-white/5 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="relative group">
        <textarea
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything..."
          aria-label="Message Reality Assistant"
          className="w-full resize-none bg-zinc-950/50 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 ring-blue-500/50 transition-all placeholder:text-zinc-600"
        />

        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-lg transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* STATUS */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 uppercase tracking-tighter">
          <Zap size={10} />
          {isLoading
            ? "Processing…"
            : "RealityOS AI"}
        </div>
      </div>
    </GlassCard>
  );
};