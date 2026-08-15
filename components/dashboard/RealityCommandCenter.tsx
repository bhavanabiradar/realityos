"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Command,
  Flame,
  Focus,
  Lightbulb,
  ListChecks,
  Moon,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type PriorityLevel = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  category: string;
  priority: PriorityLevel;
  done: boolean;
};

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Design System Sync",
    category: "Project Reality",
    priority: "High",
    done: false,
  },
  {
    id: 2,
    title: "Review Q3 Roadmap",
    category: "Planning",
    priority: "Medium",
    done: true,
  },
  {
    id: 3,
    title: "Update RealityOS Docs",
    category: "Development",
    priority: "Low",
    done: true,
  },
  {
    id: 4,
    title: "Deep work session",
    category: "Focus",
    priority: "High",
    done: false,
  },
];

export default function RealityCommandCenter() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // New Task Form State
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>("Medium");
  const [selectedCategory, setSelectedCategory] = useState("Personal");

  // Quick Action Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalInput, setModalInput] = useState("");

  const completed = tasks.filter((task) => task.done).length;
  const score = Math.min(100, 72 + completed * 6);

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;

    return tasks.filter((task) =>
      `${task.title} ${task.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [tasks, search]);

  useEffect(() => {
    const saved = localStorage.getItem("realityos-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        console.log("Could not load saved tasks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("realityos-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      done: false,
    };

    setTasks((current) => [task, ...current]);
    setNewTask("");
  };

  const handleQuickActionSubmit = () => {
    if (!modalInput.trim()) {
      setActiveModal(null);
      return;
    }

    if (activeModal === "Set Goal" || activeModal === "Plan Day") {
      setTasks((current) => [
        {
          id: Date.now(),
          title: modalInput.trim(),
          category: activeModal === "Set Goal" ? "Goals" : "Schedule",
          priority: "High",
          done: false,
        },
        ...current,
      ]);
    } else if (activeModal === "Save Memory") {
      alert(`Saved "${modalInput}" to RealityOS Memories!`);
    } else if (activeModal === "Command") {
      alert(`Executing RealityOS Command: ${modalInput}`);
    }

    setModalInput("");
    setActiveModal(null);
  };

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-white/40">
            <Sparkles size={14} />
            REALITY COMMAND CENTER
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Good to see you.
          </h1>

          <p className="mt-1 text-sm text-white/45">
            Your life, organized around what actually matters.
          </p>
        </div>

        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/50 transition hover:bg-white/[0.08]"
        >
          <Search size={17} />
          <span>Search RealityOS</span>
          <kbd className="rounded-md border border-white/10 px-2 py-1 text-[10px]">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* HERO GRID */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* LIFE SCORE */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.16] via-white/[0.04] to-purple-500/[0.10] p-6">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                  Life Score
                </p>
                <p className="mt-2 text-sm text-white/50">Your current momentum</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-white">
                <Activity size={20} />
              </div>
            </div>

            <div className="mt-8 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-tight text-white">
                {score}
              </span>
              <span className="mb-3 text-sm text-white/40">/ 100</span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-400 transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-emerald-400">
              <TrendingUp size={15} />
              +8% momentum this week
            </div>
          </div>
        </div>

        {/* FOCUS */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Focus
              </p>
              <h2 className="mt-2 text-xl font-medium text-white">Deep Work</h2>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-300">
              <Focus size={20} />
            </div>
          </div>

          <div className="mt-7 text-center">
            <div className="text-5xl font-semibold tracking-tight text-white">
              {minutes}:{secs}
            </div>

            <p className="mt-2 text-xs text-white/35">
              {timerRunning
                ? "Stay focused. You've got this."
                : "25 minute focus session"}
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02] cursor-pointer"
              >
                {timerRunning ? "Pause" : "Start Focus"}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSeconds(25 * 60);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.05] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHT */}
      <div className="rounded-3xl border border-blue-400/10 bg-blue-500/[0.05] p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Brain size={20} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white">Reality Insight</p>
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] text-blue-300">
                SMART
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-white/50">
              You have {tasks.length - completed} unfinished priorities.
              Completing your high-priority tasks first could improve your
              momentum significantly today.
            </p>
          </div>

          <Lightbulb size={18} className="hidden text-yellow-300/70 sm:block" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        {/* TASKS / PRIORITIES */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks size={18} className="text-blue-300" />
                  <h2 className="font-medium text-white">Today's Priorities</h2>
                </div>
                <p className="mt-1 text-xs text-white/35">
                  {completed} of {tasks.length} completed
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                {Math.round((completed / Math.max(tasks.length, 1)) * 100)}%
              </div>
            </div>

            <div className="mt-6 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 transition cursor-pointer ${
                    task.done
                      ? "border-emerald-400/10 bg-emerald-400/[0.03]"
                      : "border-white/5 bg-white/[0.025] hover:bg-white/[0.05]"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      task.done
                        ? "border-emerald-400 bg-emerald-400 text-black"
                        : "border-white/20 hover:border-blue-400"
                    }`}
                  >
                    {task.done && <Check size={14} strokeWidth={3} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        task.done
                          ? "text-white/30 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                      {task.category}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      task.priority === "High"
                        ? "bg-red-400/10 text-red-300 border border-red-400/20"
                        : task.priority === "Medium"
                        ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/20"
                        : "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={(e) => deleteTask(task.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ADD PRIORITY SECTION */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            {/* Tag/Priority Chooser */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-white/40 text-[11px]">Priority:</span>
                {(["High", "Medium", "Low"] as PriorityLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedPriority(level)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${
                      selectedPriority === level
                        ? level === "High"
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : level === "Medium"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-white/[0.03] text-white/40 hover:text-white"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/[0.05] border border-white/10 text-white/60 text-[11px] rounded-lg px-2 py-1 outline-none focus:border-blue-400"
              >
                <option value="Personal" className="bg-[#10111b] text-white">Personal</option>
                <option value="Study" className="bg-[#10111b] text-white">Study</option>
                <option value="Development" className="bg-[#10111b] text-white">Development</option>
                <option value="Focus" className="bg-[#10111b] text-white">Focus</option>
                <option value="Health" className="bg-[#10111b] text-white">Health</option>
              </select>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                placeholder="Add a new priority... (e.g. have breakfast)"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-400/40"
              />

              <button
                onClick={addTask}
                className="rounded-xl bg-white px-4 text-black transition hover:scale-105 active:scale-95 cursor-pointer font-medium flex items-center justify-center shadow-lg"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* TODAY & QUICK ACTIONS */}
        <div className="space-y-5">
          {/* Today Timeline */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-300">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-white">Today</p>
                <p className="text-xs text-white/35" suppressHydrationWarning>
                  {today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["09:30", "Deep Work", "Focus"],
                ["12:30", "Lunch / Recharge", "Personal"],
                ["15:00", "Project Reality", "Development"],
                ["18:30", "Review & Plan", "Planning"],
              ].map(([time, title, category]) => (
                <div key={time} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-white/30">{time}</span>
                  <div className="h-10 w-px bg-white/10" />
                  <div>
                    <p className="text-sm text-white/75">{title}</p>
                    <p className="text-[11px] text-white/30">{category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-2">
              <Zap size={17} className="text-yellow-300" />
              <h3 className="font-medium text-white">Quick Actions</h3>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                [Target, "Set Goal"],
                [Brain, "Save Memory"],
                [Clock3, "Plan Day"],
                [Command, "Command"],
              ].map(([Icon, label]) => {
                const ActionIcon = Icon as React.ElementType;
                return (
                  <button
                    key={label as string}
                    onClick={() => {
                      setActiveModal(label as string);
                      setModalInput("");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.025] p-3 text-left text-xs text-white/65 transition hover:bg-white/[0.08] hover:text-white active:scale-95 cursor-pointer"
                  >
                    <ActionIcon size={15} className="text-purple-400" />
                    {label as string}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER STATUS */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          RealityOS systems operational
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Moon size={13} />
            Balanced
          </span>

          <span className="flex items-center gap-1">
            <Flame size={13} />
            {completed + 3} day momentum
          </span>
        </div>
      </div>

      {/* QUICK ACTION POPUP MODAL */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#12131e] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                {activeModal}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/50">
              {activeModal === "Set Goal" && "Define a core goal for today's sprint."}
              {activeModal === "Save Memory" && "Capture an insight, thought, or snippet to your memory log."}
              {activeModal === "Plan Day" && "Add a specific block to your timeline."}
              {activeModal === "Command" && "Type an AI command to run across RealityOS."}
            </p>

            <input
              autoFocus
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickActionSubmit();
              }}
              placeholder={`Enter details for ${activeModal.toLowerCase()}...`}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-purple-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickActionSubmit}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-md"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#10111b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 p-5">
              <Search size={20} className="text-white/40" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks, memories, plans..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="rounded-lg p-2 text-white/40 hover:bg-white/5"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-white/30">
                  Nothing found.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      toggleTask(task.id);
                      setShowSearch(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-white/[0.05]"
                  >
                    <div className="rounded-lg bg-white/5 p-2">
                      <ListChecks size={15} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-white">{task.title}</p>
                      <p className="text-xs text-white/30">{task.category}</p>
                    </div>

                    <ChevronRight size={15} className="text-white/20" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}