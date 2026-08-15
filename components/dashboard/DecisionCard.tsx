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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDecisions,
  addDecision,
  type RealityDecision,
} from "@/lib/realityStore";

export const DecisionCard = () => {
  const [decisions, setDecisions] = useState<RealityDecision[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("Committed");

  useEffect(() => {
    setDecisions(getDecisions());
  }, []);

  const handleAddDecision = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newDecision = addDecision(
      trimmedTitle,
      category,
      status
    );
if (!newDecision) return;

setDecisions((current) => [
  newDecision,
  ...current,
]);
    setTitle("");
    setCategory("General");
    setStatus("Committed");
    setShowForm(false);
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
            <Target
              size={18}
              className="text-blue-400"
            />

            <h3 className="text-zinc-400 font-medium text-sm">
              Recent Decisions
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            aria-label="Log new decision"
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors"
          >
            <GitCommit size={14} />
          </button>
        </div>

        {/* DECISIONS */}
        <div className="relative space-y-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />

          {decisions.length === 0 ? (
            <div className="pl-7 py-4 text-sm text-zinc-600">
              No decisions logged yet.
            </div>
          ) : (
            decisions.map((decision, index) => (
              <motion.div
                key={decision.id}
                initial={{
                  opacity: 0,
                  x: 10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.1 + index * 0.05,
                }}
                className="relative pl-7 group"
              >
                {/* TIMELINE DOT */}
                <div
                  className={cn(
                    "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black z-10 transition-transform group-hover:scale-125",
                    getColor(decision.status)
                  )}
                />

                <div>
                  <p className="text-sm text-zinc-300 font-medium leading-tight group-hover:text-white transition-colors">
                    {decision.title}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {decision.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <CheckCircle
                        size={10}
                        className="text-emerald-500/70"
                      />

                      <span className="text-[10px] text-zinc-500">
                        {decision.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* LOG NEW DECISION */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full mt-6 text-center text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] transition-colors"
        >
          + Log New Decision
        </button>
      </GlassCard>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Log New Decision
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Record an important decision in RealityOS.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* DECISION TITLE */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">
                Decision
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddDecision();
                  }
                }}
                placeholder="e.g. Switch project stack to Next.js"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50"
                autoFocus
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="General">General</option>
                <option value="Tech Architecture">
                  Tech Architecture
                </option>
                <option value="Education">
                  Education
                </option>
                <option value="Career">
                  Career
                </option>
                <option value="Finance">
                  Finance
                </option>
                <option value="Logistics">
                  Logistics
                </option>
                <option value="Personal">
                  Personal
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div className="mb-6">
              <label className="block text-xs text-zinc-400 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="Committed">
                  Committed
                </option>

                <option value="Finalized">
                  Finalized
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddDecision}
                disabled={!title.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
              >
                <Plus size={16} />
                Save Decision
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};