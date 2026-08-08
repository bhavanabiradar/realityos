"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemePresetName =
  | "midnight"
  | "ocean"
  | "violet"
  | "emerald"
  | "sunset"
  | "rose";
export type BackgroundStyle = "solid" | "gradient" | "aurora" | "glass";
export type AppearanceMode = "dark" | "light" | "system";
export type Density = "comfortable" | "compact";

export interface AppearanceSettings {
  theme: ThemePresetName;
  accentColor: string;
  backgroundStyle: BackgroundStyle;
  appearanceMode: AppearanceMode;
  density: Density;
  reducedMotion: boolean;
}

export const STORAGE_KEY = "realityos-appearance";

export const THEME_PRESETS: Record<
  ThemePresetName,
  {
    background: string;
    card: string;
    sidebar: string;
    primary: string;
    secondary: string;
    border: string;
    text: string;
    muted: string;
    glow: string;
  }
> = {
  midnight: {
    background: "#050816",
    card: "#0f172a",
    sidebar: "#090d18",
    primary: "#60a5fa",
    secondary: "#a78bfa",
    border: "rgba(148, 163, 184, 0.2)",
    text: "#e2e8f0",
    muted: "#94a3b8",
    glow: "rgba(96, 165, 250, 0.35)",
  },
  ocean: {
    background: "#061b2a",
    card: "#0d2335",
    sidebar: "#061b2a",
    primary: "#2dd4bf",
    secondary: "#38bdf8",
    border: "rgba(45, 212, 191, 0.18)",
    text: "#e6f7ff",
    muted: "#7dd3fc",
    glow: "rgba(45, 212, 191, 0.3)",
  },
  violet: {
    background: "#120d1c",
    card: "#1b1229",
    sidebar: "#120d1c",
    primary: "#8b5cf6",
    secondary: "#c084fc",
    border: "rgba(168, 85, 247, 0.2)",
    text: "#f3e8ff",
    muted: "#c4b5fd",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  emerald: {
    background: "#071611",
    card: "#0f1f1a",
    sidebar: "#081810",
    primary: "#34d399",
    secondary: "#10b981",
    border: "rgba(52, 211, 153, 0.2)",
    text: "#ecfdf5",
    muted: "#86efac",
    glow: "rgba(52, 211, 153, 0.3)",
  },
  sunset: {
    background: "#1a0f0d",
    card: "#281712",
    sidebar: "#1a0f0d",
    primary: "#f59e0b",
    secondary: "#fb7185",
    border: "rgba(251, 146, 60, 0.22)",
    text: "#fff7ed",
    muted: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  rose: {
    background: "#180b15",
    card: "#2a1221",
    sidebar: "#180b15",
    primary: "#f472b6",
    secondary: "#fb7185",
    border: "rgba(244, 114, 182, 0.2)",
    text: "#fff1f2",
    muted: "#f9a8d4",
    glow: "rgba(244, 114, 182, 0.3)",
  },
};

export const DEFAULT_SETTINGS: AppearanceSettings = {
  theme: "midnight",
  accentColor: "",
  backgroundStyle: "gradient",
  appearanceMode: "dark",
  density: "comfortable",
  reducedMotion: false,
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;

  const numeric = Number.parseInt(full, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mixHex(base: string, target: string, amount: number) {
  const from = hexToRgb(base);
  const to = hexToRgb(target);
  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * amount);

  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(mix(from.r, to.r))}${toHex(mix(from.g, to.g))}${toHex(mix(from.b, to.b))}`;
}

function isHexColor(value?: string): value is string {
  return Boolean(value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value));
}

export function getResolvedAppearance(settings: AppearanceSettings) {
  const preset = THEME_PRESETS[settings.theme];
  const isDarkMode =
    settings.appearanceMode === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      : settings.appearanceMode === "dark";

  const primary = isHexColor(settings.accentColor) ? settings.accentColor : preset.primary;
  const secondary = isHexColor(settings.accentColor) ? settings.accentColor : preset.secondary;

  const background = isDarkMode ? preset.background : mixHex(preset.background, "#f8fafc", 0.88);
  const side = isDarkMode ? preset.sidebar : mixHex(preset.sidebar, "#f8fafc", 0.85);
  const card = isDarkMode ? preset.card : mixHex(preset.card, "#ffffff", 0.72);
  const border = isDarkMode ? preset.border : "rgba(15, 23, 42, 0.08)";
  const text = isDarkMode ? preset.text : "#0f172a";
  const muted = isDarkMode ? preset.muted : "#475569";
  const glow = rgba(primary, isDarkMode ? 0.38 : 0.2);

  return {
    ...preset,
    background,
    card,
    sidebar: side,
    primary,
    secondary,
    border,
    text,
    muted,
    glow,
    isDarkMode,
    mode: isDarkMode ? "dark" : "light",
  };
}

const AppearanceContext = createContext<{
  settings: AppearanceSettings;
  updateSetting: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => void;
  setTheme: (theme: ThemePresetName) => void;
  resetAccent: () => void;
  resolvedTheme: ReturnType<typeof getResolvedAppearance>;
} | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AppearanceSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // Ignore malformed storage values and keep the defaults.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const theme = getResolvedAppearance(settings);
    const root = document.documentElement;

    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--foreground", theme.text);
    root.style.setProperty("--card", theme.card);
    root.style.setProperty("--card-foreground", theme.text);
    root.style.setProperty("--sidebar", theme.sidebar);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-foreground", theme.mode === "dark" ? "#f8fafc" : "#0f172a");
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--glow", theme.glow);
    root.style.setProperty("--accent-rgb", hexToRgb(theme.primary).r + ", " + hexToRgb(theme.primary).g + ", " + hexToRgb(theme.primary).b);

    root.dataset.mode = settings.appearanceMode;
    root.dataset.density = settings.density;
    root.dataset.backgroundStyle = settings.backgroundStyle;
    root.dataset.theme = settings.theme;
    root.style.colorScheme = theme.mode;

    document.body.classList.toggle("reduced-motion", settings.reducedMotion);
    document.body.classList.toggle("light-mode", theme.mode === "light");
    document.body.classList.toggle("dark-mode", theme.mode === "dark");
  }, [settings, ready]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (settings.appearanceMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const theme = getResolvedAppearance(settings);
      const root = document.documentElement;
      root.style.setProperty("--background", theme.background);
      root.style.setProperty("--foreground", theme.text);
      root.style.setProperty("--card", theme.card);
      root.style.setProperty("--card-foreground", theme.text);
      root.style.setProperty("--sidebar", theme.sidebar);
      root.style.setProperty("--primary", theme.primary);
      root.style.setProperty("--primary-foreground", theme.mode === "dark" ? "#f8fafc" : "#0f172a");
      root.style.setProperty("--secondary", theme.secondary);
      root.style.setProperty("--muted", theme.muted);
      root.style.setProperty("--border", theme.border);
      root.style.setProperty("--glow", theme.glow);
      root.style.setProperty("--accent-rgb", hexToRgb(theme.primary).r + ", " + hexToRgb(theme.primary).g + ", " + hexToRgb(theme.primary).b);
      root.style.colorScheme = theme.mode;
      document.body.classList.toggle("light-mode", theme.mode === "light");
      document.body.classList.toggle("dark-mode", theme.mode === "dark");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [settings, settings.appearanceMode]);

  const resolvedTheme = useMemo(() => getResolvedAppearance(settings), [settings]);

  const updateSetting = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const setTheme = (theme: ThemePresetName) => setSettings((previous) => ({ ...previous, theme }));
  const resetAccent = () => setSettings((previous) => ({ ...previous, accentColor: "" }));

  const value = useMemo(
    () => ({ settings, updateSetting, setTheme, resetAccent, resolvedTheme }),
    [settings, resolvedTheme],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }

  return context;
}
