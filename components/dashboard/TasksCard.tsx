"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CheckCircle2, ArrowUpRight, ListTodo } from 'lucide-react';

const tasks = [
  { id: 1, title: "Design System Sync", priority: "High" },
  { id: 2, title: "Review Q3 Roadmap", priority: "Medium" },
  { id: 3, title: "Doctor Appointment", priority: "High" },
  { id: 4, title: "Update RealityOS Docs", priority: "Low" },
];

export const TasksCard = () => {
  return (
    <GlassCard className="p-6" delay={0.3}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ListTodo size={18} className="text-blue-400" />
          <h3 className="text-zinc-400 font-medium text-sm">Tasks Today</h3>
        </div>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="space-y-1">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-md border border-zinc-700 group-hover:border-blue-500/50 transition-colors" />
              <CheckCircle2 
                size={12} 
                className="absolute opacity-0 group-hover:opacity-40 text-blue-400 transition-opacity" 
              />
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                {task.title}
              </p>
            </div>

            <div className={`text-[10px] px-2 py-0.5 rounded-full border ${
              task.priority === 'High' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}>
              {task.priority}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
      >
        View All Tasks
      </motion.button>
    </GlassCard>
  );
};
