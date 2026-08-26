"use client";

import React, { useState, useEffect } from "react";
import { Check, Trash2, Plus, Loader2, ListTodo, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PriorityItem {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
}

export function TasksCard() {
  const [tasks, setTasks] = useState<PriorityItem[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const loadTasks = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        // Fallback to local storage if session is offline
        const local = localStorage.getItem("daily_priorities_cache");
        if (local) setTasks(JSON.parse(local));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        // Save locally if not logged in
        const fallbackItem: PriorityItem = {
          id: crypto.randomUUID(),
          title: title.trim(),
          priority,
          completed: false,
        };
        const updated = [fallbackItem, ...tasks];
        setTasks(updated);
        localStorage.setItem("daily_priorities_cache", JSON.stringify(updated));
        setTitle("");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert([{
          user_id: user.id,
          title: title.trim(),
          priority,
          completed: false,
          category: "Personal"
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTasks((prev) => [data, ...prev]);
        setTitle("");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to add priority");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    const nextVal = !currentCompleted;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextVal } : t))
    );

    try {
      await supabase.from("tasks").update({ completed: nextVal }).eq("id", id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await supabase.from("tasks").delete().eq("id", id);
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="bg-[#111318]/90 border border-neutral-800/80 rounded-3xl p-5 flex flex-col justify-between h-full min-h-[380px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Today's Priorities
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-neutral-800 text-cyan-400">
            {progressPercent}%
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 mb-3">
          {completedCount} of {tasks.length} completed
        </p>

        {errorMessage && (
          <div className="p-2 mb-3 text-[11px] bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* Priority List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mb-2" />
            <span className="text-xs">Loading priorities...</span>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                  task.completed
                    ? "bg-neutral-950/40 border-neutral-900 opacity-40"
                    : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <div
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="flex items-center gap-3 cursor-pointer truncate flex-1 mr-2"
                >
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-cyan-500 border-cyan-400 text-black shadow-sm shadow-cyan-500/30"
                        : "border-neutral-600 bg-neutral-800 text-transparent group-hover:border-cyan-400"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="truncate">
                    <span
                      className={`text-xs font-medium transition-colors block truncate ${
                        task.completed ? "line-through text-neutral-500" : "text-white"
                      }`}
                    >
                      {idx + 1}. {task.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold border ${
                      task.priority === "high"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : task.priority === "medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-neutral-500 hover:text-red-400 p-0.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <p className="text-xs">No priorities added yet.</p>
          </div>
        )}
      </div>

      {/* Add Priority Form */}
      <form onSubmit={handleAdd} className="mt-4 pt-3 border-t border-neutral-800/80 space-y-2">
        <input
          type="text"
          placeholder="e.g., Complete Chapter 3, Walk 10k..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
        />

        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default TasksCard;