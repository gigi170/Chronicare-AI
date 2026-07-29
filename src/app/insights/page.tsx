"use client";

import { useEffect, useState } from "react";
import { AlertCircle, BrainCircuit, RefreshCw, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

type Insight = { correlation: string; confidence: number; explanation: string };
type InsightResult = { insights: Insight[]; summary: string };

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/ai/insights");
        if (!res.ok) throw new Error("We couldn't complete the analysis yet.");
        setInsights(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis unavailable");
      } finally { setLoading(false); }
    }
    fetchInsights();
  }, []);

  if (loading) return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="relative mb-6"><div className="h-20 w-20 animate-spin rounded-full border-2 border-white/[0.06] border-t-primary" /><BrainCircuit className="absolute inset-0 m-auto text-primary" size={26} /></div>
      <p className="eyebrow">AI analysis in progress</p><h1 className="mt-2 text-2xl font-semibold">Connecting your health signals</h1><p className="mt-2 text-sm text-slate-500">Reviewing the last 30 days of your private logs.</p>
    </div>
  );

  if (error || !insights?.insights) return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center">
      <span className="icon-tile mb-5"><AlertCircle size={21} /></span><h1 className="text-2xl font-semibold">More data creates better insights</h1><p className="mt-3 text-sm leading-relaxed text-slate-500">{error || "Keep logging symptoms and daily factors. We'll surface meaningful patterns as your history grows."}</p><button onClick={() => window.location.reload()} className="btn-secondary mt-6"><RefreshCw size={16} /> Run analysis again</button>
    </div>
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2"><Sparkles size={14} className="text-primary" /><p className="eyebrow">Personal intelligence</p></div><h1 className="text-3xl font-bold tracking-tight">Your health patterns</h1><p className="mt-2 text-sm text-slate-500">AI analysis based on your last 30 days.</p></div><span className="self-start rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">Analysis complete</span></div>

      <section className="card relative overflow-hidden border-primary/15 bg-[linear-gradient(135deg,rgba(255,149,0,.09),rgba(17,19,24,.9)_45%)] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />
        <div className="relative flex gap-4"><span className="icon-tile shrink-0"><BrainCircuit size={21} /></span><div><p className="eyebrow">30-day summary</p><p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-200">{insights.summary}</p></div></div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Top correlations</p><h2 className="mt-1 text-xl font-semibold">Signals worth watching</h2></div><TrendingUp size={19} className="text-primary" /></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {insights.insights.map((insight, idx) => (
            <article key={`${insight.correlation}-${idx}`} className="card flex flex-col transition-all hover:-translate-y-0.5 hover:border-primary/25">
              <div className="mb-5 flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">0{idx + 1}</span><span className="text-sm font-bold text-primary">{insight.confidence}%</span></div>
              <h3 className="font-semibold leading-snug text-white">{insight.correlation}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{insight.explanation}</p>
              <div className="mt-6"><div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600"><span>Confidence</span><span>{insight.confidence >= 75 ? "Strong" : "Emerging"}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#ff7300] to-primary transition-all duration-1000" style={{ width: `${insight.confidence}%` }} /></div></div>
            </article>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-xs leading-relaxed text-slate-500"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-primary" /><p><span className="font-semibold text-slate-300">Designed for informed conversations.</span> These correlations are not a diagnosis or medical advice. Discuss meaningful changes with your healthcare professional.</p></div>
    </div>
  );
}
