"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Target, GitCommit, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const decisions = [
  {
    id: 1,
    action: "Switched stack to Next.js 15",
    context: "Tech Architecture",
    status: "Finalized",
    color: "bg-blue-500",
  },
  {
    id: 2,
    action: "Postponed travel to Oct",
    context: "Logistics",
    status: "Committed",
    color: "bg-zinc-600",
  },
];

export const DecisionCard = () => {
  return (
    <GlassCard className="p-6" delay={0.7}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-400" />
          <h3 className="text-zinc-400 font-medium text-sm">Recent Decisions</h3>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white cursor-pointer transition-colors">
          <GitCommit size={14} />
        </div>
      </div>

      <div className="relative space-y-6">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />

        {items.map((decision, index) => (decision = decisions[index], 
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="relative pl-7 group"
          >
            {/* Timeline Dot */}
            <div className={cn(
              "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black z-10 transition-transform group-hover:scale-125",
              decision.color
            )} />

            <div>
              <p className="text-sm text-zinc-300 font-medium leading-tight group-hover:text-white transition-colors">
                {decision.action}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  {decision.context}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-emerald-500/70" />
                  <span className="text-[10px] text-zinc-500">{decision.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 text-center text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] transition-colors">
        Log New Decision
      </button>
    </GlassCard>
  );
};

// Re-using same local helper for safety
const items = [0, 1];