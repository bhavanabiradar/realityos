"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { useAppearance } from '@/components/providers/AppearanceProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { settings } = useAppearance();

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar activeTab="home" />

      <main className="flex-1 h-screen overflow-y-auto relative" style={{ background: 'transparent' }}>
        <div className="absolute top-0 left-0 right-0 h-px z-20" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

        <div
          className="max-w-[1400px] mx-auto"
          style={{
            padding: settings.density === 'compact' ? '1rem 1rem 3rem' : '2rem 2rem 5rem',
          }}
        >
          {children}
        </div>

        <div className="h-20" />
      </main>
    </div>
  );
};