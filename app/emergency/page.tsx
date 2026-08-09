import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";

export default function EmergencyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28rem] text-zinc-500">Emergency</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Response Center</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Back to Home
          </Link>
        </div>

        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Critical contacts</h2>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-rose-300">
                Active
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Primary</p>
                <p className="mt-3 text-lg font-semibold text-white">Emergency Services</p>
                <p className="mt-2 text-sm text-zinc-300">Call 911 / local equivalent</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Medical</p>
                <p className="mt-3 text-lg font-semibold text-white">Care Team</p>
                <p className="mt-2 text-sm text-zinc-300">Dr. Patel • 555-0142</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Family</p>
                <p className="mt-3 text-lg font-semibold text-white">Emergency Contact</p>
                <p className="mt-2 text-sm text-zinc-300">Maya • 555-2020</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
