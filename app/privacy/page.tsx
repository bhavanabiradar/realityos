import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | RealityOS",
  description: "Privacy policy and data protection practices for RealityOS.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] text-neutral-300 py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RealityOS</span>
        </Link>

        {/* Header */}
        <div className="border-b border-neutral-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Privacy Policy</h1>
          <p className="text-xs text-neutral-500">Effective Date: August 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>
              When you use RealityOS, we collect information necessary to provide and personalize your workspace:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li><strong>Account Credentials:</strong> Your email address and hashed authentication data managed securely via Supabase.</li>
              <li><strong>Workspace Content:</strong> Tasks, daily priorities, habit logs, memories, event schedules, and decision records you input into the platform.</li>
              <li><strong>Usage Telemetry:</strong> Anonymized crash logs and basic performance diagnostics to improve reliability.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. How We Protect Your Data</h2>
            <p>
              Your data is stored in enterprise-grade PostgreSQL databases on Supabase with <strong>Row Level Security (RLS)</strong> enforced. This guarantees that your tasks, habits, and memories can only ever be queried and modified by your authenticated account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Third-Party Services</h2>
            <p>
              We integrate trusted infrastructure providers to deliver RealityOS:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li><strong>Vercel:</strong> Cloud frontend hosting and edge routing.</li>
              <li><strong>Supabase:</strong> Authentication, user identity, and encrypted PostgreSQL storage.</li>
            </ul>
            <p className="text-xs text-neutral-400 mt-2">
              We never sell, rent, or monetize your personal information to advertisers or external third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Data Ownership & Deletion</h2>
            <p>
              You own all content you create on RealityOS. You may delete individual tasks, memories, or habits at any time, which permanently purges them from the database.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, reach out via your workspace settings or repository support.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}