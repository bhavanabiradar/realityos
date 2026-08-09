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
    <div className="relative min-h-screen isolate" style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar />

      <main className="relative z-[1] overflow-y-auto" style={{ marginLeft: '16rem', minHeight: '100vh', background: 'transparent' }}>
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px z-[2]" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

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