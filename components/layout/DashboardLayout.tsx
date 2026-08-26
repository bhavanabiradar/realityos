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
    <div
      className="flex h-screen w-full overflow-hidden isolate"
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Sidebar is fixed on the left */}
      <Sidebar />

      {/* Main Content Area: scrolls independently and starts at the top */}
      <main className="flex-1 h-full overflow-y-auto relative z-[1]">
        <div
          className="pointer-events-none sticky top-0 left-0 right-0 h-px z-[2]"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--border), transparent)',
          }}
        />

        <div
          className="max-w-[1400px] mx-auto w-full"
          style={{
            padding:
              settings?.density === 'compact'
                ? '1rem 1rem 3rem'
                : '2rem 2rem 5rem',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};