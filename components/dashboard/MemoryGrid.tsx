"use client";

import React, { useState, useEffect } from "react";
import { Mic, Eye, Users, FileText, Plus, Loader2, Sparkles, Trash2 } from "lucide-react";
import { fetchUserMemories, createDatabaseMemory, deleteDatabaseMemory } from "@/lib/supabaseStore";

interface MemoryItem {
  id: string;
  title: string;
  type: "audio" | "visual" | "meeting" | "text" | string;
  summary?: string;
  size?: string;
  date: string;
}

export default function MemoryGrid() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"audio" | "visual" | "meeting" | "text">("text");
  const [newSummary, setNewSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load memories from Supabase
  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await fetchUserMemories();
      setMemories(data || []);
    } catch (err) {
      console.error("Failed to load memories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    if (!cleanTitle || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await createDatabaseMemory(
        cleanTitle,
        newType,
        newSummary.trim() || "Snapshot captured"
      );

      if (created) {
        setMemories((prev) => [created, ...prev]);
        setNewTitle("");
        setNewSummary("");
        setShowAddModal(false);
      }
    } catch (error: any) {
      console.error("Error creating memory:", error);
      alert(error?.message || "Failed to save memory. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMemory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDatabaseMemory(id);
    } catch (err) {
      console.error("Error deleting memory:", err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-3.5 h-3.5 text-cyan-400" />;
      case "visual":
        return <Eye className="w-3.5 h-3.5 text-emerald-400" />;
      case "meeting":
        return <Users className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "audio":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-300";
      case "visual":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
      case "meeting":
        return "bg-rose-500/10 border-rose-500/30 text-rose-300";
      default:
        return "bg-purple-500/10 border-purple-500/30 text-purple-300";
    }
  };

  return (
    <div className="bg-[#111318]/90 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[340px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Recent Memories
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Add Memory
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mb-2" />
            <span className="text-xs">Loading memories...</span>
          </div>
        ) : memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="group relative p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-2 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border ${getTypeColor(
                      mem.type
                    )}`}
                  >
                    {getTypeIcon(mem.type)}
                    <span className="capitalize">{mem.type}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500">{mem.date}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMemory(mem.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-white truncate">
                  {mem.title}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2">
                  {mem.summary || "No details provided."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center text-neutral-500">
            <Sparkles className="w-6 h-6 mb-2 opacity-30 text-purple-400" />
            <p className="text-xs">No memories saved yet.</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">
              Capture a memory or idea to sync with your database.
            </p>
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111318] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Log New Memory</h3>
            <form onSubmit={handleAddMemory} className="space-y-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Hackathon Idea Brainstorm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500/60 cursor-pointer"
                >
                  <option value="text">Text / Idea</option>
                  <option value="audio">Audio Snapshot</option>
                  <option value="visual">Visual Capture</option>
                  <option value="meeting">Meeting Note</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Summary (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Quick summary or takeaways..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}