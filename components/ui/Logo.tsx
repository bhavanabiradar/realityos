import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        <circle cx="14" cy="14" r="12.5" stroke="url(#logoGrad)" strokeWidth="1.6" opacity="0.35" />
        <ellipse
          cx="14"
          cy="14"
          rx="12.5"
          ry="5.2"
          stroke="url(#logoGrad)"
          strokeWidth="1.6"
          transform="rotate(35 14 14)"
        />
        <circle cx="14" cy="14" r="4.2" fill="url(#logoGrad)" />
      </svg>
      <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
        RealityOS
      </span>
    </div>
  );
}
