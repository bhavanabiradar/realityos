"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Circle, Plus, Trash2, Flame, 
  Target, TrendingUp, Calendar, Loader2 
} from "lucide-react";
import { 
  fetchUserTasks, 
  createDatabaseTask, 
  toggleDatabaseTask, 
  deleteDatabaseTask 
} from "@/lib/supabaseStore";

interface TaskItem {
  id: string;
  title: string;
  priority: string;
  category?: string;
  completed: boolean;
  created_at?: string;
}

export function GoalTrackerCard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchUserTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const created = await createDatabaseTask(newTitle.trim(), priority, category);
    if (created) {
      setTasks((prev) => [created, ...prev]);
      setNewTitle("");
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    const updated = !currentCompleted;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: updated } : t))
    );
    await toggleDatabaseTask(id, updated);
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteDatabaseTask(id);
  };

  // Metrics Calculations
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // Mock weekly activity for SVG bar graph
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyActivity = [60, 80, 45, 90, 70, completionRate, 0];

  return (
    <div className="bg-[#111318]/90 border border-neutral-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-full min-h-[460px]">
      
      {/* Top Header & Streak Metric */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Goal & Sprint Tracker</h2>
              <p className="text-[11px] text-neutral-400">Daily milestones & momentum score</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>5 Day Streak</span>
          </div>
        </div>

        {/* Analytics Card with Mini Bar Graph */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 mb-5">
          
          {/* Circular Completion Score */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-white">{completionRate}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{completedCount}/{totalCount} Done</div>
              <p className="text-[10px] text-neutral-400">Daily velocity</p>
            </div>
          </div>

          {/* SVG Micro Bar Graph */}
          <div className="sm:col-span-2 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-1.5 h-10 pt-2">
              {weeklyActivity.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    style={{ height: `${Math.max(height * 0.35, 4)}px` }}
                    className={`w-full rounded-sm transition-all duration-500 ${
                      i === 5 ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "bg-neutral-800"
                    }`}
                  />
                  <span className="text-[9px] text-neutral-500">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3">
          {(["all", "active", "completed"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition capitalize cursor-pointer ${
                filter === mode
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800/40"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mb-2" />
            <span className="text-xs">Loading goals...</span>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-700 transition"
              >
                <div
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="flex items-center gap-3 cursor-pointer truncate flex-1 mr-2"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-500 shrink-0 group-hover:text-cyan-400 transition" />
                  )}
                  <div className="truncate">
                    <span
                      className={`text-xs block truncate ${
                        task.completed ? "line-through text-neutral-500" : "text-neutral-100 font-medium"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {task.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] uppercase px-2 py-0.5 rounded font-semibold border ${
                      task.priority === "high"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : task.priority === "medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <p className="text-xs">No tasks in this view.</p>
          </div>
        )}
      </div>

      {/* Creation Form */}
      <form onSubmit={handleAddTask} className="mt-4 pt-3 border-t border-neutral-800/60 space-y-2">
        <input
          type="text"
          placeholder="Add a new milestone or goal..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
        />

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="Study">📚 Study / Projects</option>
            <option value="Engineering">⚡ Engineering</option>
            <option value="Wellness">🌱 Routine / Health</option>
            <option value="Personal">🎯 Personal</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-28 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-2 py-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting || !newTitle.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition shrink-0 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
      </form>

    </div>
  );
}

export default GoalTrackerCard;