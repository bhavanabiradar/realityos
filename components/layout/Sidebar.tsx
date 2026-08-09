"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  { icon: Home, label: "Home", id: "home", href: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", id: "chat", href: "/ai-chat" },
  { icon: Brain, label: "Memory", id: "memory", href: "/memory" },
  { icon: FileText, label: "Documents", id: "docs", href: "/documents" },
  { icon: Calendar, label: "Planner", id: "planner", href: "/planner" },
  { icon: Target, label: "Decisions", id: "decisions", href: "/decisions" },
  { icon: AlertCircle, label: "Emergency", id: "emergency", href: "/emergency" },
];

export const Sidebar = ({ activeTab }: { activeTab?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useAppearance();
  const currentPath = pathname ?? "/";

  const getIsActive = (itemId: string, href: string) => {
    if (itemId === 'home') {
      return currentPath === '/' || currentPath === '/dashboard' || currentPath === href;
    }

    if (itemId === 'chat') {
      return currentPath === '/ai-chat';
    }

    if (itemId === 'memory') {
      return currentPath === '/memory';
    }

    if (itemId === 'docs') {
      return currentPath === '/documents';
    }

    if (itemId === 'planner') {
      return currentPath === '/planner';
    }

    if (itemId === 'decisions') {
      return currentPath === '/decisions';
    }

    if (itemId === 'emergency') {
      return currentPath === '/emergency';
    }

    return currentPath === href;
  };

  const isSettingsActive = currentPath.startsWith('/settings');

  return (
    <aside
      className="fixed left-0 top-0 z-[60] w-64 backdrop-blur-2xl border-r p-4 flex flex-col gap-8 pointer-events-auto overflow-visible"
      style={{
        height: '100vh',
        minHeight: '100vh',
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
          const isActive = activeTab ? activeTab === item.id : getIsActive(item.id, item.href);
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => router.push(item.href)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative z-[65] flex w-full items-center gap-3 px-4 py-3 cursor-pointer pointer-events-auto rounded-xl text-left transition-all duration-200 border-0 bg-transparent',
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
            </motion.button>
          );
        })}
      </nav>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <motion.button
          type="button"
          onClick={() => router.push('/settings')}
          aria-label="Open Settings"
          aria-current={isSettingsActive ? 'page' : undefined}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-[65] flex w-full items-center gap-3 px-4 py-3 cursor-pointer rounded-xl text-left transition-all duration-200 border-0 bg-transparent pointer-events-auto"
          style={{
            color: isSettingsActive ? 'var(--foreground)' : 'var(--muted)',
            background: isSettingsActive ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
            boxShadow: isSettingsActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <Settings size={20} style={{ color: isSettingsActive ? 'var(--primary)' : 'currentColor' }} />
          <span className="font-medium text-sm">Settings</span>
        </motion.button>
      </div>
    </aside>
  );
};