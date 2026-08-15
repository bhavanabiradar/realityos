"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  addEvent,
  deleteEvent,
  getEvents,
  type RealityEvent,
} from "@/lib/realityStore";
import { cn } from "@/lib/utils";

export const EventCard = () => {
  const [events, setEvents] = useState<RealityEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Event");

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleAddEvent = () => {
    if (!title.trim() || !time.trim()) {
      return;
    }

    const newEvent = addEvent(
      title.trim(),
      time.trim(),
      location.trim(),
      type
    );
if (!newEvent) return;

setEvents((current) => [newEvent, ...current]);

    setTitle("");
    setTime("");
    setLocation("");
    setType("Event");
    setShowModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = deleteEvent(id);
    setEvents(updated);
  };

  return (
    <>
      <GlassCard className="p-6" delay={0.5}>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar
              size={18}
              className="text-purple-400"
            />

            <h3 className="text-zinc-400 font-medium text-sm">
              Upcoming Events
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition hover:border-purple-400/40 hover:text-white"
          >
            <Plus size={12} />
            Add Event
          </button>
        </div>

        {/* EVENTS */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="py-10 text-center">
              <Calendar
                size={28}
                className="mx-auto mb-3 text-zinc-700"
              />

              <p className="text-sm text-zinc-500">
                No upcoming events
              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Add an event to start planning your day.
              </p>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1 + index * 0.05,
                }}
                className="flex gap-4 group"
              >
                {/* TIMELINE */}
                <div
                  className={cn(
                    "w-1 rounded-full shrink-0",
                    index % 2 === 0
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  )}
                />

                {/* EVENT DETAILS */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
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
                            <span>
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                        {event.type}
                      </span>
                    </div>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteEvent(event.id)
                      }
                      aria-label={`Delete ${event.title}`}
                      className="opacity-0 group-hover:opacity-100 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/5 text-zinc-600 transition hover:border-red-500/20 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-zinc-500 font-medium">
              Schedule
            </p>

            <p className="text-[10px] text-zinc-400">
              {events.length}{" "}
              {events.length === 1 ? "Event" : "Events"}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ADD EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add New Event
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Add something to your RealityOS schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* EVENT NAME */}
            <div className="mb-4">
              <label className="mb-2 block text-xs text-zinc-400">
                Event
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Physics revision"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-purple-400/50"
              />
            </div>

            {/* TIME */}
            <div className="mb-4">
              <label className="mb-2 block text-xs text-zinc-400">
                Time
              </label>

              <input
                value={time}
                onChange={(e) =>
                  setTime(e.target.value)
                }
                placeholder="e.g. 6:00 PM - 7:00 PM"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-purple-400/50"
              />
            </div>

            {/* LOCATION */}
            <div className="mb-4">
              <label className="mb-2 block text-xs text-zinc-400">
                Location
              </label>

              <input
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. Home / College"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-purple-400/50"
              />
            </div>

            {/* TYPE */}
            <div className="mb-6">
              <label className="mb-2 block text-xs text-zinc-400">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50"
              >
                <option value="Event">Event</option>
                <option value="Study">Study</option>
                <option value="Meeting">Meeting</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400 transition hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddEvent}
                disabled={
                  !title.trim() || !time.trim()
                }
                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Save Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};