"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
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
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
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
    done: false,
  },
  {
    id: 3,
    title: "Update RealityOS Docs",
    category: "Development",
    priority: "Low",
    done: false,
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
  const [focusMode, setFocusMode] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [newTask, setNewTask] = useState("");

  const completed = tasks.filter((task) => task.done).length;

  const score = Math.min(
    100,
    72 + completed * 6
  );

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
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      category: "Personal",
      priority: "Medium",
      done: false,
    };

    setTasks((current) => [task, ...current]);
    setNewTask("");
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

                <p className="mt-2 text-sm text-white/50">
                  Your current momentum
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <Activity size={20} />
              </div>
            </div>

            <div className="mt-8 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-tight text-white">
                {score}
              </span>

              <span className="mb-3 text-sm text-white/40">
                / 100
              </span>
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

              <h2 className="mt-2 text-xl font-medium text-white">
                Deep Work
              </h2>
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
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02]"
              >
                {timerRunning ? "Pause" : "Start Focus"}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSeconds(25 * 60);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.05]"
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
              <p className="font-medium text-white">
                Reality Insight
              </p>

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

          <Lightbulb
            size={18}
            className="hidden text-yellow-300/70 sm:block"
          />

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">

        {/* TASKS */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-blue-300" />

                <h2 className="font-medium text-white">
                  Today's Priorities
                </h2>
              </div>

              <p className="mt-1 text-xs text-white/35">
                {completed} of {tasks.length} completed
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs text-white/50">
              {Math.round((completed / Math.max(tasks.length, 1)) * 100)}%
            </div>

          </div>

          <div className="mt-6 space-y-3">

            {filteredTasks.map((task) => (

              <div
                key={task.id}
                className={`group flex items-center gap-4 rounded-2xl border p-4 transition ${
                  task.done
                    ? "border-emerald-400/10 bg-emerald-400/[0.03]"
                    : "border-white/5 bg-white/[0.025] hover:bg-white/[0.05]"
                }`}
              >

                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    task.done
                      ? "border-emerald-400 bg-emerald-400 text-black"
                      : "border-white/20 hover:border-blue-400"
                  }`}
                >
                  {task.done && <Check size={14} />}
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
                  className={`hidden rounded-full px-2.5 py-1 text-[10px] sm:block ${
                    task.priority === "High"
                      ? "bg-red-400/10 text-red-300"
                      : task.priority === "Medium"
                      ? "bg-yellow-400/10 text-yellow-300"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {task.priority}
                </span>

              </div>

            ))}

          </div>

          {/* ADD TASK */}
          <div className="mt-5 flex gap-2">

            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
              placeholder="Add a new priority..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-400/40"
            />

            <button
              onClick={addTask}
              className="rounded-xl bg-white px-4 text-black transition hover:scale-105"
            >
              <Plus size={18} />
            </button>

          </div>

        </div>

        {/* TODAY */}
        <div className="space-y-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-300">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Today
                </p>

                <p className="text-xs text-white/35">
                  {today.toLocaleDateString(undefined, {
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

                <div
                  key={time}
                  className="flex items-center gap-3"
                >

                  <span className="w-12 text-xs text-white/30">
                    {time}
                  </span>

                  <div className="h-10 w-px bg-white/10" />

                  <div>
                    <p className="text-sm text-white/75">
                      {title}
                    </p>

                    <p className="text-[11px] text-white/30">
                      {category}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">

            <div className="flex items-center gap-2">
              <Zap size={17} className="text-yellow-300" />

              <h3 className="font-medium text-white">
                Quick Actions
              </h3>
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
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.025] p-3 text-left text-xs text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <ActionIcon size={15} />
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

                      <p className="text-sm text-white">
                        {task.title}
                      </p>

                      <p className="text-xs text-white/30">
                        {task.category}
                      </p>

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