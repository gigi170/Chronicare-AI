"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, FileText, LayoutDashboard, Plus } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/log", label: "Log", icon: Plus },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090b]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="ChroniCare home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-black shadow-[0_0_24px_rgba(255,149,0,0.2)]">
              <Activity size={20} strokeWidth={2.5} />
            </span>
            <span className="text-[17px] font-bold tracking-tight text-white">ChroniCare<span className="text-primary">.</span></span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                  <Icon size={16} />{label}
                </Link>
              );
            })}
          </nav>
          <Link href="/premium" className="hidden rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:block">PRO</Link>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-[#111318]/95 p-1.5 shadow-2xl backdrop-blur-xl sm:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-all ${active ? "bg-primary text-black" : "text-slate-500 hover:text-white"}`}>
                <Icon size={19} strokeWidth={active ? 2.5 : 2} />{label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
