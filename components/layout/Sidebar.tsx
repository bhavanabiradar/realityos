"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  Brain, 
  FileText, 
  Calendar, 
  Target, 
  AlertCircle, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: MessageSquare, label: "AI Chat", id: "chat" },
  { icon: Brain, label: "Memory", id: "memory" },
  { icon: FileText, label: "Documents", id: "docs" },
  { icon: Calendar, label: "Planner", id: "planner" },
  { icon: Target, label: "Decisions", id: "decisions" },
  { icon: AlertCircle, label: "Emergency", id: "emergency" },
];

export const Sidebar = ({ activeTab = "home" }: { activeTab?: string }) => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-zinc-950/50 backdrop-blur-2xl border-r border-white/5 p-4 z-20 flex flex-col gap-8">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="font-bold text-xs text-white">R</span>
        </div>
        <span className="font-semibold tracking-tight text-lg text-white">RealityOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1 h-4 bg-blue-500 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Footer Settings */}
      <div className="pt-4 border-t border-white/5">
        <motion.div
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </motion.div>
      </div>
    </aside>
  );
};