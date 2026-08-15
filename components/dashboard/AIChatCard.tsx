"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Plus,
  Search,
  Trash2,
  Pencil,
  MessageSquare,
  X,
} from "lucide-react";

import {
  getChats,
  getChat,
  updateChatMessages,
  renameChat,
  deleteChat,
  getTasks,
  getEvents,
  getDecisions,
  getCrossChatMemories,
  type RealityChat,
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
    "Hello! Welcome to RealityOS. How can I help you with your tasks, schedule, or projects today?",
};

export const AIChatCard = () => {
  const [chats, setChats] = useState<RealityChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RealityChatMessage[]>([welcomeMessage]);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  const [pendingDeleteChatId, setPendingDeleteChatId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     1. INITIALIZE SAVED CHATS ON LOAD
  ========================================================= */
  useEffect(() => {
    const savedChats = getChats();
    setChats(savedChats);
    setActiveChatId(null);
    setMessages([welcomeMessage]);
  }, []);

  /* =========================================================
     2. LIVE SEARCH
  ========================================================= */
  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = [...chats].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (!query) return sorted;

    return sorted.filter((chat) => {
      const titleMatch = chat.title.toLowerCase().includes(query);
      const messageMatch = chat.messages.some((m) =>
        m.content.toLowerCase().includes(query)
      );
      return titleMatch || messageMatch;
    });
  }, [chats, search]);

  const refreshChats = () => {
    setChats(getChats());
  };

  /* =========================================================
     3. OPEN / CONTINUE OLD CHAT
  ========================================================= */
  const openChat = (chatId: string) => {
    if (isLoading) return;

    const chat = getChat(chatId);
    if (!chat) return;

    setActiveChatId(chat.id);
    setMessages(chat.messages && chat.messages.length > 0 ? chat.messages : [welcomeMessage]);
    setError("");
    setInput("");

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  /* =========================================================
     4. NEW CHAT DRAFT
  ========================================================= */
  const handleNewChat = () => {
    if (isLoading) return;
    setActiveChatId(null);
    setMessages([welcomeMessage]);
    setInput("");
    setError("");
    setSearch("");
  };

  /* =========================================================
     5. SEND MESSAGE & CONTINUE ON EXISTING CHAT
  ========================================================= */
  const sendMessage = async (
    promptOverride?: string,
    baseMessages?: RealityChatMessage[]
  ) => {
    const trimmedInput = (promptOverride ?? input).trim();
    if (!trimmedInput || isLoading) return;

    const targetChatId = activeChatId || `chat-${Date.now()}`;
    if (!activeChatId) {
      setActiveChatId(targetChatId);
    }

    const userMessage: RealityChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedInput,
    };

    const currentBase = baseMessages ?? messages;
    const conversationForRequest = [...currentBase, userMessage];

    setMessages(conversationForRequest);
    updateChatMessages(targetChatId, conversationForRequest);
    refreshChats();

    setInput("");
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      const pastMemories = getCrossChatMemories(targetChatId);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          messages: conversationForRequest.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          workspace: {
            tasks: getTasks(),
            events: getEvents(),
            decisions: getDecisions(),
          },
          pastMemories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || `API request failed with status ${response.status}`
        );
      }

      if (!data?.text) {
        throw new Error("Gemini returned an empty response.");
      }

      const assistantReply: RealityChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: String(data.text).trim(),
      };

      const updatedMessages = [...conversationForRequest, assistantReply];

      setMessages(updatedMessages);
      updateChatMessages(targetChatId, updatedMessages);

      const currentChat = getChat(targetChatId);
      if (
        currentChat &&
        (currentChat.title === "New Chat" || currentChat.title === "Conversation")
      ) {
        const generatedTitle =
          trimmedInput.length > 25
            ? `${trimmedInput.slice(0, 25)}...`
            : trimmedInput;
        renameChat(targetChatId, generatedTitle);
      }

      refreshChats();

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    } catch (requestError) {
      const msg =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while contacting Reality Assistant.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     6. DELETE CONVERSATION
  ========================================================= */
  const handleDeleteChat = (event: React.MouseEvent, chatId: string) => {
    event.stopPropagation();
    if (isLoading) return;
    setPendingDeleteChatId(chatId);
  };

  const confirmDeleteChat = () => {
    if (!pendingDeleteChatId || isLoading) return;

    const chatId = pendingDeleteChatId;
    deleteChat(chatId);

    const remainingChats = getChats();
    setChats(remainingChats);

    if (chatId === activeChatId) {
      setActiveChatId(null);
      setMessages([welcomeMessage]);
    }

    setPendingDeleteChatId(null);
  };

  /* =========================================================
     7. RENAME CONVERSATION
  ========================================================= */
  const startRename = (event: React.MouseEvent, chat: RealityChat) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveRename = () => {
    if (!editingChatId) return;
    const cleanTitle = editingTitle.trim();
    if (!cleanTitle) {
      setEditingChatId(null);
      return;
    }
    renameChat(editingChatId, cleanTitle);
    refreshChats();
    setEditingChatId(null);
    setEditingTitle("");
  };

  /* =========================================================
     8. EDIT SENT MESSAGES
  ========================================================= */
  const startEditMessage = (message: RealityChatMessage) => {
    if (isLoading || message.role !== "user") return;
    setEditingMessageId(message.id);
    setEditingMessageText(message.content);
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const saveEditMessage = async () => {
    if (!editingMessageId || isLoading) return;
    const cleanText = editingMessageText.trim();
    if (!cleanText) return;

    const msgIndex = messages.findIndex((m) => m.id === editingMessageId);
    if (msgIndex === -1) return;

    const previousMessages = messages.slice(0, msgIndex);
    setEditingMessageId(null);
    setEditingMessageText("");

    await sendMessage(cleanText, previousMessages);
  };

  /* =========================================================
     9. KEYBOARD ENTER
  ========================================================= */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">

      {/* ================= SIDEBAR ================= */}
      <GlassCard className="relative flex flex-col p-4" style={{ height: "620px" }}>
        
        {/* NEW CHAT BUTTON */}
        <button
          type="button"
          onClick={handleNewChat}
          disabled={isLoading}
          className="mb-3 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} />
          New Chat
        </button>

        {/* SEARCH */}
        <div className="relative mb-3 shrink-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-xl border border-white/10 bg-zinc-950/50 py-2 pl-8 pr-7 text-xs text-white outline-none transition focus:border-blue-500/40 placeholder:text-zinc-600"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* TITLE */}
        <div className="mb-2 flex shrink-0 items-center gap-2 px-1">
          <MessageSquare size={13} className="text-blue-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Recent Chats
          </span>
        </div>

        {/* CHAT LIST */}
        <div 
          className="space-y-1 pr-1"
          style={{ height: "420px", overflowY: "auto" }}
        >
          {filteredChats.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center text-xs text-zinc-600">
              No previous chats.
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const isEditing = editingChatId === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => openChat(chat.id)}
                  className={`group relative cursor-pointer rounded-xl border p-2.5 transition ${
                    isActive
                      ? "border-blue-500/30 bg-blue-500/15"
                      : "border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={saveRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename();
                        if (e.key === "Escape") setEditingChatId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full rounded-md border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-white outline-none"
                    />
                  ) : (
                    <>
                      <div className="flex items-start gap-2 pr-12">
                        <MessageSquare
                          size={13}
                          className={`mt-0.5 shrink-0 ${
                            isActive ? "text-blue-400" : "text-zinc-600"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-zinc-200">
                            {chat.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-zinc-600">
                            {chat.messages.filter((m) => m.role === "user").length} messages
                          </p>
                        </div>
                      </div>

                      <div className="absolute right-2 top-2.5 hidden items-center gap-1 group-hover:flex">
                        <button
                          type="button"
                          title="Rename chat"
                          onClick={(e) => startRename(e, chat)}
                          className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          type="button"
                          title="Delete chat"
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className="rounded-md p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      {/* ================= MAIN CHAT AREA ================= */}
      <GlassCard className="relative flex flex-col p-5" style={{ height: "620px" }}>
        
        {/* HEADER */}
        <div className="mb-2 flex shrink-0 items-center justify-between gap-4 border-b border-white/5 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">
                Reality Assistant
              </h2>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Your intelligent RealityOS workspace assistant
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-400">
            <Brain size={11} />
            Gemini
          </div>
        </div>

        {/* FORCED INDEPENDENT SCROLL MESSAGES CONTAINER */}
        <div
          ref={messagesContainerRef}
          className="space-y-4 pr-2"
          style={{ 
            height: "380px", 
            maxHeight: "380px", 
            overflowY: "scroll",
            overflowX: "hidden" 
          }}
        >
          {messages.map((message) => {
            const isEditing = editingMessageId === message.id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`group relative ${
                  message.role === "assistant" ? "" : "flex justify-end"
                }`}
              >
                {isEditing ? (
                  <div className="ml-auto w-full max-w-[85%] space-y-2">
                    <textarea
                      autoFocus
                      value={editingMessageText}
                      onChange={(e) => setEditingMessageText(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs leading-relaxed text-white outline-none focus:border-blue-500/60"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={cancelEditMessage}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400 hover:bg-white/5 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void saveEditMessage()}
                        disabled={!editingMessageText.trim()}
                        className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Save & Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative rounded-2xl border p-3.5 text-xs leading-relaxed ${
                      message.role === "assistant"
                        ? "border-white/5 bg-white/5 text-zinc-300"
                        : "ml-auto max-w-[85%] border-blue-500/20 bg-blue-500/10 text-white"
                    }`}
                  >
                    {message.content}

                    {message.role === "user" && (
                      <button
                        type="button"
                        title="Edit message"
                        onClick={() => startEditMessage(message)}
                        disabled={isLoading}
                        className="absolute -left-8 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-zinc-600 transition group-hover:block hover:bg-white/10 hover:text-white disabled:opacity-50"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-zinc-400">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:240ms]" />
              </span>
              Reality Assistant is thinking...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300">
              <div className="font-semibold">Reality Assistant error</div>
              <div className="mt-0.5">{error}</div>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="shrink-0 flex gap-2 overflow-x-auto py-2">
          {quickActions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void sendMessage(suggestion)}
              disabled={isLoading}
              className="whitespace-nowrap rounded-full border border-white/5 bg-zinc-800/40 px-3 py-1 text-[11px] text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* ALWAYS VISIBLE PINNED INPUT BAR */}
        <div className="relative shrink-0 pt-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask anything..."
            aria-label="Message Reality Assistant"
            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/60 py-3 pl-4 pr-12 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/40"
          />

          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="absolute right-2.5 top-[calc(50%+2px)] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRight size={14} />
          </button>
        </div>

        {/* STATUS FOOTER */}
        <div className="mt-1 flex shrink-0 items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-600">
            <Zap size={10} />
            {isLoading ? "Processing…" : "RealityOS AI"}
          </div>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {pendingDeleteChatId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-white">
                Delete conversation?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Are you sure you want to delete this conversation? This cannot be undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDeleteChatId(null)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteChat}
                  className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};