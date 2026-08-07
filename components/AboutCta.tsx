import Reveal from "./ui/Reveal";
import Button from "./ui/Button";
import { ArrowRight } from "lucide-react";

export default function AboutCta() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-surface-alt">
      <div className="container-px mx-auto max-w-5xl">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 md:px-16 md:py-20 text-center">
          <div className="aurora opacity-60">
            <div className="aurora__blob aurora__blob--1" style={{ opacity: 0.35 }} />
            <div className="aurora__blob aurora__blob--2" style={{ opacity: 0.3 }} />
          </div>

          <div className="relative">
            <span className="eyebrow text-white/70">Why RealityOS</span>
            <h2 className="mt-4 text-3xl md:text-[2.6rem] leading-tight font-semibold text-white max-w-2xl mx-auto">
              Built on the belief that AI should know your life, not just answer your prompts.
            </h2>
            <p className="mt-5 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              We're a small team competing in the Google Build with Gemini XPRIZE
              Hackathon, building the AI Life Operating System we wished existed —
              one that remembers, understands, and helps, quietly, in the background
              of your day.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="brand">
                Get Started
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                Talk to the team
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
