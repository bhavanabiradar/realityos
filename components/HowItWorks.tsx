import { UploadCloud, Sparkles, HeartHandshake } from "lucide-react";
import Reveal from "./ui/Reveal";

const STEPS = [
  {
    n: "01",
    Icon: UploadCloud,
    title: "Upload",
    description:
      "Bring your documents, notes, calendars, and conversations. Whatever context you have, RealityOS can take it in.",
  },
  {
    n: "02",
    Icon: Sparkles,
    title: "AI Understands",
    description:
      "RealityOS reads, connects, and remembers — turning scattered information into a single, structured understanding of your life.",
  },
  {
    n: "03",
    Icon: HeartHandshake,
    title: "RealityOS Helps",
    description:
      "Ask a question, make a decision, or just get on with your day. RealityOS is already a step ahead, ready with what you need.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl mb-16 md:mb-24">
          <span className="eyebrow">How It Works</span>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-semibold text-ink">
            From scattered life to structured intelligence.
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* connecting line */}
          <div className="hidden md:block absolute top-[38px] left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-line via-primary/30 to-line" />

          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.15} className="relative">
              <div className="relative z-10 flex md:flex-col items-start md:items-start gap-5 md:gap-0">
                <div className="relative flex-shrink-0 flex h-[76px] w-[76px] items-center justify-center rounded-3xl bg-white border border-line shadow-card md:mb-8">
                  <step.Icon size={26} className="text-primary" strokeWidth={1.8} />
                  <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-mono text-white">
                    {step.n}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ink tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
