"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, ArrowRight, Brain, Zap } from 'lucide-react';

export const AIChatCard = () => {
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
            GPT-4o
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-zinc-300 leading-relaxed"
        >
          "I've analyzed your schedule for today. You have a 2-hour deep work block available before your 2:30 PM meeting. Would you like me to prepare the research notes for Project Reality?"
        </motion.div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["Prepare notes", "Reschedule sync", "Summarize email"].map((suggestion, i) => (
            <button 
              key={i}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-800/50 border border-white/5 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <input 
          type="text"
          placeholder="Ask anything..."
          className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 ring-blue-500/50 transition-all placeholder:text-zinc-600"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black hover:bg-zinc-200 transition-colors shadow-lg">
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 uppercase tracking-tighter">
          <Zap size={10} />
          Latencey: 240ms
        </div>
      </div>
    </GlassCard>
  );
};