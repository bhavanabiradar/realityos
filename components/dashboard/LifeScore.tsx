"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DAYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

export const LifeScore = () => {
  const [score, setScore] = useState(0);
  const [focus, setFocus] = useState("LOW");
  const [loading, setLoading] = useState(true);

  const loadLifeScore = async () => {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setScore(0);
        setFocus("LOW");
        setLoading(false);
        return;
      }

      // Fetch priorities and habits at the same time
      const [tasksResult, checklistResult] = await Promise.all([
        supabase
          .from("tasks")
          .select("completed")
          .eq("user_id", user.id),

        supabase
          .from("checklist_items")
          .select("frequency, completed_days, is_completed")
          .eq("user_id", user.id),
      ]);

      if (tasksResult.error) {
        console.error("Life Score tasks error:", tasksResult.error);
      }

      if (checklistResult.error) {
        console.error(
          "Life Score checklist error:",
          checklistResult.error
        );
      }

      const tasks = tasksResult.data || [];
      const checklistItems = checklistResult.data || [];

      // -----------------------------------------
      // 1. PRIORITY SCORE
      // -----------------------------------------

      const completedTasks = tasks.filter(
        (task) => task.completed === true
      ).length;

      const priorityScore =
        tasks.length > 0
          ? (completedTasks / tasks.length) * 100
          : 0;

      // -----------------------------------------
      // 2. HABIT / CHECKLIST SCORE
      // -----------------------------------------

      let totalChecks = 0;
      let completedChecks = 0;

      checklistItems.forEach((item) => {
        if (item.frequency === "daily" && item.completed_days) {
          DAYS.forEach((day) => {
            totalChecks++;

            if (item.completed_days[day] === true) {
              completedChecks++;
            }
          });
        } else {
          totalChecks++;

          if (item.is_completed === true) {
            completedChecks++;
          }
        }
      });

      const habitScore =
        totalChecks > 0
          ? (completedChecks / totalChecks) * 100
          : 0;

      // -----------------------------------------
      // 3. FINAL LIFE SCORE
      // -----------------------------------------
      //
      // Priorities = 60%
      // Habits    = 40%
      //

      const calculatedScore = Math.round(
        priorityScore * 0.6 + habitScore * 0.4
      );

      setScore(Math.min(100, Math.max(0, calculatedScore)));

      // -----------------------------------------
      // 4. FOCUS LEVEL
      // -----------------------------------------

      if (priorityScore >= 70) {
        setFocus("HIGH");
      } else if (priorityScore >= 40) {
        setFocus("MEDIUM");
      } else {
        setFocus("LOW");
      }

    } catch (error) {
      console.error("Failed to calculate Life Score:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + automatic refresh
  useEffect(() => {
    loadLifeScore();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      loadLifeScore();
    }, 10000);

    // Refresh immediately when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadLifeScore();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <GlassCard
      className="p-6 border-t-2"
      delay={0.2}
      style={{ borderTopColor: "var(--primary)" }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3
            className="font-medium text-xs uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Life Score
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <Activity
              size={14}
              style={{ color: "var(--primary)" }}
            />

            <span
              className="text-xs font-bold"
              style={{ color: "var(--primary)" }}
            >
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <motion.span
          key={score}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold tracking-tighter"
          style={{ color: "var(--foreground)" }}
        >
          {loading ? "—" : score}
        </motion.span>

        <span
          className="mb-2 font-medium"
          style={{ color: "var(--muted)" }}
        >
          /100
        </span>
      </div>

      <div
        className="relative h-2 w-full rounded-full overflow-hidden"
        style={{
          background: "rgba(148,163,184,0.12)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{
            duration: 1,
            ease: "circOut",
          }}
          className="absolute h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--primary), var(--secondary))",
            boxShadow: "0 0 20px var(--glow)",
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Focus
          </p>

          <p
            className="text-sm font-semibold uppercase"
            style={{ color: "var(--foreground)" }}
          >
            {focus}
          </p>
        </div>

        <div>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Rest
          </p>

          <p
            className="text-sm font-semibold uppercase"
            style={{ color: "var(--foreground)" }}
          >
            OPTIMAL
          </p>
        </div>
      </div>
    </GlassCard>
  );
};