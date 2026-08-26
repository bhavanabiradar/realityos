"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquare,
  Brain,
  FileText,
  Calendar,
  Target,
  AlertCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppearance } from "@/components/providers/AppearanceProvider";
import SignOutButton from "@/components/SignOutButton";

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

  const isSettingsActive = pathname === "/settings" || activeTab === "settings";

  return (
    <aside className="w-64 h-screen bg-[#0B0C10] border-r border-neutral-800/80 flex flex-col justify-between p-4 select-none shrink-0">
      <div className="space-y-6">
        {/* App Logo */}
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-cyan-500/20">
            R
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">RealityOS</h1>
            <p className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Workspace</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.href)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left",
                  isActive
                    ? "bg-neutral-800/70 text-white font-semibold shadow-inner border border-neutral-700/40"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                )}
              >
                <Icon size={16} className={isActive ? "text-cyan-400" : "text-neutral-400"} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Settings & Logout */}
      <div className="pt-4 border-t border-neutral-800/80 space-y-1">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/settings")}
          className={cn(
            "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left",
            isSettingsActive
              ? "bg-neutral-800/70 text-white font-semibold shadow-inner border border-neutral-700/40"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
          )}
        >
          <Settings size={16} className={isSettingsActive ? "text-cyan-400" : "text-neutral-400"} />
          <span>Settings</span>
        </motion.button>

        <SignOutButton />
      </div>
    </aside>
  );
};

export default Sidebar;