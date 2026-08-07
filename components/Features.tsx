import { Brain, FileText, CalendarClock, Compass, LifeBuoy, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";

const FEATURES = [
  {
    Icon: Brain,
    title: "AI Memory",
    description:
      "RealityOS remembers your goals, people, preferences, and past conversations — building a living memory it actually uses, instead of one you have to repeat.",
    span: "lg:col-span-3 lg:row-span-2",
    tone: "tall",
  },
  {
    Icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload contracts, medical records, or receipts. RealityOS reads and understands them, so you can ask a question instead of searching a folder.",
    span: "lg:col-span-3",
  },
  {
    Icon: CalendarClock,
    title: "Smart Planner",
    description:
      "Turns your goals and commitments into a plan that adapts as your life changes — no manual re-scheduling required.",
    span: "lg:col-span-3",
  },
  {
    Icon: Compass,
    title: "AI Decision Engine",
    description:
      "Weighs your options against what it knows about you — your budget, your values, your history — before you have to decide.",
    span: "lg:col-span-3",
  },
  {
    Icon: LifeBuoy,
    title: "Emergency Assistant",
    description:
      "In a crisis, RealityOS instantly surfaces the right documents, contacts, and next steps — calm, fast, and ready when it counts.",
    span: "lg:col-span-6",
    tone: "wide",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-surface-alt">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl mb-14 md:mb-20">
          <span className="eyebrow">Capabilities</span>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-semibold text-ink">
            One system, five ways it looks after your life.
          </h2>
          <p className="mt-4 text-ink-soft text-lg leading-relaxed">
            Every capability draws from the same memory — so nothing you tell RealityOS
            is ever siloed or forgotten.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-flow-dense gap-5">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08} className={feature.span}>
              <FeatureCard
                Icon={feature.Icon}
                title={feature.title}
                description={feature.description}
                tone={feature.tone}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  Icon,
  title,
  description,
  tone,
}: {
  Icon: typeof Brain;
  title: string;
  description: string;
  tone?: string;
}) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-8 md:p-9
        transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift hover:border-primary/20
        ${tone === "tall" ? "flex flex-col justify-between min-h-[280px] lg:min-h-full" : ""}
        ${tone === "wide" ? "md:flex md:items-center md:justify-between md:gap-10" : ""}
      `}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gradient-soft
          opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className={tone === "wide" ? "md:max-w-md" : ""}>
        <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow mb-6">
          <Icon size={19} className="text-white" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-semibold text-ink tracking-tight">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{description}</p>
      </div>

      {tone === "tall" && (
        <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Learn how memory works
          <ArrowUpRight size={15} />
        </div>
      )}

      {tone === "wide" && (
        <div className="mt-6 md:mt-0 flex-shrink-0 flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          See it in a crisis
          <ArrowUpRight size={15} />
        </div>
      )}
    </div>
  );
}
