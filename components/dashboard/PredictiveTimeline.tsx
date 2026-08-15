"use client";

import React, { useState } from "react";
import { 
  Clock, 
  Sparkles, 
  Zap, 
  ArrowUpRight
} from "lucide-react";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  category: "Focus" | "Meeting" | "Personal" | "Study";
  status: "completed" | "current" | "predicted" | "upcoming";
  confidence?: number;
  note?: string;
  badgeStyle: string;
  dotColor: string;
}

const initialTimeline: TimelineEvent[] = [
  {
    id: "1",
    time: "09:30 AM",
    title: "Morning Routine & Goal Setting",
    category: "Personal",
    status: "completed",
    note: "10,000 steps tracking initiated",
    badgeStyle: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    dotColor: "bg-emerald-400",
  },
  {
    id: "2",
    time: "11:00 AM",
    title: "Hardware Architecture & ECE Sync",
    category: "Study",
    status: "completed",
    note: "Reviewed circuit & sensor modules",
    badgeStyle: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    dotColor: "bg-emerald-400",
  },
  {
    id: "3",
    time: "02:30 PM",
    title: "Vision Pro Spatial Demo",
    category: "Meeting",
    status: "current",
    note: "Live prototype walkthrough",
    badgeStyle: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    dotColor: "bg-purple-400 ring-4 ring-purple-400/20 animate-pulse",
  },
  {
    id: "4",
    time: "04:30 PM",
    title: "AI Predicted: Energy Dip Recharge",
    category: "Personal",
    status: "predicted",
    confidence: 94,
    note: "RealityOS recommends a 20-min break or walk",
    badgeStyle: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    dotColor: "bg-amber-400",
  },
  {
    id: "5",
    time: "07:00 PM",
    title: "Applied Calculus & Revision Sprint",
    category: "Study",
    status: "upcoming",
    note: "High focus block scheduled",
    badgeStyle: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    dotColor: "bg-slate-500",
  },
];

export function PredictiveTimeline() {
  const [events] = useState<TimelineEvent[]>(initialTimeline);
  const [activeTab, setActiveTab] = useState<"all" | "predicted">("all");

  const filteredEvents = activeTab === "predicted" 
    ? events.filter(e => e.status === "predicted") 
    : events;

  return (
<div className="flex flex-col justify-between h-full p-5 bg-[#0b0e14] border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden group">      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Predictive Timeline</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Synced
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Optimized schedule & smart flow predictions</p>
          </div>
        </div>

        {/* Filter Pill Tabs */}<div className="flex items-center gap-1.5 p-1 bg-[#111827] border border-slate-800 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-lg transition text-xs font-medium cursor-pointer ${
              activeTab === "all" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("predicted")}
            className={`px-3 py-1 rounded-lg transition text-xs font-medium flex items-center gap-1 cursor-pointer ${
              activeTab === "predicted" ? "bg-purple-600/30 text-purple-200 border border-purple-500/30 shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            AI Predictions
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-2.5 my-auto max-h-[300px] overflow-y-auto pr-1">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`group relative flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all duration-200 ${
             evt.status === "current"
  ? "bg-[#21153d] border-purple-500/40"
  : evt.status === "predicted"
  ? "bg-[#29200f] border-amber-500/30 border-dashed"
  : "bg-[#111827] border-slate-800/70 hover:border-slate-700 hover:bg-[#172033]"
            }`}
             >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${evt.dotColor}`} />

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {evt.title}
                  </h4>
                  {evt.confidence && (
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                      {evt.confidence}% match
                    </span>
                  )}
                </div>
                {evt.note && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{evt.note}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${evt.badgeStyle}`}>
                {evt.category}
              </span>
              <span className="font-mono text-xs text-slate-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                {evt.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>Next optimal focus window: <strong>07:00 PM – 09:00 PM</strong></span>
        </div>

        <button 
          type="button"
          onClick={() => alert("Schedule optimized by RealityOS AI!")}
          className="text-purple-400 hover:text-purple-300 font-medium text-[11px] flex items-center gap-1 transition cursor-pointer"
        >
          Auto-Optimize
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default PredictiveTimeline;