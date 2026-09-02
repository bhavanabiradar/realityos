"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare,
  Bot, 
  BrainCircuit, 
  FileText, 
  Calendar, 
  Scale, 
  ShieldAlert, 
  Settings, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "To-Do List", href: "/tasks", icon: CheckSquare },
  { label: "AI Chat", href: "/ai-chat", icon: Bot },
  { label: "Memory", href: "/memory", icon: BrainCircuit },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Planner", href: "/planner", icon: Calendar },
  { label: "Decisions", href: "/decisions", icon: Scale },
  { label: "Emergency", href: "/emergency", icon: ShieldAlert },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
   <div className="h-screen overflow-hidden bg-[#07080a] text-white flex flex-col md:flex-row antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#0c0d12]/90 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-sm text-black shadow-md shadow-cyan-500/20">
            R
          </div>
          <span className="font-black text-sm tracking-tight text-white">RealityOS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0b0e] border-r border-neutral-800/70 flex flex-col justify-between p-4 transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          mobileMenuOpen ? "translate-x-0 top-[57px] h-[calc(100vh-57px)]" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Desktop Brand Logo */}
          <div className="hidden md:flex items-center gap-3 px-2 pt-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-600 flex items-center justify-center font-black text-sm text-black shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              R
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight text-white">RealityOS</h1>
              <p className="text-[10px] text-cyan-400/90 font-mono tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Workspace
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-1">
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              pathname === "/settings"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 p-5 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
  {children}
</main>
    </div>
  );
}

export default DashboardLayout;