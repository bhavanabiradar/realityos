"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Calendar, Clock, MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Vision Pro Demo",
    time: "2:30 PM - 3:30 PM",
    location: "Studio A",
    color: "bg-purple-500",
  },
  {
    id: 2,
    title: "Evening Meditation",
    time: "8:00 PM - 8:30 PM",
    location: "Home",
    color: "bg-blue-500",
  },
];

export const EventCard = () => {
  return (
    <GlassCard className="p-6" delay={0.5}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-purple-400" />
          <h3 className="text-zinc-400 font-medium text-sm">Upcoming Events</h3>
        </div>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          Today
        </span>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex gap-4 group cursor-pointer"
          >
            {/* Apple-style Vertical Timeline Indicator */}
            <div className={cn("w-1 rounded-full shrink-0", event.color)} />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                {event.title}
              </h4>
              
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock size={12} />
                  <span>{event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 font-medium">Tomorrow</p>
          <p className="text-[10px] text-zinc-400">3 Events</p>
        </div>
      </div>
    </GlassCard>
  );
};

// Helper to handle class merging within this specific file context
import { cn } from '@/lib/utils';