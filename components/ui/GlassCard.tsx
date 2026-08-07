"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  delay = 0,
  hoverable = true 
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl",
        className
      )}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};