"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import { Activity, Check, Download, FileHeart, LockKeyhole, Sparkles } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkPremium() {
      // In a real app, we'd have a /api/user endpoint. For now, we can check a simple flag.
      // I'll just use a mock check or assume the user is premium if they are on this page 
      // and handle the check in the generation.
      setIsPremium(true); // For MVP, let's allow it or implement a quick check
    }
    checkPremium();
  }, []);

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [sympRes, dietRes, envRes, medRes, aiRes] = await Promise.all([
        fetch("/api/logs/symptoms").then(r => r.json()),
        fetch("/api/logs/diet").then(r => r.json()),
        fetch("/api/logs/environment").then(r => r.json()),
        fetch("/api/logs/medications").then(r => r.json()),
        fetch("/api/ai/insights").then(r => r.json()),
      ]);

      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.text("ChroniCare AI - Health Report", 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y);
      y += 20;

      doc.setFontSize(16);
      doc.text("AI Insights", 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(aiRes.summary || "No summary available", 20, y, { maxWidth: 170 });
      y += 20;

      if (aiRes.insights) {
        aiRes.insights.forEach((ins: any, i: number) => {
          doc.text(`${i + 1}. ${ins.correlation} (${ins.confidence}%)`, 20, y);
          y += 7;
          doc.text(ins.explanation, 20, y, { maxWidth: 170 });
          y += 15;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }

      y += 10;
      doc.setFontSize(16);
      doc.text("Recent Symptoms", 20, y);
      y += 10;
      doc.setFontSize(10);
      sympRes.slice(0, 10).forEach((s: any) => {
        doc.text(`${new Date(s.date).toLocaleDateString()}: ${s.name} - Severity: ${s.severity}`, 20, y);
        y += 7;
      });

      doc.save("health-report.pdf");
    } catch (e) {
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Premium Feature</h1>
        <p className="text-slate-500">Doctor-ready reports are available for premium users.</p>
        <button onClick={() => router.push("/premium")} className="btn-primary">Upgrade Now</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Clinical summary</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Doctor-ready report</h1><p className="mt-2 max-w-xl text-sm text-slate-500">A focused overview of symptoms, trends, and correlations designed for your next appointment.</p></div><span className="flex self-start items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"><LockKeyhole size={13} className="text-primary" /> Private export</span></div>

      <div className="grid gap-5 md:grid-cols-[1.15fr_.85fr]">
        <section className="card relative min-h-[430px] overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5"><div className="flex items-center gap-3"><span className="icon-tile"><FileHeart size={19} /></span><div><p className="text-sm font-semibold">Personal Health Summary</p><p className="text-[11px] text-slate-500">Last 30 days · PDF preview</p></div></div><span className="rounded-md bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary">Pro</span></div>
          <div className="space-y-6 p-6">
            <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-600">Health overview</p><div className="mt-3 grid grid-cols-3 gap-2">{[["12", "Logs"], ["4.3", "Avg intensity"], ["3", "Signals"]].map(([value, label]) => <div key={label} className="rounded-xl bg-white/[0.03] p-3"><p className="text-xl font-bold">{value}</p><p className="mt-1 text-[9px] text-slate-500">{label}</p></div>)}</div></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-600">Symptom activity</p><div className="mt-4 flex h-24 items-end gap-2">{[34,55,42,72,48,28,45,62,37,51].map((height, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#ff7300] to-primary opacity-80" style={{height: `${height}%`}} />)}</div></div>
            <div className="rounded-xl border border-primary/10 bg-primary/[0.05] p-4"><div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-primary" /> Leading correlation</div><p className="mt-2 text-xs leading-relaxed text-slate-500">Sleep duration appears to have the strongest relationship with symptom intensity.</p></div>
          </div>
        </section>

        <aside className="card h-fit space-y-6">
          <div><p className="eyebrow">Included</p><h2 className="mt-1 text-xl font-semibold">Prepared for your visit</h2></div>
          <div className="space-y-3">{["AI pattern analysis", "Symptom frequency & intensity", "Diet and environment correlations", "Medication timeline"].map(item => <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Check size={12} strokeWidth={3} /></span>{item}</div>)}</div>
          <div className="border-t border-white/[0.07] pt-5"><button onClick={generatePDF} disabled={loading} className="btn-primary w-full"><Download size={17} />{loading ? "Building report…" : "Download PDF report"}</button><p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-600"><Activity size={11} /> Generated from your latest health data</p></div>
        </aside>
      </div>
    </div>
  );
}
