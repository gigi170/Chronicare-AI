import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BrainCircuit, FileText, Plus, ShieldCheck, Sparkles } from "lucide-react";
import SymptomChart from "@/components/SymptomChart";
import ProgressRing from "@/components/ProgressRing";

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) redirect("/auth/login");

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary pulse-soft" /><p className="eyebrow">Daily overview</p></div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Good evening.</h1>
          <p className="mt-2 text-sm text-slate-500">Your health signals are moving in the right direction.</p>
        </div>
        <Link href="/log" className="btn-primary self-start sm:self-auto"><Plus size={18} /> Add today&apos;s log</Link>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
        <div className="card overflow-hidden p-0">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow">Weekly trend</p><h2 className="mt-1 text-lg font-semibold text-white">Symptom intensity</h2></div>
              <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-slate-400">Last 7 days</span>
            </div>
          </div>
          <div className="p-5"><SymptomChart /></div>
        </div>

        <div className="card flex flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#171a20,#0f1115)]">
          <div className="flex items-center justify-between"><div><p className="eyebrow">Health balance</p><h2 className="mt-1 text-lg font-semibold">Today&apos;s scores</h2></div><ShieldCheck className="text-primary" size={22} /></div>
          <div className="my-7 grid grid-cols-2 gap-3">
            <ProgressRing value={82} label="Sleep" detail="7h 42m" size={112} />
            <ProgressRing value={68} label="Stability" detail="Improving" size={112} />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-400"><span className="font-semibold text-white">Strong recovery.</span> Your sleep consistency is 9% above your monthly average.</div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Personal intelligence</p><h2 className="mt-1 text-xl font-semibold">Go deeper</h2></div><Sparkles size={19} className="text-primary" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/insights" className="card group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/30">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-start gap-4"><span className="icon-tile"><BrainCircuit size={20} /></span><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold">AI Pattern Analysis</h3><ArrowRight size={17} className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div><p className="mt-1.5 text-sm leading-relaxed text-slate-500">Discover hidden links between symptoms, sleep, stress, and diet.</p><span className="mt-4 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">3 new signals</span></div></div>
          </Link>
          <Link href="/reports" className="card group transition-all hover:-translate-y-0.5 hover:border-primary/30">
            <div className="flex items-start gap-4"><span className="icon-tile"><FileText size={20} /></span><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold">Clinical Report</h3><ArrowRight size={17} className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div><p className="mt-1.5 text-sm leading-relaxed text-slate-500">Turn your history into a concise, doctor-ready health summary.</p><span className="mt-4 inline-flex rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF export</span></div></div>
          </Link>
        </div>
      </section>
    </div>
  );
}
