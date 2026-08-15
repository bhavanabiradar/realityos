import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIChatCard } from "@/components/dashboard/AIChatCard";

export default function AIChatPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28rem] text-zinc-500">AI Chat</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Reality Assistant</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Back to Home
          </Link>
        </div>

        <AIChatCard />
       
      </div>
    </DashboardLayout>
  );
}
