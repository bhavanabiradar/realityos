"use client";

import React from "react";
import { Check, Palette, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { THEME_PRESETS, useAppearance } from "@/components/providers/AppearanceProvider";

const themeKeys = Object.keys(THEME_PRESETS) as Array<keyof typeof THEME_PRESETS>;

const labelMap: Record<string, string> = {
  solid: "Solid",
  gradient: "Gradient",
  aurora: "Aurora",
  glass: "Glass",
  dark: "Dark",
  light: "Light",
  system: "System",
  comfortable: "Comfortable",
  compact: "Compact",
};

export function AppearanceSettings() {
  const { settings, updateSetting, setTheme, resetAccent, resolvedTheme } = useAppearance();

  const accentValue = settings.accentColor || resolvedTheme.primary;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28rem] text-[var(--muted)]">Appearance</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Personalize RealityOS</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3 py-2 text-xs text-[var(--muted)]">
          <Palette size={14} style={{ color: "var(--primary)" }} />
          Live Theme
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <GlassCard className="p-5 sm:p-6" hoverable={false}>
          <div className="space-y-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Theme</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {themeKeys.map((themeKey) => {
                  const preset = THEME_PRESETS[themeKey];
                  const selected = settings.theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTheme(themeKey)}
                      className="group rounded-2xl border px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/60"
                      style={{
                        background: selected ? "var(--card)" : "rgba(15,23,42,0.12)",
                        borderColor: selected ? "var(--primary)" : "var(--border)",
                        boxShadow: selected ? `0 0 0 1px ${resolvedTheme.primary} inset` : "none",
                      }}
                    >
                      <span className="mb-2 flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                            boxShadow: `0 0 0 2px ${preset.glow}`,
                          }}
                        />
                        <span className="text-sm font-medium capitalize text-[var(--foreground)]">{themeKey}</span>
                      </span>
                      <div className="flex gap-1.5">
                        {[preset.primary, preset.secondary, preset.card].map((swatch) => (
                          <span key={swatch} className="h-5 flex-1 rounded-md border border-white/10" style={{ background: swatch }} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Accent Color</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  htmlFor="appearance-accent"
                  className="flex h-12 w-14 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-inner"
                  style={{ boxShadow: `inset 0 0 0 1px ${resolvedTheme.primary}` }}
                >
                  <input
                    id="appearance-accent"
                    aria-label="Custom accent color"
                    type="color"
                    value={accentValue}
                    onChange={(event) => updateSetting("accentColor", event.target.value)}
                    className="h-8 w-8 cursor-pointer border-0 bg-transparent p-0"
                  />
                </label>

                <div className="flex min-h-12 flex-1 items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2">
                  <span className="font-mono text-sm text-[var(--foreground)]">{accentValue.toUpperCase()}</span>
                  <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: accentValue }} />
                </div>

                <button
                  type="button"
                  onClick={() => resetAccent()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/60"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Background</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["solid", "gradient", "aurora", "glass"] as const).map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--primary)]/50">
                    <input
                      type="radio"
                      name="background-style"
                      checked={settings.backgroundStyle === option}
                      onChange={() => updateSetting("backgroundStyle", option)}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    {labelMap[option]}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Mode</h2>
                <div className="space-y-2">
                  {(["dark", "light", "system"] as const).map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--primary)]/50">
                      <input
                        type="radio"
                        name="appearance-mode"
                        checked={settings.appearanceMode === option}
                        onChange={() => updateSetting("appearanceMode", option)}
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                      {labelMap[option]}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Density</h2>
                <div className="space-y-2">
                  {(["comfortable", "compact"] as const).map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--primary)]/50">
                      <input
                        type="radio"
                        name="density"
                        checked={settings.density === option}
                        onChange={() => updateSetting("density", option)}
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                      {labelMap[option]}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Reduced Motion</p>
                  <p className="text-xs text-[var(--muted)]">Simplify animation and micro-interactions.</p>
                </div>
                <button
                  type="button"
                  aria-label="Toggle reduced motion"
                  onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                  className="relative h-7 w-12 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/60"
                  style={{
                    background: settings.reducedMotion ? "var(--primary)" : "rgba(148, 163, 184, 0.2)",
                    borderColor: settings.reducedMotion ? "var(--primary)" : "var(--border)",
                  }}
                >
                  <span
                    className="absolute top-1 h-5 w-5 rounded-full bg-white transition-transform"
                    style={{
                      left: settings.reducedMotion ? "calc(100% - 1.4rem)" : "0.2rem",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5" hoverable={false}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--foreground)]">Preview</p>
            <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Live
            </span>
          </div>

          <div
            className="rounded-2xl border p-4 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${resolvedTheme.card}, rgba(15,23,42,0.2))`,
              borderColor: "var(--border)",
              boxShadow: `0 0 35px ${resolvedTheme.glow}`,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg font-semibold text-white" style={{ background: "var(--primary)" }}>
                  R
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">RealityOS</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">AI system</div>
                </div>
              </div>
              <span className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)]" style={{ borderColor: "var(--border)" }}>
                Online
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--border)] bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Focus</span>
                  <span style={{ color: "var(--primary)" }}>82%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/10" style={{ background: "rgba(148,163,184,0.14)" }}>
                  <div className="h-full rounded-full" style={{ width: "82%", background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/60"
                  style={{ background: "var(--primary)" }}
                >
                  Capture
                </button>
                <button
                  type="button"
                  className="rounded-xl border px-3 py-2 text-sm font-medium text-[var(--foreground)]"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}
                >
                  Tune
                </button>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Sample card</span>
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} style={{ color: "var(--primary)" }} />
                    Syncing
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Life Score</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">Your rituals are consistent and momentum is climbing.</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
