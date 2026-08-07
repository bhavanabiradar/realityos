import { Check } from "lucide-react";
import Reveal from "./ui/Reveal";
import Button from "./ui/Button";

const PLANS = [
  {
    name: "Personal",
    price: "Free",
    description: "Start building your memory and see what RealityOS can do.",
    features: ["AI Memory (limited)", "5 documents / month", "Daily planning", "Email support"],
    variant: "secondary" as const,
    featured: false,
  },
  {
    name: "Pro",
    price: "$24",
    period: "/month",
    description: "For anyone ready to hand RealityOS the full picture.",
    features: [
      "Unlimited AI Memory",
      "Unlimited document intelligence",
      "Smart Planner + calendar sync",
      "AI Decision Engine",
      "Priority support",
    ],
    variant: "brand" as const,
    featured: true,
  },
  {
    name: "Family",
    price: "$49",
    period: "/month",
    description: "Shared memory and emergency readiness for up to 5 people.",
    features: [
      "Everything in Pro",
      "5 connected member profiles",
      "Emergency Assistant for the family",
      "Shared document vault",
    ],
    variant: "secondary" as const,
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl mb-14 md:mb-20 mx-auto text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-semibold text-ink">
            Simple plans. No surprises.
          </h2>
          <p className="mt-4 text-ink-soft text-lg leading-relaxed">
            Start free. Upgrade when RealityOS becomes part of how you run your life.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative h-full rounded-3xl border p-8 flex flex-col ${
                  plan.featured
                    ? "border-primary/30 bg-ink text-white shadow-lift lg:-translate-y-3"
                    : "border-line bg-white shadow-card"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-mono uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}

                <h3 className={`text-lg font-semibold tracking-tight ${plan.featured ? "text-white" : "text-ink"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${plan.featured ? "text-white/70" : "text-ink-soft"}`}>
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className={plan.featured ? "text-white/60" : "text-ink-faint"}>{plan.period}</span>
                  )}
                </div>

                <ul className="mt-7 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={plan.featured ? "text-white/80 mt-0.5" : "text-primary mt-0.5"} />
                      <span className={plan.featured ? "text-white/90" : "text-ink-soft"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? "brand" : "secondary"}
                  className={`mt-8 w-full ${plan.featured ? "" : ""}`}
                >
                  {plan.price === "Free" ? "Start Free" : "Choose Plan"}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
