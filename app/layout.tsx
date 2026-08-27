import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppearanceProvider } from "@/components/providers/AppearanceProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RealityOS | Your Life, Integrated",
  description: "The intelligent operating system for your digital life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AppearanceProvider>
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-70 blur-[120px] animate-mesh" style={{ background: "var(--glow)" }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-70 blur-[120px] animate-mesh [animation-delay:2s]" style={{ background: "var(--secondary)" }} />
          </div>

          <div className="relative z-10 isolate">{children}</div>
        </AppearanceProvider>
      </body>
    </html>
  );
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};