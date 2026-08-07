"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Activity } from 'lucide-react';

export const LifeScore = () => {
  const score = 88;

  return (
    <GlassCard className="p-6 border-t-2 border-t-emerald-500/40" delay={0.2}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-zinc-400 font-medium text-xs uppercase tracking-wider">Life Score</h3>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold">+2.4% this week</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl font-bold tracking-tighter"
        >
          {score}
        </motion.span>
        <span className="text-zinc-500 mb-2 font-medium">/100</span>
      </div>

      {/* Animated Gauge Bar */}
      <div className="relative h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
          className="absolute h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Focus</p>
          <p className="text-sm font-semibold text-zinc-200 uppercase">High</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Rest</p>
          <p className="text-sm font-semibold text-zinc-200 uppercase">Optimal</p>
        </div>
      </div>
    </GlassCard>
  );
};