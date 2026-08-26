"use client";

import React from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Greeting } from "@/components/dashboard/Greeting";
import { LifeScore } from "@/components/dashboard/LifeScore";
import { GoalTrackerCard } from "@/components/dashboard/GoalTrackerCard";
import { AIChatCard } from "@/components/dashboard/AIChatCard";
import { EventCard } from "@/components/dashboard/EventCard";
import  MemoryGrid  from "@/components/dashboard/MemoryGrid";
import { DecisionCard } from "@/components/dashboard/DecisionCard";
import { DocsCard } from "@/components/dashboard/DocsCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* TOP HEADER */}
      <Greeting />

      {/* MAIN DASHBOARD */}
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start min-h-0">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 min-h-0">

          {/* SCROLLABLE LEFT DASHBOARD */}
          <div className="h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LifeScore />
            <GoalTrackerCard />
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventCard />
              <MemoryGrid />
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DecisionCard />
              <DocsCard />
            </div>

          </div>
        </div>
{/* ================= RIGHT SIDE — AI CHAT ================= */}
<div className="lg:col-span-2 h-[600px] min-h-0 overflow-hidden">


  {/* FIXED SCROLLABLE AI CHAT BOX */}
  <div
    className="
      h-[calc(100vh-150px)]
      min-h-[500px]
      overflow-y-auto
      pr-2
      scrollbar-thin
      scrollbar-thumb-white/10
      scrollbar-track-transparent
    "
  >
    <AIChatCard />
  </div>

        </div>
      </div>

    </DashboardLayout>
  );
}