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
  Paperclip,
  Image as ImageIcon,
  FileText,
  Loader2,
  Check,
} from "lucide-react";

import {
  fetchChatSessions,
  createChatSession,
  renameChatSession,
  deleteChatSession,
  fetchSessionMessages,
  saveSessionChatMessage,
  fetchUserDocuments,
} from "@/lib/supabaseStore";
import { getTasks, getEvents, getDecisions } from "@/lib/realityStore";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment_name?: string;
  attachment_url?: string;
  created_at?: string;
}

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your RealityOS Assistant. I can analyze your documents, schedule priorities, solve math/code queries, and manage your workspace. How can I help you today?",
};

export const AIChatCard = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit session title state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");

  // Attachment state
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    previewUrl?: string;
    base64?: string;
    mimeType?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     1. LOAD SESSIONS ON MOUNT
  ========================================================= */
  useEffect(() => {
    async function loadSessions() {
      const data = await fetchChatSessions();
      setSessions(data);
      if (data.length > 0) {
        selectSession(data[0].id);
      } else {
        startNewChat();
      }
    }
    loadSessions();
  }, []);

  const selectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsLoading(true);
    setError("");
    try {
      const msgs = await fetchSessionMessages(sessionId);
      setMessages(msgs.length > 0 ? msgs : [welcomeMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      scrollChatBottom();
    }
  };

  const startNewChat = async () => {
    if (isLoading) return;
    const newSession = await createChatSession("New Chat");
    if (newSession) {
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([welcomeMessage]);
      setInput("");
      setAttachedFile(null);
    }
  };

  const scrollChatBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 60);
  };

  /* =========================================================
     2. LIVE SEARCH SESSIONS
  ========================================================= */
  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    return sessions.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [sessions, search]);

  /* =========================================================
     3. ATTACHMENT HANDLER (PHOTOS & DOCUMENTS)
  ========================================================= */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAttachedFile({
        file,
        base64,
        mimeType: file.type,
        previewUrl: file.type.startsWith("image/") ? base64 : undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  /* =========================================================
     4. SEND MESSAGE WITH MULTIMODAL & WORKSPACE CONTEXT
  ========================================================= */
  const sendMessage = async (promptOverride?: string) => {
    const textToSend = (promptOverride ?? input).trim();
    if ((!textToSend && !attachedFile) || isLoading || !activeSessionId) return;

    const currentSessionId = activeSessionId;
    const currentAttachment = attachedFile;

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: textToSend || `Uploaded file: ${currentAttachment?.file.name}`,
      attachment_name: currentAttachment?.file.name,
      attachment_url: currentAttachment?.previewUrl,
    };

    const newConversation = [...messages, userMsg];
    setMessages(newConversation);
    setInput("");
    setAttachedFile(null);
    setIsLoading(true);
    setError("");
    scrollChatBottom();

    try {
      // 1. Save user message to database
      await saveSessionChatMessage(
        currentSessionId,
        "user",
        userMsg.content,
        userMsg.attachment_name,
        userMsg.attachment_url
      );

      // 2. Fetch live workspace documents to include in prompt context
      const docs = await fetchUserDocuments();

      // 3. API request to Gemini 2.5 Flash
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newConversation.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          workspace: {
            tasks: getTasks(),
            events: getEvents(),
            decisions: getDecisions(),
            documents: docs || [],
          },
          attachment: currentAttachment
            ? {
                base64: currentAttachment.base64,
                mimeType: currentAttachment.mimeType,
                name: currentAttachment.file.name,
              }
            : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "AI Response Failed");

      const replyText = String(data.text).trim();

      // 4. Save Assistant response to database
      const assistantMsg = await saveSessionChatMessage(
        currentSessionId,
        "assistant",
        replyText
      );

      setMessages([
        ...newConversation,
        assistantMsg || {
          id: `temp-${Date.now()}-ai`,
          role: "assistant",
          content: replyText,
        },
      ]);

      // Auto-name "New Chat" after first user prompt
      const currentSession = sessions.find((s) => s.id === currentSessionId);
      if (currentSession && currentSession.title === "New Chat") {
        const smartTitle =
          textToSend.length > 24
            ? `${textToSend.slice(0, 24)}...`
            : textToSend || "File Inquiry";
        await renameChatSession(currentSessionId, smartTitle);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId ? { ...s, title: smartTitle } : s
          )
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reach AI Assistant");
    } finally {
      setIsLoading(false);
      scrollChatBottom();
    }
  };

  /* =========================================================
     5. RENAME & DELETE ACTIONS
  ========================================================= */
  const handleSaveRename = async (sessionId: string) => {
    if (!editTitleText.trim()) {
      setEditingSessionId(null);
      return;
    }
    await renameChatSession(sessionId, editTitleText.trim());
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, title: editTitleText.trim() } : s
      )
    );
    setEditingSessionId(null);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await deleteChatSession(sessionId);
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      if (updated.length > 0) selectSession(updated[0].id);
      else startNewChat();
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      {/* ================= SIDEBAR: CHATGPT STYLE HISTORY ================= */}
      <GlassCard
        className="relative flex flex-col p-4 border-neutral-800/80 bg-[#0d0e14]/90"
        style={{ height: "640px" }}
      >
        {/* New Chat Button */}
        <button
          onClick={startNewChat}
          disabled={isLoading}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 px-4 text-xs font-bold text-black shadow-lg shadow-cyan-500/10 hover:opacity-95 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>

        {/* Live Search Input */}
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chat history..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950/70 py-2 pl-8 pr-7 text-xs text-white outline-none focus:border-cyan-500/40"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Chat History Header */}
        <div className="mb-2 flex items-center gap-2 px-1">
          <MessageSquare size={13} className="text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Conversations
          </span>
        </div>

        {/* Chat Sessions List */}
        <div className="space-y-1 pr-1 overflow-y-auto flex-1">
          {filteredSessions.length === 0 ? (
            <div className="rounded-xl border border-neutral-800/50 p-4 text-center text-xs text-neutral-500">
              No conversations found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition cursor-pointer border ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                      : "border-transparent text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
                  }`}
                >
                  {isEditing ? (
                    <div
                      className="flex items-center gap-1 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        autoFocus
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename(session.id);
                          if (e.key === "Escape") setEditingSessionId(null);
                        }}
                        className="w-full bg-black/60 border border-cyan-500/40 px-2 py-0.5 rounded text-xs text-white outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(session.id)}
                        className="text-cyan-400 hover:text-white"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 truncate pr-14">
                        <MessageSquare
                          size={13}
                          className={isActive ? "text-cyan-400" : "text-neutral-500"}
                        />
                        <span className="truncate font-medium">{session.title}</span>
                      </div>

                      {/* Action buttons on hover */}
                      <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(session.id);
                            setEditTitleText(session.title);
                          }}
                          className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                          title="Rename"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="p-1 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={12} />
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

      {/* ================= MAIN CHAT INTERFACE ================= */}
      <GlassCard
        className="relative flex flex-col p-5 border-neutral-800/80 bg-[#0c0e14]/90"
        style={{ height: "640px" }}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Reality Assistant</h2>
              <p className="text-[10px] text-neutral-400">
                Multimodal Document & Vision Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono">
            <Brain size={12} className="text-cyan-400" />
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 space-y-4 pr-2 overflow-y-auto"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-neutral-900/90 border border-neutral-800 text-neutral-200"
                    : "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-white"
                }`}
              >
                {/* Render Attachment Badge / Preview */}
                {message.attachment_name && (
                  <div className="mb-2 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                    {message.attachment_url?.startsWith("data:image") ? (
                      <img
                        src={message.attachment_url}
                        alt="attachment"
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                      />
                    ) : (
                      <FileText size={16} className="text-cyan-400" />
                    )}
                    <span className="text-[11px] font-mono text-neutral-300 truncate">
                      {message.attachment_name}
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 w-fit">
              <Loader2 size={14} className="animate-spin text-cyan-400" />
              <span>Analyzing workspace & generating answer...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Upload File Preview Chip */}
        {attachedFile && (
          <div className="my-2 p-2 bg-neutral-900 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs text-neutral-300">
            <div className="flex items-center gap-2 truncate">
              {attachedFile.previewUrl ? (
                <img
                  src={attachedFile.previewUrl}
                  alt="preview"
                  className="w-7 h-7 object-cover rounded"
                />
              ) : (
                <FileText size={16} className="text-cyan-400" />
              )}
              <span className="truncate">{attachedFile.file.name}</span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Bar with Attachment & Send */}
        <div className="pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              title="Attach Image or Document"
            >
              <Paperclip size={16} />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              rows={1}
              placeholder="Ask anything, query your documents, or attach an image..."
              className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950/80 py-3.5 pl-11 pr-12 text-xs text-white outline-none focus:border-cyan-500/50"
            />

            <button
              onClick={() => void sendMessage()}
              disabled={isLoading || (!input.trim() && !attachedFile)}
              className="absolute right-2.5 p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold disabled:opacity-40 transition cursor-pointer"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};