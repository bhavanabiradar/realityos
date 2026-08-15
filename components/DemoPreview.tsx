"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Sliders, 
  Check, 
  Radio, 
  Palette, 
  Activity, 
  CheckCircle2,
  Camera
} from "lucide-react";

interface DemoPreviewProps {
  accentColor?: string; // Optional if passed from parent theme picker
}

export function DemoPreview({ accentColor = "#0284c7" }: DemoPreviewProps) {
  const [focusLevel, setFocusLevel] = useState(82);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [showTuneModal, setShowTuneModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCaptured(true);
      setTimeout(() => setCaptured(false), 2500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3 relative">
      {/* Top Bar Indicator */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsSyncing(!isSyncing)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Live Theme</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="p-6 rounded-3xl bg-[#0b0e14]/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Preview
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-medium text-emerald-400">
            LIVE
          </span>
        </div>

        {/* Inner Card */}
        <div className="p-5 rounded-2xl bg-[#0f131a] border border-slate-800/90 shadow-inner space-y-4">
          {/* Top Title & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                style={{ backgroundColor: accentColor }}
              >
                R
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide">RealityOS</h4>
                <p className="text-[10px] text-slate-400 tracking-wider">AI SYSTEM</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </div>
          </div>

          {/* Focus Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400 text-[11px]">Focus</span>
              <span className="font-mono text-[11px]" style={{ color: accentColor }}>
                {focusLevel}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/80">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${focusLevel}%`, backgroundColor: accentColor }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCapture}
              disabled={isCapturing}
              style={{ backgroundColor: accentColor }}
              className="col-span-3 py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-75 hover:brightness-110"
            >
              {isCapturing ? (
                <>
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  Capturing...
                </>
              ) : captured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Memory Logged!
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  Capture
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowTuneModal(true)}
              className="py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Tune
            </button>
          </div>

          {/* Sample Card */}
          <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Sample card</span>
              <span className="text-sky-400 flex items-center gap-1 text-[10px]">
                <Check className="w-3 h-3" /> Syncing
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200">Life Score</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your rituals are consistent and momentum is climbing.
            </p>
          </div>
        </div>
      </div>

      {/* Tune Calibration Popup */}
      {showTuneModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTuneModal(false)}
        >
          <div 
            className="bg-[#0f131a] border border-slate-700/80 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                Tune AI Calibration
              </h3>
              <button 
                onClick={() => setShowTuneModal(false)} 
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex justify-between">
                <span>Target Focus Threshold</span>
                <span className="font-mono text-sky-400">{focusLevel}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={focusLevel}
                onChange={(e) => setFocusLevel(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Adjusting this slider calibrates how aggressively RealityOS manages distractions during deep work blocks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemoPreview;