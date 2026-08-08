"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Activity } from 'lucide-react';

export const LifeScore = () => {
  const score = 88;

  return (
    <GlassCard className="p-6 border-t-2" delay={0.2} style={{ borderTopColor: 'var(--primary)' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Life Score</h3>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>+2.4% this week</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl font-bold tracking-tighter"
          style={{ color: 'var(--foreground)' }}
        >
          {score}
        </motion.span>
        <span className="mb-2 font-medium" style={{ color: 'var(--muted)' }}>/100</span>
      </div>

      <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.12)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'circOut' }}
          className="absolute h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            boxShadow: '0 0 20px var(--glow)',
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Focus</p>
          <p className="text-sm font-semibold uppercase" style={{ color: 'var(--foreground)' }}>High</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Rest</p>
          <p className="text-sm font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Optimal</p>
        </div>
      </div>
    </GlassCard>
  );
};