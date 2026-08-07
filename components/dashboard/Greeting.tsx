"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

export const Greeting = () => {
  return (
    <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
          Good afternoon, Bhavana
        </h1>
        <p className="text-zinc-500 mt-2 font-medium">
          Your Reality is in sync. You have 4 priorities remaining today.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" 
            size={18} 
          />
          <input 
            type="text"
            placeholder="Ask Reality anything..."
            className="bg-zinc-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 transition-all w-full md:w-80 backdrop-blur-md placeholder:text-zinc-600"
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black p-3.5 rounded-2xl shadow-xl shadow-white/10 hover:bg-zinc-200 transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </motion.div>
    </header>
  );
};