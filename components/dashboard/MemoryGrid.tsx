"use client";

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Sparkles, 
  Volume2, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Maximize2, 
  X, 
  HardDrive,
  CheckCircle2,
  Loader2,
  Bot,
  Plus,
  Trash2
} from "lucide-react";

type MemoryCategory = "Audio" | "Visual" | "Meeting" | "Insight";

interface MemoryItem {
  id: string;
  title: string;
  category: MemoryCategory;
  date: string;
  durationOrSize: string;
  summary: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  icon: "audio" | "image" | "video" | "text";
  keyTakeaways: string[];
  sizeMB: number;
}

const defaultMemories: MemoryItem[] = [
  {
    id: "mem-1",
    title: "Hackathon Idea Brainstorm",
    category: "Audio",
    date: "Jul 28",
    durationOrSize: "14 mins • 18 MB",
    sizeMB: 18,
    summary: "Discussion on system architecture, Vision Pro demo specs, and Next.js 15 app router optimizations.",
    tags: ["Project", "Brainstorm", "AI"],
    gradient: "from-blue-900/60 via-indigo-950/70 to-slate-950/80",
    accentColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    icon: "audio",
    keyTakeaways: [
      "Finalized Next.js 15 App Router structure",
      "Prioritized spatial gesture feedback for demo",
      "Set sprint target for prototype completion"
    ]
  },
  {
    id: "mem-2",
    title: "Hardware & Sensor Layout",
    category: "Visual",
    date: "Jul 28",
    durationOrSize: "4K Capture • 42 MB",
    sizeMB: 42,
    summary: "Visual snapshot of circuit schematics, pinout connections, and spatial gesture sensor module.",
    tags: ["Hardware", "Circuits", "Specs"],
    gradient: "from-emerald-950/70 via-teal-950/70 to-slate-950/80",
    accentColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    icon: "image",
    keyTakeaways: [
      "Verified I2C pinout voltage tolerances",
      "Mapped ultra-sonic range threshold triggers",
      "Confirmed low-power standby mode"
    ]
  },
  {
    id: "mem-3",
    title: "Weekly Planning & Goals",
    category: "Meeting",
    date: "Jul 25",
    durationOrSize: "32 mins • 64 MB",
    sizeMB: 64,
    summary: "Reviewed upcoming milestones, schedule adjustments, routine habits, and sprint timeline.",
    tags: ["Sync", "Roadmap", "Notes"],
    gradient: "from-rose-950/70 via-red-950/60 to-slate-950/80",
    accentColor: "border-rose-500/40 text-rose-400 bg-rose-500/10",
    icon: "video",
    keyTakeaways: [
      "Shifted travel plan review to early October",
      "Scheduled daily deep work sessions for 09:30 AM",
      "Synchronized project deadlines across all modules"
    ]
  },
];

