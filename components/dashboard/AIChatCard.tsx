"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, ArrowRight, Brain, Zap } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const quickActions = ['Prepare notes', 'Reschedule sync', 'Summarize email'];

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'I\'ve analyzed your schedule for today. You have a 2-hour deep work block available before your 2:30 PM meeting. Would you like me to prepare the research notes for Project Reality?',
  },
];

export const AIChatCard = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const sendMessage = async (promptOverride?: string) => {
    const trimmedInput = (promptOverride ?? input).trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmedInput,
    };

    const conversationForRequest = [...messages, userMessage];
    setMessages(conversationForRequest);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationForRequest }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to get a response right now.');
      }

      const assistantReply: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data?.text || 'I’m here to help.',
      };

      setMessages((current) => [...current, assistantReply]);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Something went wrong.';
      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content: 'I hit a temporary issue. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <GlassCard className="p-6 h-full flex flex-col" delay={0.4}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Reality Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Systems Ready</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-400 flex items-center gap-1">
            <Brain size={10} />
            Gemini
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-1">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border p-4 text-sm leading-relaxed ${
              message.role === 'assistant'
                ? 'bg-white/5 border-white/5 text-zinc-300'
                : 'ml-auto max-w-[85%] bg-blue-500/10 border border-blue-500/20 text-white'
            }`}
          >
            {message.content}
          </motion.div>
        ))}

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

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {quickActions.map((suggestion, index) => (
            <button
              key={index}
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

      <div className="relative group">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
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

      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 uppercase tracking-tighter">
          <Zap size={10} />
          {isLoading ? 'Processing…' : 'Latency: 240ms'}
        </div>
      </div>
    </GlassCard>
  );
};