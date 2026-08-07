"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { FileText, FileSpreadsheet, FileCode, MoreHorizontal, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const documents = [
  {
    id: 1,
    name: "Project_Reality_V1.pdf",
    type: "pdf",
    size: "2.4 MB",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    id: 2,
    name: "Financials_Q2.xlsx",
    type: "spreadsheet",
    size: "1.1 MB",
    icon: FileSpreadsheet,
    color: "text-emerald-400",
  },
  {
    id: 3,
    name: "Core_Engine.rs",
    type: "code",
    size: "45 KB",
    icon: FileCode,
    color: "text-purple-400",
  },
];

export const DocsCard = () => {
  return (
    <GlassCard className="p-6" delay={0.8}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-zinc-400" />
          <h3 className="text-zinc-400 font-medium text-sm">Recent Documents</h3>
        </div>
        <button className="text-zinc-600 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-white/5",
              doc.color.replace('text-', 'bg-').concat('/10')
            )}>
              <doc.icon size={20} className={doc.color} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white">
                {doc.name}
              </p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                {doc.type} • {doc.size}
              </p>
            </div>

            <ChevronRight 
              size={14} 
              className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" 
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-all uppercase tracking-widest"
      >
        Open Drive
      </motion.button>
    </GlassCard>
  );
};