"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import {
  Target,
  GitCommit,
  CheckCircle,
  Plus,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchUserDecisions,
  createDatabaseDecision,
  deleteDatabaseDecision,
} from "@/lib/supabaseStore";
import {
  getDecisions,
  addDecision,
  type RealityDecision,
} from "@/lib/realityStore";

export const DecisionCard = () => {
  const [decisions, setDecisions] = useState<RealityDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("Committed");

  useEffect(() => {
    async function loadDecisions() {
      setLoading(true);
      try {
        const dbDecisions = await fetchUserDecisions();
        if (dbDecisions && dbDecisions.length > 0) {
          const mappedDecisions: RealityDecision[] = dbDecisions.map((d: any) => ({
  id: d.id,
  title: d.title,
  category: d.category || "General",
  status: d.status || "Committed",
  createdAt: d.created_at || new Date().toISOString(),
}));
          setDecisions(mappedDecisions);
        } else {
          setDecisions(getDecisions());
        }
      } catch (err) {
        console.error("Failed to load decisions:", err);
        setDecisions(getDecisions());
      } finally {
        setLoading(false);
      }
    }

    loadDecisions();
  }, []);

  const handleAddDecision = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const dbDecision = await createDatabaseDecision(
        trimmedTitle,
        category,
        status
      );
const newDecision: RealityDecision = {
  id: dbDecision?.id || `decision-${Date.now()}`,
  title: trimmedTitle,
  category,
  status: status as any,
  createdAt: new Date().toISOString(),
};

      // Keep local realityStore up to date for AI chat awareness
      addDecision(newDecision.title, newDecision.category, newDecision.status);

      setDecisions((current) => [newDecision, ...current]);
      setTitle("");
      setCategory("General");
      setStatus("Committed");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save decision:", err);
      alert("Failed to save decision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDecision = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDecisions((current) => current.filter((d) => d.id !== id));
    try {
      await deleteDatabaseDecision(id);
    } catch (err) {
      console.error("Failed to delete decision:", err);
    }
  };

  const getColor = (decisionStatus: string) => {
    if (decisionStatus === "Finalized") {
      return "bg-blue-500";
    }
    if (decisionStatus === "Committed") {
      return "bg-zinc-600";
    }
    return "bg-purple-500";
  };

  return (
    <>
      <GlassCard className="p-6" delay={0.7}>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-blue-400" />
            <h3 className="text-zinc-400 font-medium text-sm">Recent Decisions</h3>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            aria-label="Log new decision"
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            <GitCommit size={14} />
          </button>
        </div>

        {/* DECISIONS */}
        <div className="relative space-y-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />

          {loading ? (
            <div className="pl-7 py-6 flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Loading saved decisions...</span>
            </div>
          ) : decisions.length === 0 ? (
            <div className="pl-7 py-4 text-sm text-zinc-600">
              No decisions logged yet.
            </div>
          ) : (
            decisions.map((decision, index) => (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative pl-7 group flex items-start justify-between gap-3"
              >
                {/* TIMELINE DOT */}
                <div
                  className={cn(
                    "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black z-10 transition-transform group-hover:scale-125",
                    getColor(decision.status)
                  )}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 font-medium leading-tight group-hover:text-white transition-colors truncate">
                    {decision.title}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {decision.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <CheckCircle size={10} className="text-emerald-500/70" />
                      <span className="text-[10px] text-zinc-500">
                        {decision.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteDecision(decision.id, e)}
                  aria-label={`Delete ${decision.title}`}
                  className="opacity-0 group-hover:opacity-100 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/5 text-zinc-600 transition hover:border-red-500/20 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* LOG NEW DECISION */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full mt-6 text-center text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] transition-colors cursor-pointer"
        >
          + Log New Decision
        </button>
      </GlassCard>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Log New Decision</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Record an important decision in RealityOS.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* DECISION TITLE */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">Decision</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAddDecision();
                }}
                placeholder="e.g. Switch project stack to Next.js"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50"
                autoFocus
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Tech Architecture">Tech Architecture</option>
                <option value="Education">Education</option>
                <option value="Career">Career</option>
                <option value="Finance">Finance</option>
                <option value="Logistics">Logistics</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="mb-6">
              <label className="block text-xs text-zinc-400 mb-2">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 cursor-pointer"
              >
                <option value="Committed">Committed</option>
                <option value="Finalized">Finalized</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddDecision}
                disabled={!title.trim() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Save Decision</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};