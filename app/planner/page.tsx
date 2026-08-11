import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DecisionCard } from "@/components/dashboard/DecisionCard";

export default function DecisionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28rem] text-zinc-500">Decisions</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Decision Engine</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Back to Home
          </Link>
        </div>

        <DecisionCard />
      </div>
    </DashboardLayout>
  );
}