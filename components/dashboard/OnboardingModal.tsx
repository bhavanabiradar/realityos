"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  CheckSquare, 
  Bot, 
  BrainCircuit, 
  Calendar, 
  ArrowRight,
  ShieldCheck
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
      description: "Log breakthroughs, audio thoughts, and meeting summaries securely.",
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
      {/* Trigger Button in Dashboard Hero */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Quick Feature Guide</span>
      </button>

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[85vh] bg-[#0e1017] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#12141d] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black text-xs shadow-md shadow-cyan-500/20">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Welcome to RealityOS</h3>
                  <p className="text-[10px] text-neutral-400 mt-1">Quick workspace tour</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable on small screens) */}
            <div className="p-4 sm:p-5 space-y-3 overflow-y-auto bg-[#0a0b0e]">
              <p className="text-xs text-neutral-400 font-medium">
                Everything is divided into focused modules:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="p-3 rounded-2xl bg-[#11131a] border border-neutral-800 space-y-1.5"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${step.color}`}>
                        <Icon className="w-3.5 h-3.5" />
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

            {/* Modal Footer */}
            <div className="p-4 bg-[#0e1017] flex items-center justify-between gap-3 border-t border-neutral-800 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Encrypted session</span>
              </div>

              <button
                onClick={handleClose}
                className="px-5 py-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
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