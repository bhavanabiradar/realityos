"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import * as TasksCardModule from "@/components/dashboard/TasksCard";
import * as LifeChecklistCardModule from "@/components/dashboard/LifeChecklistCard";
import * as LifeScoreModule from "@/components/dashboard/LifeScore";

const resolve = (mod: any, name: string) => mod[name] || mod.default || (() => null);

const TasksCard = resolve(TasksCardModule, "TasksCard");
const LifeChecklistCard = resolve(LifeChecklistCardModule, "LifeChecklistCard");
const LifeScore = resolve(LifeScoreModule, "LifeScore");

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-2xl font-black text-white">To-Do List & Habit Tracker</h1>
          <p className="text-xs text-neutral-400">Set daily priorities and complete your weekly habit streaks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LifeScore />
            <TasksCard />
          </div>
          <div className="lg:col-span-2">
            <LifeChecklistCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}