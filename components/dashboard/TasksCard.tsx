"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import {
  CheckCircle2,
  ArrowUpRight,
  ListTodo,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import {
  getTasks,
  toggleTask,
  addTask,
  deleteTask,
  type RealityTask,
} from "@/lib/realityStore";

export const TasksCard = () => {
  const [tasks, setTasks] = useState<RealityTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state inside modal
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const syncTasks = () => {
    setTasks(getTasks());
  };

  useEffect(() => {
    syncTasks();

    const handleStorageChange = () => syncTasks();
    window.addEventListener("realityos-data-change", handleStorageChange);
    return () => window.removeEventListener("realityos-data-change", handleStorageChange);
  }, []);

  const handleToggle = (id: string) => {
    toggleTask(id);
    syncTasks();
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    syncTasks();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask(newTaskTitle, "General", newTaskPriority);
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    syncTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  return (
    <>
      {/* ================= DASHBOARD TASK CARD ================= */}
      <GlassCard className="flex flex-col justify-between p-6" delay={0.3}>
        <div>
          {/* HEADER */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-blue-400" />
              <h3 className="text-sm font-medium text-zinc-400">Tasks Today</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              title="Open full task manager"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>

          {/* PREVIEW LIST (TOP 4 TASKS) */}
          <div className="space-y-1.5">
            {tasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-600">
                No tasks for today.
              </div>
            ) : (
              tasks.slice(0, 4).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => handleToggle(task.id)}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/5"
                >
                  {/* CHECKBOX */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                      task.done
                        ? "border-blue-500 bg-blue-500/20 text-blue-400"
                        : "border-zinc-700 bg-zinc-900/50 group-hover:border-blue-500/40"
                    }`}
                  >
                    {task.done && <Check size={12} strokeWidth={3} />}
                  </div>

                  {/* TITLE */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs transition-colors ${
                        task.done
                          ? "text-zinc-500 line-through"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>

                  {/* PRIORITY BADGE */}
                  <div
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${
                      task.priority === "High"
                        ? "border-red-500/20 bg-red-500/10 text-red-400"
                        : task.priority === "Medium"
                        ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                        : "border-zinc-700 bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {task.priority}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* VIEW ALL TASKS BUTTON */}
        <motion.button
          type="button"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-5 w-full rounded-xl border border-white/5 bg-white/5 py-2.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
        >
          View All Tasks ({tasks.length})
        </motion.button>
      </GlassCard>

      {/* ================= FULL VIEW ALL TASKS MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="flex h-[560px] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400">
                    <ListTodo size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      All Workspace Tasks
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Manage, filter, and add daily priorities
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-white/5 p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ADD NEW TASK FORM */}
              <form onSubmit={handleAddTask} className="mb-4 flex shrink-0 gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-blue-500/40"
                />

                <select
                  value={newTaskPriority}
                  onChange={(e) =>
                    setNewTaskPriority(e.target.value as "High" | "Medium" | "Low")
                  }
                  className="rounded-xl border border-white/10 bg-zinc-900/80 px-2.5 py-2 text-xs text-zinc-300 outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="flex items-center gap-1 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add
                </button>
              </form>

              {/* FILTER PILLS */}
              <div className="mb-3 flex shrink-0 gap-2 border-b border-white/5 pb-3">
                {(["all", "active", "completed"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-lg px-2.5 py-1 text-xs capitalize transition ${
                      filter === f
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {f} ({
                      f === "all"
                        ? tasks.length
                        : f === "active"
                        ? tasks.filter((t) => !t.done).length
                        : tasks.filter((t) => t.done).length
                    })
                  </button>
                ))}
              </div>

              {/* TASKS LIST */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredTasks.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center text-center text-xs text-zinc-600">
                    No tasks found in this view.
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-900/40 p-3 transition hover:border-white/10 hover:bg-zinc-900/70"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(task.id)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          task.done
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-zinc-700 bg-zinc-950 hover:border-blue-500/50"
                        }`}
                      >
                        {task.done && <Check size={12} strokeWidth={3} />}
                      </button>

                      <span
                        onClick={() => handleToggle(task.id)}
                        className={`flex-1 cursor-pointer text-xs transition ${
                          task.done
                            ? "text-zinc-500 line-through"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </span>

                      <div
                        className={`rounded-full border px-2 py-0.5 text-[10px] ${
                          task.priority === "High"
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : task.priority === "Medium"
                            ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            : "border-zinc-700 bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {task.priority}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        title="Delete task"
                        className="rounded-md p-1 text-zinc-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};