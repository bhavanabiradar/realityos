"use client";

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Fixed on the left */}
      <Sidebar activeTab="home" />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Subtle top-light effect for the content area */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />
        
        <div className="max-w-[1400px] mx-auto p-8 lg:p-12">
          {children}
        </div>
        
        {/* Padding at the bottom for better scrolling experience */}
        <div className="h-20" />
      </main>
    </div>
  );
};