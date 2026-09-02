"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const GlassCard = ({
  children,
  className = "",
  delay = 0,
  hoverable = true,
  style,
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl',
        className,
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(15,23,42,0.12))',
        borderColor: 'var(--border)',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
        ...style,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent 60%)' }} />
<div className="relative z-10 flex flex-col h-full min-h-0">{children}</div>
    </motion.div>
  );
};