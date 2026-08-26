"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Check, Trash2, Plus, Flame, 
  Heart, Loader2, StickyNote, X, RotateCcw 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DAYS = ["M", "T", "W", "Th", "F", "Sa", "Su"] as const;

export function LifeChecklistCard() {
  const [items, setItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "deep">("daily");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Routine & Health");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("Small steps every day make a big difference ✨");
  const [weeklyStreaks, setWeeklyStreaks] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        const { data: listData } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        setItems(listData || []);

        const { data: streakData } = await supabase
          .from("user_streaks")
          .select("weekly_streaks")
          .eq("user_id", user.id)
          .single();
        if (streakData) setWeeklyStreaks(streakData.weekly_streaks || 0);
      } else {
        const local = localStorage.getItem("life_checklist_cache");
        if (local) setItems(JSON.parse(local));
        const localStreak = localStorage.getItem("life_weekly_streaks");
        if (localStreak) setWeeklyStreaks(parseInt(localStreak, 10));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetStreak = async () => {
    if (!confirm("Are you sure you want to reset your streak back to 0?")) return;

    setWeeklyStreaks(0);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase
        .from("user_streaks")
        .upsert({ user_id: user.id, weekly_streaks: 0, updated_at: new Date().toISOString() });
    } else {
      localStorage.setItem("life_weekly_streaks", "0");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const newItem = {
        id: crypto.randomUUID(),
        title: newTitle.trim(),
        frequency: activeTab,
        category: newCategory,
        completed_days: { M: false, T: false, W: false, Th: false, F: false, Sa: false, Su: false },
        is_completed: false,
      };

      if (!user) {
        const updated = [...items, newItem];
        setItems(updated);
        localStorage.setItem("life_checklist_cache", JSON.stringify(updated));
        setNewTitle("");
        return;
      }

      const { data, error } = await supabase
        .from("checklist_items")
        .insert([{
          user_id: user.id,
          title: newTitle.trim(),
          frequency: activeTab,
          category: newCategory,
          completed_days: newItem.completed_days,
          is_completed: false
        }])
        .select()
        .single();

      if (!error && data) {
        setItems((prev) => [...prev, data]);
        setNewTitle("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDayToggle = async (itemId: string, day: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const currentDays = targetItem.completed_days || {};
    const updatedDays = { ...currentDays, [day]: !currentDays[day] };

    const updatedList = items.map((i) =>
      i.id === itemId ? { ...i, completed_days: updatedDays } : i
    );
    setItems(updatedList);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase.from("checklist_items").update({ completed_days: updatedDays }).eq("id", itemId);
    } else {
      localStorage.setItem("life_checklist_cache", JSON.stringify(updatedList));
    }

    const completedAll7 = DAYS.every((d) => updatedDays[d] === true);
    if (completedAll7 && !DAYS.every((d) => currentDays[d] === true)) {
      triggerStreakMilestone(user);
    }
  };

  const triggerStreakMilestone = async (user: any) => {
    const nextStreak = weeklyStreaks + 1;
    setWeeklyStreaks(nextStreak);
    setShowCelebration(true);

    if (user) {
      await supabase
        .from("user_streaks")
        .upsert({ user_id: user.id, weekly_streaks: nextStreak, updated_at: new Date().toISOString() });
    } else {
      localStorage.setItem("life_weekly_streaks", nextStreak.toString());
    }
  };

  const handleSingleToggle = async (itemId: string, current: boolean) => {
    const updatedList = items.map((i) =>
      i.id === itemId ? { ...i, is_completed: !current } : i
    );
    setItems(updatedList);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase.from("checklist_items").update({ is_completed: !current }).eq("id", itemId);
    } else {
      localStorage.setItem("life_checklist_cache", JSON.stringify(updatedList));
    }
  };

  const handleDelete = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase.from("checklist_items").delete().eq("id", id);
    } else {
      localStorage.setItem("life_checklist_cache", JSON.stringify(updated));
    }
  };

  let totalChecks = 0;
  let completedChecks = 0;
  items.forEach((item) => {
    if (item.frequency === "daily" && item.completed_days) {
      DAYS.forEach((d) => {
        totalChecks++;
        if (item.completed_days[d]) completedChecks++;
      });
    } else {
      totalChecks++;
      if (item.is_completed) completedChecks++;
    }
  });

  const completionRate = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
  const filteredItems = items.filter((i) => i.frequency === activeTab);

  return (
    <div className="relative bg-[#111318]/95 border border-neutral-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
      
      {/* 7-DAY STREAK CELEBRATION POPUP */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-md bg-[#161922] border border-amber-500/40 rounded-3xl p-8 text-center space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full bg-neutral-800/60 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-inner">
              <Flame className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight text-white">YAA HOOO! 🎉</h3>
              <p className="text-sm font-semibold text-amber-400">Congratulations!</p>
              <p className="text-xs text-neutral-300 pt-2">
                You successfully crushed a full 7-Day Streak! You now have{" "}
                <span className="font-bold text-white text-sm">{weeklyStreaks} Streak{weeklyStreaks > 1 ? "s" : ""}</span> added to your milestone board!
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
            >
              Keep The Momentum Going 🔥
            </button>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-bold text-white tracking-wider uppercase">
              Life Checklist & Habit Journal
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">A focused space = A clear mind ✨</p>
        </div>

        {/* Dynamic Streak Badge with Reset Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
            <span>{completionRate}% Completed</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{weeklyStreaks} {weeklyStreaks === 1 ? "Streak" : "Streaks"}</span>
          </div>

          <button
            onClick={handleResetStreak}
            title="Reset Streak to 0"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30 text-xs font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "daily"
              ? "bg-pink-500 text-black shadow-lg shadow-pink-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🌸 Daily Tracker (M-S)
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "weekly"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🌿 Weekly Focus
        </button>
        <button
          onClick={() => setActiveTab("deep")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "deep"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          }`}
        >
          🎯 Monthly / Sprints
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-4">
        {activeTab === "daily" && (
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/60 mb-3 px-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Habit / Goal
            </span>
            <div className="flex gap-2 text-[10px] font-bold text-neutral-400">
              {DAYS.map((d) => (
                <span key={d} className="w-7 text-center">{d}</span>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-pink-400 mb-2" />
            <span className="text-xs">Loading items...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {filteredItems.map((item, idx) => {
              const allDaysChecked =
                item.frequency === "daily" &&
                item.completed_days &&
                DAYS.every((d) => item.completed_days[d]);

              const isDimmed = item.frequency === "daily" ? allDaysChecked : item.is_completed;

              return (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                    isDimmed
                      ? "bg-neutral-950/40 border-neutral-900 opacity-40"
                      : "bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 mr-3">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-neutral-800 text-pink-300 border border-neutral-700">
                      {item.category}
                    </span>
                    <span className={`text-xs font-medium truncate ${isDimmed ? "line-through text-neutral-500" : "text-white"}`}>
                      {idx + 1}. {item.title}
                    </span>
                  </div>

                  {activeTab === "daily" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      {DAYS.map((day) => {
                        const isChecked = item.completed_days?.[day];
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(item.id, day)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                              isChecked
                                ? "bg-pink-500 border-pink-400 text-black shadow-sm shadow-pink-500/30"
                                : "bg-neutral-800/80 border-neutral-700 text-transparent hover:border-pink-400/50"
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-neutral-600 hover:text-red-400 p-1 transition ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleSingleToggle(item.id, item.is_completed)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                          item.is_completed
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {item.is_completed ? "Completed" : "Pending"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-neutral-600 hover:text-red-400 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <p className="text-xs">No items in {activeTab} view.</p>
          </div>
        )}

        {/* Add Input */}
        <form onSubmit={handleAddItem} className="mt-4 pt-3 border-t border-neutral-800/80 flex gap-2">
          <input
            type="text"
            placeholder={`Add ${activeTab} habit or task...`}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500/50"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500/50 cursor-pointer"
          >
            <option value="Routine & Health">🌱 Routine & Health</option>
            <option value="Study">📚 Study / Academics</option>
            <option value="Projects">⚡ Engineering & Code</option>
            <option value="Personal">🎯 Personal</option>
          </select>
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-black font-semibold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>
      </div>

      {/* Note Bar */}
      <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1">
          <StickyNote className="w-4 h-4 text-pink-400 shrink-0" />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-transparent text-xs text-neutral-300 focus:outline-none w-full italic"
          />
        </div>
        <span className="text-[10px] text-neutral-500 shrink-0 font-medium">✨ Auto-saved</span>
      </div>
    </div>
  );
}

export default LifeChecklistCard;