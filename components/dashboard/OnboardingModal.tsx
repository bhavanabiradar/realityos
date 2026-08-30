"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  CheckSquare, 
  Bot, 
  BrainCircuit, 
  FileText, 
  Calendar, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("realityos_tour_seen");
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("realityos_tour_seen", "true");
    setIsOpen(false);
  };

  const steps = [
    {
      icon: CheckSquare,
      title: "To-Do List & Habit Tracker",
      description: "Set daily high-priority goals and build unbroken 7-day consistency loops.",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Bot,
      title: "Reality AI Copilot",
      description: "Brainstorm ideas, break down complex projects, and schedule routines.",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: BrainCircuit,
      title: "Memory Vault",
      description: "Log breakthroughs, audio thoughts, and meeting summaries with persistent cloud storage.",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Calendar,
      title: "Predictive Planner",
      description: "Time-block your workflow and optimize study, focus, and rest intervals.",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <>
      {/* Trigger Button in Hero */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Quick Feature Guide</span>
      </button>

      {/* Aesthetic Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0e1017] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800/80 bg-[#12141d]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-cyan-500/20">
                  R
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Welcome to RealityOS</h3>
                  <p className="text-xs text-neutral-400">Your all-in-one personal operating system</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Walkthrough Grid */}
            <div className="p-6 space-y-3 bg-[#0a0b0e]/95">
              <p className="text-xs text-neutral-400 mb-2 font-medium">
                Everything you need to organize your life is divided into dedicated modules:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="p-3.5 rounded-2xl bg-[#11131a] border border-neutral-800/80 space-y-2 hover:border-neutral-700 transition"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${step.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 bg-[#0e1017] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Isolated & secure user session</span>
              </div>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:opacity-95 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}