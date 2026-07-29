import type { Metadata } from "next";
import "./globals.css";
import AppNavigation from "@/components/AppNavigation";

export const metadata: Metadata = {
  title: "ChroniCare AI — Personalized Health Intelligence",
  description: "Private, AI-powered health tracking and personalized chronic condition insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppNavigation />
        <main className="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-5xl px-4 py-7 pb-28 sm:px-6 sm:py-10 sm:pb-10">
          {children}
        </main>
        <footer className="hidden border-t border-white/[0.05] px-4 py-6 text-center text-xs text-slate-600 sm:block">
          Your data, your control. © 2026 ChroniCare AI.
        </footer>
      </body>
    </html>
  );
}
