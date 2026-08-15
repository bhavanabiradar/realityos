"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Greeting } from "@/components/dashboard/Greeting";
import { LifeScore } from "@/components/dashboard/LifeScore";
import { TasksCard } from "@/components/dashboard/TasksCard";
import { AIChatCard } from "@/components/dashboard/AIChatCard";
import { EventCard } from "@/components/dashboard/EventCard";
import { MemoryGrid } from "@/components/dashboard/MemoryGrid";
import { DecisionCard } from "@/components/dashboard/DecisionCard";
import { DocsCard } from "@/components/dashboard/DocsCard";
import { PredictiveTimeline } from "@/components/dashboard/PredictiveTimeline";
export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* Top Header Section */}
      <Greeting />

      {/* Main Dashboard Grid */}
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

        <div className="lg:col-span-1">
          <EventCard />
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <MemoryGrid />
        </div>

        <div className="lg:col-span-1">
          <DecisionCard />
        </div>

        <div className="lg:col-span-1">
          <DocsCard />
        </div>

{/* ✅ NEW CODE */}
             <div className="lg:col-span-3">
<PredictiveTimeline />        
        </div>

      </div>

    </DashboardLayout>
  );
}