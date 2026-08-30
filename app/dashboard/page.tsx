"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  CheckSquare, 
  Bot, 
  BrainCircuit, 
  FileText, 
  Calendar, 
  Scale, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("there");
  const [greeting, setGreeting] = useState<string>("Hello");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // 1. Calculate dynamic greeting based on system time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 22) setGreeting("Good evening");
    else setGreeting("Good night");

    setCurrentTime(new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));

    // 2. Fetch authenticated user profile name
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const extracted = user.email.split("@")[0];
        setUserName(extracted.charAt(0).toUpperCase() + extracted.slice(1));
      }
    }
    loadUser();
  }, []);

  const features = [
    {
      title: "To-Do List & Habits",
      description: "Manage daily tasks with priority tagging and build unbreakable 7-day consistency loops.",
      href: "/tasks",
      icon: CheckSquare,
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50",
      tag: "Productivity",
    },
    {
      title: "Reality AI Assistant",
      description: "Your integrated copilot to brainstorm concepts, summarize notes, and schedule routines.",
      href: "/ai-chat",
      icon: Bot,
      color: "from-blue-500/20 to-indigo-500/10",
      accent: "text-blue-400 border-blue-500/30 hover:border-blue-500/50",
      tag: "Intelligence",
    },
    {
      title: "Memory Vault",
      description: "Capture voice snapshots, breakthrough ideas, and key meeting takeaways securely.",
      href: "/memory",
      icon: BrainCircuit,
      color: "from-purple-500/20 to-pink-500/10",
      accent: "text-purple-400 border-purple-500/30 hover:border-purple-500/50",
      tag: "Recall",
    },
    {
      title: "Smart Documents",
      description: "Upload, store, and organize research papers, project synopsis, and reference PDFs.",
      href: "/documents",
      icon: FileText,
      color: "from-amber-500/20 to-orange-500/10",
      accent: "text-amber-400 border-amber-500/30 hover:border-amber-500/50",
      tag: "Storage",
    },
    {
      title: "Predictive Planner",
      description: "Intelligent time-blocking engine designed to optimize study, work, and recovery intervals.",
      href: "/planner",
      icon: Calendar,
      color: "from-cyan-500/20 to-blue-500/10",
      accent: "text-cyan-400 border-cyan-500/30 hover:border-cyan-500/50",
      tag: "Schedule",
    },
    {
      title: "Decision Engine",
      description: "Log complex trade-offs, weigh outcomes, and review decision accuracy over time.",
      href: "/decisions",
      icon: Scale,
      color: "from-rose-500/20 to-red-500/10",
      accent: "text-rose-400 border-rose-500/30 hover:border-rose-500/50",
      tag: "Strategy",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-16">
        
        {/* Aesthetic Hero Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#12141c] via-[#0d0e14] to-[#090a0e] border border-neutral-800/80 p-8 md:p-12 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to RealityOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">{userName}</span>
            </h1>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Your intelligent digital workspace is synced and ready. Use the sidebar to enter specific modules, or select any feature below to get started.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {currentTime}
              </span>
              <span className="flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Isolated & Encrypted Session
              </span>
            </div>
          </div>
        </div>

        {/* Feature Showcase & Navigation Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-300">
                Explore Workspace Modules
              </h2>
              <p className="text-xs text-neutral-500">
                Click any tool below to launch its dedicated workspace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative rounded-2xl bg-[#0e1017]/80 hover:bg-[#13151f] border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${item.accent}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-white/5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">
                        {item.tag}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 group-hover:text-white pt-6 transition">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Emergency Quick Banner */}
        <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Emergency Protocol Hub</h4>
              <p className="text-[11px] text-neutral-400">Instantly trigger SOS alerts, emergency contact cascades, and priority lockouts.</p>
            </div>
          </div>
          <Link
            href="/emergency"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition whitespace-nowrap"
          >
            Access Emergency
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}