"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./ui/Logo";
import Button from "./ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-line shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="container-px mx-auto max-w-7xl flex items-center justify-between h-16 md:h-[72px]">
        <a href="#home" aria-label="RealityOS home">
          <Logo />
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm text-ink-soft hover:text-ink rounded-full transition-colors duration-200 hover:bg-surface-alt"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost">Sign In</Button>
          <Button variant="brand">Get Started</Button>
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-line px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[15px] text-ink-soft hover:text-ink border-b border-line/60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-5">
            <Button variant="secondary" className="w-full">
              Sign In
            </Button>
            <Button variant="brand" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
