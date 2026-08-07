# RealityOS — Landing Page

Premium marketing landing page for **RealityOS**, an AI-powered Life Operating
System. Built for the Google Build with Gemini XPRIZE Hackathon.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for scroll/entry animations
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
realityos/
├─ app/
│  ├─ layout.tsx        # Root layout, fonts, metadata
│  ├─ page.tsx           # Composes all landing sections
│  └─ globals.css        # Design tokens, aurora signature, base styles
├─ components/
│  ├─ Navbar.tsx
│  ├─ Hero.tsx
│  ├─ Features.tsx        # Bento grid of 5 feature cards
│  ├─ HowItWorks.tsx       # 3-step process
│  ├─ DemoPreview.tsx      # Fake dashboard mockup
│  ├─ Pricing.tsx
│  ├─ AboutCta.tsx
│  ├─ Footer.tsx
│  └─ ui/
│     ├─ Button.tsx
│     ├─ Logo.tsx
│     └─ Reveal.tsx        # Scroll-reveal animation wrapper
├─ lib/
│  └─ utils.ts             # `cn` classname helper
├─ tailwind.config.ts       # Design tokens: colors, fonts, animation
└─ package.json
```

## Design system

- **Colors**: white surfaces, near-black ink (`#0B0B14`), indigo→purple brand
  gradient (`#4F46E5` → `#9333EA`).
- **Type**: Inter Tight (display) + Inter (body) + JetBrains Mono (eyebrows,
  labels, data).
- **Signature element**: the "aurora" — a slow-drifting blurred gradient mesh
  behind the hero and closing CTA, representing RealityOS's ambient,
  always-on understanding of your life.
- Respects `prefers-reduced-motion`.

## Notes

- All copy is placeholder/demo content — swap in real product copy, auth
  flows, and Stripe/pricing integration before shipping.
- Nav links point to in-page anchors (`#features`, `#how-it-works`, etc.).
