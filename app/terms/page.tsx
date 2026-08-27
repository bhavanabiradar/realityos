import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | RealityOS",
  description: "Terms and conditions for using RealityOS.",
};

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>Usage Terms</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Terms of Service</h1>
          <p className="text-xs text-neutral-500">Last Updated: August 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing RealityOS, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Free Platform Access</h2>
            <p>
              RealityOS is currently provided free of charge for all users. We reserve the right to introduce optional premium tiers or modify existing features in future releases with prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. User Responsibilities & Account Security</h2>
            <p>
              You are responsible for safeguarding your account credentials. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li>Attempt to bypass Row Level Security or access unauthorized database tables.</li>
              <li>Use the platform for malicious automated scripts or abusive rate-limiting activities.</li>
              <li>Upload malicious code, harmful payloads, or unlawful content.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Service Availability & Disclaimer</h2>
            <p>
              RealityOS is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. While we strive for high uptime and strict data integrity, we are not liable for accidental service interruptions or loss of productivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Modifications to Service</h2>
            <p>
              We reserve the right to refine, add, or discontinue features to improve user experience. Continued use after changes indicates acceptance of the updated terms.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}