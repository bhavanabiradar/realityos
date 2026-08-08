"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  MessageSquare,
  Brain,
  FileText,
  Calendar,
  Target,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppearance } from '@/components/providers/AppearanceProvider';

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
  const pathname = usePathname();
  const { settings } = useAppearance();
  const isSettingsActive = pathname?.startsWith('/settings');

  return (
    <aside
      className="w-64 h-screen sticky top-0 backdrop-blur-2xl border-r p-4 z-20 flex flex-col gap-8"
      style={{
        background: "var(--sidebar)",
        borderColor: "var(--border)",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-center gap-3 px-2 py-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            boxShadow: `0 12px 24px ${settings.reducedMotion ? 'transparent' : 'var(--glow)'}`,
          }}
        >
          <span className="font-bold text-xs text-white">R</span>
        </div>
        <span className="font-semibold tracking-tight text-lg" style={{ color: "var(--foreground)" }}>RealityOS</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200',
              )}
              style={{
                color: isActive ? 'var(--foreground)' : 'var(--muted)',
                background: isActive ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? 'var(--primary)' : 'currentColor' }} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1 h-4 rounded-full"
                  style={{ background: 'var(--primary)' }}
                />
              )}
            </motion.div>
          );
        })}
      </nav>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/settings"
          prefetch
          aria-label="Open Settings"
          aria-current={isSettingsActive ? 'page' : undefined}
          className="flex w-full items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200"
          style={{
            color: isSettingsActive ? 'var(--foreground)' : 'var(--muted)',
            background: isSettingsActive ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
            boxShadow: isSettingsActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <Settings size={20} style={{ color: isSettingsActive ? 'var(--primary)' : 'currentColor' }} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
};