export function MemoryGrid() {
  const [memories, setMemories] = useState<MemoryItem[]>(defaultMemories);
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // New Memory Modal Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newCategory, setNewCategory] = useState<MemoryCategory>("Insight");
  const [newTags, setNewTags] = useState("Reality, Idea");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("realityos_recent_memories");
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch {
        console.log("Could not load memories");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("realityos_recent_memories", JSON.stringify(memories));
  }, [memories]);

  // Dynamic storage calculation (Base 12.0 GB + sum of memory files)
  const totalBaseMB = 12288; // ~12GB base
  const memoryTotalMB = memories.reduce((acc, curr) => acc + (curr.sizeMB || 20), 0);
  const usedStorageGB = ((totalBaseMB + memoryTotalMB) / 1024);
  const totalStorageGB = 50.0;
  const storagePercentage = Math.min(100, (usedStorageGB / totalStorageGB) * 100);

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    let icon: MemoryItem["icon"] = "text";
    let gradient = "from-purple-950/70 via-indigo-950/70 to-slate-950/80";
    let accentColor = "border-purple-500/40 text-purple-400 bg-purple-500/10";

    if (newCategory === "Audio") {
      icon = "audio";
      gradient = "from-blue-900/60 via-indigo-950/70 to-slate-950/80";
      accentColor = "border-blue-500/40 text-blue-400 bg-blue-500/10";
    } else if (newCategory === "Visual") {
      icon = "image";
      gradient = "from-emerald-950/70 via-teal-950/70 to-slate-950/80";
      accentColor = "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
    } else if (newCategory === "Meeting") {
      icon = "video";
      gradient = "from-rose-950/70 via-red-950/60 to-slate-950/80";
      accentColor = "border-rose-500/40 text-rose-400 bg-rose-500/10";
    }

    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const tagArray = newTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: todayStr,
      durationOrSize: "Rec • 24 MB",
      sizeMB: 24,
      summary: newSummary.trim(),
      tags: tagArray.length ? tagArray : ["RealityOS"],
      gradient,
      accentColor,
      icon,
      keyTakeaways: [
        `Logged on ${todayStr}`,
        "Added to real-time neural memory store",
        "Available for conversational queries in Reality AI"
      ]
    };

    setMemories([newMem, ...memories]);
    setNewTitle("");
    setNewSummary("");
    setShowAddModal(false);
  };

  const handleDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(memories.filter((m) => m.id !== id));
    if (activeMemory?.id === id) {
      setActiveMemory(null);
    }
  };

  const handleOpenModal = (mem: MemoryItem) => {
    setActiveMemory(mem);
    setAnalyzing(false);
    setAnalyzed(false);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 800);
  };

  const renderIcon = (type: MemoryItem["icon"]) => {
    switch (type) {
      case "audio":
        return <Volume2 className="w-3.5 h-3.5" />;
      case "image":
        return <ImageIcon className="w-3.5 h-3.5" />;
      case "video":
        return <Video className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full p-5 bg-[#0b0e14]/90 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Recent Memories</h3>
              <p className="text-xs text-slate-400">Real-time contextual snapshots</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Memory
            </button>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYNCING
            </div>
          </div>
        </div>

        {/* Memory Cards Grid (Horizontally scrollable if more than 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-auto max-h-[300px] overflow-y-auto pr-1">
          {memories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => handleOpenModal(mem)}
              className={`group/card relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/70 bg-gradient-to-b ${mem.gradient} p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg hover:shadow-black/50 flex flex-col justify-between min-h-[145px]`}
            >
              <div className="flex items-start justify-between">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border flex items-center gap-1.5 ${mem.accentColor}`}>
                  {renderIcon(mem.icon)}
                  {mem.category}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-medium text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {mem.date}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMemory(mem.id, e)}
                    className="opacity-0 group-hover/card:opacity-100 p-1 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover/card:text-white transition-colors">
                  {mem.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {mem.summary}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                <span>{mem.durationOrSize}</span>
                <Maximize2 className="w-3 h-3 opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Storage Progress Gauge */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">Memory Storage</span>
            </div>
            <span className="font-mono text-slate-300 text-[11px]">
              {usedStorageGB.toFixed(1)} GB <span className="text-slate-500">/ {totalStorageGB} GB</span>
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden p-[1px] border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 transition-all duration-500"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD NEW MEMORY */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-[#0f131a] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Record New Memory</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Memory Title</label>
                <input
                  autoFocus
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Sensor Hardware Layout discussion"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                  >
                    <option value="Insight">Insight (Note)</option>
                    <option value="Audio">Audio Stream</option>
                    <option value="Visual">Visual Capture</option>
                    <option value="Meeting">Meeting Sync</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tags (comma separated)</label>
                  <input
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="AI, Hardware, Sync"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Summary / Context</label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Key details or transcript points captured in this memory..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition active:scale-95"
                >
                  Save to RealityOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PREVIEW & ANALYZE MEMORY */}
      {activeMemory && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMemory(null)}
        >
          <div 
            className="bg-[#0f131a] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveMemory(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md border flex items-center gap-1.5 ${activeMemory.accentColor}`}>
                {renderIcon(activeMemory.icon)}
                {activeMemory.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">• {activeMemory.date}</span>
              <span className="text-xs text-slate-400 font-mono">• {activeMemory.durationOrSize}</span>
            </div>

            <h3 className="text-lg font-bold text-white mt-2 pr-8">{activeMemory.title}</h3>
            
            <div className="my-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeMemory.summary}
              </p>
            </div>

            {analyzed ? (
              <div className="mb-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                  <Bot className="w-4 h-4" />
                  RealityOS Neural Synthesis
                </div>
                <div className="space-y-1.5">
                  {activeMemory.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {activeMemory.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700/50">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setActiveMemory(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
              >
                Close
              </button>

              <button 
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 shadow-lg shadow-purple-600/30 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Memory...
                  </>
                ) : analyzed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Analyzed
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Analyze with RealityOS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MemoryGrid;