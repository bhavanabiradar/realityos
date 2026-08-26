"use client";

import React from "react";
import * as LayoutModule from "@/components/layout/DashboardLayout";
import * as GreetingModule from "@/components/dashboard/Greeting";
import * as LifeScoreModule from "@/components/dashboard/LifeScore";
import * as TasksCardModule from "@/components/dashboard/TasksCard";
import * as LifeChecklistCardModule from "@/components/dashboard/LifeChecklistCard";
import * as AIChatCardModule from "@/components/dashboard/AIChatCard";
import * as EventCardModule from "@/components/dashboard/EventCard";
import * as DecisionCardModule from "@/components/dashboard/DecisionCard";
import * as DocsCardModule from "@/components/dashboard/DocsCard";
import * as PredictiveTimelineModule from "@/components/dashboard/PredictiveTimeline";
import * as MemoryGridModule from "@/components/dashboard/MemoryGrid";

// Helper to reliably resolve default or named export
const resolveComponent = (mod: any, fallbackName: string) => {
  if (!mod) return () => null;
  return mod[fallbackName] || mod.default || (() => null);
};

const DashboardLayout = resolveComponent(LayoutModule, "DashboardLayout");
const Greeting = resolveComponent(GreetingModule, "Greeting");
const LifeScore = resolveComponent(LifeScoreModule, "LifeScore");
const TasksCard = resolveComponent(TasksCardModule, "TasksCard");
const LifeChecklistCard = resolveComponent(LifeChecklistCardModule, "LifeChecklistCard");
const AIChatCard = resolveComponent(AIChatCardModule, "AIChatCard");
const EventCard = resolveComponent(EventCardModule, "EventCard");
const DecisionCard = resolveComponent(DecisionCardModule, "DecisionCard");
const DocsCard = resolveComponent(DocsCardModule, "DocsCard");
const PredictiveTimeline = resolveComponent(PredictiveTimelineModule, "PredictiveTimeline");
const MemoryGrid = resolveComponent(MemoryGridModule, "MemoryGrid");

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6 pb-12">
        {/* Top Greeting Header */}
        <Greeting />

        {/* Row 1: LifeScore, Today's Quick Priorities & AI Assistant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LifeScore />
          </div>

          <div className="lg:col-span-1">
            <TasksCard />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <AIChatCard />
          </div>
        </div>

        {/* Row 2: Life Checklist & 7-Day Habit Tracker */}
        <div className="w-full">
          <LifeChecklistCard />
        </div>

        {/* Row 3: Events, Memories & Decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <EventCard />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <MemoryGrid />
          </div>

          <div className="lg:col-span-1">
            <DecisionCard />
          </div>
        </div>

        {/* Row 4: Documents and Predictive Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DocsCard />
          </div>

          <div className="lg:col-span-3">
            <PredictiveTimeline />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}