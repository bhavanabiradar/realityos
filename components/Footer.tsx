import Logo from "./ui/Logo";
import { Twitter, Github, Linkedin, Link } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "How it Works", "Pricing", "Demo"],
  },
  {
    title: "Company",
    links: ["About", "Hackathon Story", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Privacy Policy", "Terms of Service", "Security"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-xs">
              The AI Life Operating System that understands your documents, memories,
              and tasks — and helps you decide what's next.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:text-primary hover:border-primary/30"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-faint mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink-soft hover:text-ink transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} RealityOS. Built for the Google Build with
            Gemini XPRIZE Hackathon.
          </p>
          <p className="text-xs text-ink-faint font-mono">Made with Next.js · Gemini</p>
        </div>
      </div>
    </footer>
  );
}
<div className="flex items-center justify-center gap-6 text-xs text-neutral-500">
  <Link href="/privacy" className="hover:text-neutral-300 transition">
    Privacy Policy
  </Link>
  <span>•</span>
  <Link href="/terms" className="hover:text-neutral-300 transition">
    Terms of Service
  </Link>
</div>