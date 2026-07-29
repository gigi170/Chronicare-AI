import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, LockKeyhole, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden py-8 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <section className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-xs font-semibold text-primary"><Sparkles size={13} /> AI-powered personal health intelligence</div>
        <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl">Understand your body.<br /><span className="bg-gradient-to-r from-primary via-[#ffb84d] to-primary bg-clip-text text-transparent">Live with clarity.</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">Turn everyday symptoms, meals, sleep, and medication into meaningful patterns you can act on—and confidently share with your doctor.</p>
        <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
          <Link href="/auth/signup" className="btn-primary flex-1">Start tracking free <ArrowRight size={17} /></Link>
          <Link href="/auth/login" className="btn-secondary flex-1">Sign in</Link>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Check size={13} className="text-primary" /> Simple daily logging</span><span className="flex items-center gap-1.5"><LockKeyhole size={13} className="text-primary" /> Private by design</span><span className="flex items-center gap-1.5"><Check size={13} className="text-primary" /> Cancel anytime</span></div>
      </section>

      <section className="relative mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
        {[{ value: "82%", label: "Health balance", sub: "Up 9% this month" }, { value: "3", label: "Patterns found", sub: "Powered by your data" }, { value: "7.4h", label: "Sleep average", sub: "Strong consistency" }].map((item, index) => (
          <div key={item.label} className={`card text-left ${index === 1 ? "border-primary/20 orange-glow" : ""}`}><p className="text-3xl font-bold tracking-tight text-white">{item.value}</p><p className="mt-2 text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.sub}</p></div>
        ))}
      </section>

      <section className="relative mx-auto mt-4 max-w-3xl rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#171a20] to-[#0d0f12] p-6 sm:flex sm:items-center sm:gap-6">
        <div className="icon-tile mb-4 shrink-0 sm:mb-0"><BrainCircuit size={21} /></div>
        <div className="text-left"><p className="text-sm font-semibold text-white">Insight, not medical advice</p><p className="mt-1 text-xs leading-relaxed text-slate-500">ChroniCare is a tracking and pattern-recognition tool. It does not diagnose or treat conditions. Always consult a qualified healthcare professional.</p></div>
      </section>
    </div>
  );
}
