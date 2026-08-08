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
        <h1
          className="text-4xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, var(--foreground), var(--primary), var(--muted))',
          }}
        >
          Good afternoon, Bhavana
        </h1>
        <p className="mt-2 font-medium" style={{ color: 'var(--muted)' }}>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            size={18}
            style={{ color: 'var(--muted)' }}
          />
          <input
            type="text"
            placeholder="Ask Reality anything..."
            className="rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 transition-all w-full md:w-80 backdrop-blur-md"
            style={{
              background: 'rgba(15,23,42,0.18)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.02)',
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3.5 rounded-2xl transition-colors"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            boxShadow: '0 14px 24px rgba(96, 165, 250, 0.2)',
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </motion.div>
    </header>
  );
};