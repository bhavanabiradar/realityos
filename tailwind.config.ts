import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B14",
          soft: "#4B4D5C",
          faint: "#8A8CA0",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F8FC",
          raised: "#FFFFFF",
        },
        line: {
          DEFAULT: "#E6E8F0",
          soft: "#EEF0F7",
        },
        primary: {
          DEFAULT: "#4F46E5",
          light: "#6D6AF0",
          dark: "#3730B8",
        },
        accent: {
          DEFAULT: "#9333EA",
          light: "#B266F0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(115deg, #4F46E5 0%, #7C5CF0 45%, #9333EA 100%)",
        "brand-gradient-soft": "linear-gradient(115deg, rgba(79,70,229,0.10) 0%, rgba(147,51,234,0.10) 100%)",
        "radial-fade": "radial-gradient(60% 60% at 50% 40%, rgba(79,70,229,0.16) 0%, rgba(147,51,234,0.08) 45%, rgba(255,255,255,0) 75%)",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(15, 15, 35, 0.04), 0 1px 2px rgba(15,15,35,0.03)",
        card: "0 8px 30px rgba(20, 20, 50, 0.06), 0 2px 6px rgba(20,20,50,0.04)",
        lift: "0 24px 60px -12px rgba(79, 70, 229, 0.25)",
        glow: "0 0 0 1px rgba(79,70,229,0.08), 0 20px 50px -10px rgba(124, 92, 240, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(24px, -18px) scale(1.05)" },
          "66%": { transform: "translate(-18px, 14px) scale(0.97)" },
        },
        driftSlow: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-30px, 20px) scale(1.08)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        drift: "drift 16s ease-in-out infinite",
        driftSlow: "driftSlow 22s ease-in-out infinite",
        floatY: "floatY 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        pulseRing: "pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
