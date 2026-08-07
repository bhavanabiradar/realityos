import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "brand" | "secondary" | "ghost";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base = "text-sm font-medium tracking-tight transition-all duration-300 ease-out";

  const variants = {
    primary: "btn-primary",
    brand: "btn-primary-brand",
    secondary: "btn-secondary",
    ghost:
      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-ink-soft hover:text-ink hover:bg-surface-alt",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
