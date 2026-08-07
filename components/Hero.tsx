"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight, Brain, FileText, ListChecks, Compass } from "lucide-react";
import Button from "./ui/Button";

const CHIPS = [
  { label: "Remembers your goals", Icon: Brain, className: "left-[4%] top-[18%] md:left-[8%]" },
  { label: "Reads your documents", Icon: FileText, className: "right-[2%] top-[12%] md:right-[6%]" },
  { label: "Plans your week", Icon: ListChecks, className: "left-[2%] bottom-[10%] md:left-[10%]" },
  { label: "Guides your decisions", Icon: Compass, className: "right-[4%] bottom-[16%] md:right-[9%]" },
];

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="aurora">
        <div className="aurora__blob aurora__blob--1" />
        <div className="aurora__blob aurora__blob--2" />
        <div className="aurora__blob aurora__blob--3" />
      </div>
      <div className="grain" />

      {/* Floating context chips — desktop only, decorative */}
      <div className="hidden lg:block">
        {CHIPS.map(({ label, Icon, className }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-10 animate-floatY ${className}`}
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-line px-4 py-2 shadow-card">
              <Icon size={15} className="text-primary" strokeWidth={2} />
              <span className="text-xs font-medium text-ink-soft whitespace-nowrap">{label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container-px relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 backdrop-blur px-4 py-1.5 mb-8 shadow-soft"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulseRing" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="eyebrow">Your Life Operating System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.6rem] leading-[1.06] sm:text-6xl md:text-7xl font-semibold tracking-tight text-ink"
        >
          Your Life. One AI.
          <br />
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Infinite Possibilities.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 text-lg md:text-xl text-ink-soft max-w-2xl mx-auto leading-relaxed"
        >
          RealityOS remembers what matters, understands your documents, plans your
          life, and helps you make smarter decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="brand" className="px-7 py-3.5 text-[15px]">
            Get Started
            <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" className="px-7 py-3.5 text-[15px]">
            <Play size={15} fill="currentColor" className="text-ink" />
            Watch Demo
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 text-xs text-ink-faint font-mono uppercase tracking-[0.14em]"
        >
          Built for the Google Build with Gemini XPRIZE Hackathon
        </motion.p>
      </div>
    </section>
  );
}
