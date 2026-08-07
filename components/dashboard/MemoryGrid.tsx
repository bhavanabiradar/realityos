"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Brain, Maximize2, Clock } from 'lucide-react';

const memories = [
  { id: 1, title: "Design Workshop", date: "Jul 28", color: "from-blue-600/40 to-indigo-600/40" },
  { id: 2, title: "Nature Walk", date: "Jul 26", color: "from-emerald-600/40 to-teal-600/40" },
  { id: 3, title: "Evening Reads", date: "Jul 25", color: "from-orange-600/40 to-rose-600/40" },
];

export const MemoryGrid = () => {
  return (
    <GlassCard className="p-6" delay={0.6}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-pink-400" />
          <h3 className="text-zinc-400 font-medium text-sm">Recent Memories</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          <Clock size={12} />
          <span>Syncing</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
          >
            {/* Visual Placeholder for Image */}
            <div className={`absolute inset-0 bg-gradient-to-br ${memory.color} transition-transform duration-500 group-hover:scale-110`} />
            
            {/* Glass Overlay on Hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 size={16} className="text-white/80" />
            </div>

            {/* Date Label */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <span className="text-[8px] font-bold text-white/70 uppercase tracking-tighter">
                {memory.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-500 font-medium">Memory Storage</span>
          <span className="text-zinc-300 font-bold">12.4 GB / 50 GB</span>
        </div>
        <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-[25%] bg-pink-500/50 rounded-full" />
        </div>
      </div>
    </GlassCard>
  );
};