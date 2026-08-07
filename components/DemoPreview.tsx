import {
  Home,
  Brain,
  FileText,
  CalendarClock,
  Compass,
  Search,
  Bell,
  TrendingUp,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import Reveal from "./ui/Reveal";

const SIDEBAR = [
  { Icon: Home, label: "Home", active: true },
  { Icon: Brain, label: "Memory" },
  { Icon: FileText, label: "Documents" },
  { Icon: CalendarClock, label: "Planner" },
  { Icon: Compass, label: "Decisions" },
];

const STATS = [
  { label: "Life Score", value: "82", suffix: "/100", trend: "+4 this week" },
  { label: "Tasks Today", value: "6", suffix: "", trend: "2 completed" },
  { label: "Documents Indexed", value: "214", suffix: "", trend: "12 added" },
];

const MEMORY_ITEMS = [
  { text: "Renewing passport before the Tokyo trip in March", tag: "Travel" },
  { text: "Mom's cardiology follow-up moved to next Thursday", tag: "Family" },
  { text: "Saving for a down payment — target set for Q3", tag: "Finance" },
];

const TASKS = [
  { text: "Review apartment lease before signing", done: true },
  { text: "Send insurance documents to accountant", done: true },
  { text: "Prep questions for Thursday's doctor visit", done: false },
  { text: "Compare flight options for Tokyo trip", done: false },
];

export default function DemoPreview() {
  return (
    <section className="relative py-24 md:py-32 bg-surface-alt overflow-hidden">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <span className="eyebrow">Inside RealityOS</span>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-semibold text-ink">
            A calm, single view of everything that matters.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-x-10 -inset-y-10 bg-radial-fade blur-3xl -z-10" />

          <div className="rounded-[1.75rem] border border-line bg-white shadow-lift overflow-hidden">
            {/* browser chrome */}
            <div className="flex items-center gap-2 border-b border-line bg-surface-alt/60 px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ED6A5E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F4BF4F]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#61C554]" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-full bg-white border border-line px-4 py-1 text-xs text-ink-faint font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                app.realityos.ai/home
              </div>
            </div>

            <div className="flex">
              {/* sidebar */}
              <div className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-line bg-surface-alt/40 p-5">
                <div className="flex flex-col gap-1">
                  {SIDEBAR.map(({ Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-white shadow-soft text-ink border border-line"
                          : "text-ink-soft hover:bg-white/60"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2} className={active ? "text-primary" : ""} />
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-auto rounded-2xl bg-brand-gradient p-4 text-white">
                  <Sparkles size={16} className="mb-2" />
                  <p className="text-xs leading-relaxed opacity-95">
                    RealityOS noticed a scheduling conflict next Thursday.
                  </p>
                </div>
              </div>

              {/* main */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-faint">
                      Wednesday, Aug 5
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-ink tracking-tight">
                      Good evening, Alex
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft">
                      <Search size={15} />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft">
                      <Bell size={15} />
                    </div>
                    <div className="h-9 w-9 rounded-full bg-brand-gradient" />
                  </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-line p-4">
                      <p className="text-xs text-ink-faint">{stat.label}</p>
                      <p className="mt-1.5 text-2xl font-semibold text-ink tracking-tight">
                        {stat.value}
                        <span className="text-sm text-ink-faint font-normal">{stat.suffix}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <TrendingUp size={11} />
                        {stat.trend}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  {/* memory timeline */}
                  <div className="lg:col-span-3 rounded-2xl border border-line p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain size={15} className="text-primary" />
                      <p className="text-sm font-semibold text-ink">Recent memory</p>
                    </div>
                    <div className="space-y-4">
                      {MEMORY_ITEMS.map((item) => (
                        <div key={item.text} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                          <div>
                            <p className="text-sm text-ink leading-snug">{item.text}</p>
                            <span className="mt-1 inline-block text-[10px] font-mono uppercase tracking-wide text-primary/70 bg-primary/5 rounded-full px-2 py-0.5">
                              {item.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* tasks */}
                  <div className="lg:col-span-2 rounded-2xl border border-line p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarClock size={15} className="text-primary" />
                      <p className="text-sm font-semibold text-ink">Today's plan</p>
                    </div>
                    <div className="space-y-3.5">
                      {TASKS.map((task) => (
                        <div key={task.text} className="flex items-start gap-2.5">
                          {task.done ? (
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                          ) : (
                            <Circle size={16} className="mt-0.5 flex-shrink-0 text-line" />
                          )}
                          <p
                            className={`text-sm leading-snug ${
                              task.done ? "text-ink-faint line-through" : "text-ink"
                            }`}
                          >
                            {task.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
