"use client";

import React, { useState, useEffect } from "react";
import { Play, X, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";

interface OnboardingModalProps {
  // Optional custom trigger button label
  triggerLabel?: string;
  // YouTube video ID or video embed URL (e.g. "dQw4w9WgXcQ")
  videoId?: string; 
}

export default function OnboardingModal({
  triggerLabel = "Watch 1-min Tour",
  videoId = "dQw4w9WgXcQ", // replace with your YouTube video ID or Vimeo ID
}: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open only once for first-time visitors
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

  return (
    <>
      {/* Manual Trigger Button (placed anywhere on your dashboard) */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
        <span>{triggerLabel}</span>
      </button>

      {/* Modal Backdrop & Video Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-[#12141d]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Welcome to RealityOS</h3>
                  <p className="text-[11px] text-neutral-400">Quick product tour and feature walkthrough</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video w-full bg-neutral-950">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="RealityOS Product Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Quick Feature Checklist Footer */}
            <div className="p-4 sm:p-5 bg-[#0e1017] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-800/80">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Priorities & Habits
                </span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> AI Copilot
                </span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Memory Vault
                </span>
              </div>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-black font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Get Started
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}