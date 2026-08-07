"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Greeting } from '@/components/dashboard/Greeting';
import { LifeScore } from '@/components/dashboard/LifeScore';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { AIChatCard } from '@/components/dashboard/AIChatCard';
import { EventCard } from '@/components/dashboard/EventCard';
import { MemoryGrid } from '@/components/dashboard/MemoryGrid';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { DocsCard } from '@/components/dashboard/DocsCard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Top Header Section */}
      <Greeting />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Row 1: Health, Tasks, and Wide AI Chat */}
        <div className="lg:col-span-1">
          <LifeScore />
        </div>
        
        <div className="lg:col-span-1">
          <TasksCard />
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <AIChatCard />
        </div>

        {/* Row 2: Calendar, Memories, and Decisions */}
        <div className="lg:col-span-1">
          <EventCard />
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <MemoryGrid />
        </div>

        <div className="lg:col-span-1">
          <DecisionCard />
        </div>

        {/* Row 3: Documents and potentially other stats */}
        <div className="lg:col-span-1">
          <DocsCard />
        </div>

        {/* Placeholder for future expansion or "Upcoming Calendar" (detailed) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="h-full w-full rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center p-8">
            <p className="text-zinc-600 text-sm font-medium tracking-widest uppercase">
              Predictive Timeline Module Loading...
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}