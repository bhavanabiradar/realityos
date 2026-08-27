"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  BrainCircuit, 
  FileText, 
  Calendar, 
  Scale, 
  ShieldAlert, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
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
    <div className="min-h-screen bg-[#07080a] text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d0e12] border-b border-neutral-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-black">
            R
          </div>
          <span className="font-black text-sm tracking-tight">RealityOS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar (Desktop Sidebar + Mobile Dropdown Overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0c0d11] border-r border-neutral-800/80 flex flex-col justify-between p-4 transition-transform duration-200 md:translate-x-0 md:static md:h-screen ${
          mobileMenuOpen ? "translate-x-0 top-[57px] h-[calc(100vh-57px)]" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Desktop Brand Logo */}
          <div className="hidden md:flex items-center gap-3 px-2 pt-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-black shadow-lg shadow-cyan-500/20">
              R
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight">RealityOS</h1>
              <p className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">Workspace</p>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              pathname === "/settings"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;