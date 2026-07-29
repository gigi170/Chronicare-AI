"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Check, Copy, Crown, FileText, LockKeyhole, Sparkles } from "lucide-react";

const wallet = "TR1YY19rxVAYwaJjAWfKHam3iKnB8z2gEy";

export default function PremiumPage() {
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage("");
    try {
      const res = await fetch("/api/payments/verify", { method: "POST", body: JSON.stringify({ txHash }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setMessage("Payment verified — premium is now active.");
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Verification failed"); }
    finally { setLoading(false); }
  };

  const copyWallet = async () => { await navigator.clipboard.writeText(wallet); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4 sm:py-10">
      <div className="text-center"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-black shadow-[0_0_35px_rgba(255,149,0,.25)]"><Crown size={23} /></div><p className="eyebrow">ChroniCare Pro</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Deeper clarity. Better conversations.</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">Unlock advanced intelligence and turn your health history into professional, actionable reports.</p></div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[{ icon: Sparkles, title: "AI patterns", text: "Advanced trigger correlations" }, { icon: BarChart3, title: "Full trends", text: "Long-term health analytics" }, { icon: FileText, title: "Doctor reports", text: "Clinical-ready PDF exports" }].map(({ icon: Icon, title, text }) => <div key={title} className="card text-center"><span className="icon-tile mx-auto mb-3"><Icon size={19} /></span><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div>)}
      </div>

      <section className="card relative overflow-hidden border-primary/25 p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[70px]" />
        <div className="relative mb-6 flex items-end justify-between border-b border-white/[0.07] pb-6"><div><p className="eyebrow">One-time access</p><p className="mt-2 text-lg font-semibold">Lifetime Pro membership</p></div><div className="text-right"><span className="text-4xl font-bold tracking-tight">10</span><span className="ml-1 text-sm text-slate-500">USDT</span></div></div>
        <div className="relative space-y-3">{["Unlimited AI pattern analysis", "Doctor-ready report exports", "Future premium features included"].map(item => <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Check size={12} strokeWidth={3} /></span>{item}</div>)}</div>
      </section>

      <form onSubmit={handleVerify} className="card space-y-5">
        <div><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Pay with USDT</p><p className="mt-1 text-xs text-slate-500">TRC-20 network only</p></div><LockKeyhole size={18} className="text-primary" /></div>
          <button type="button" onClick={copyWallet} className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/25 p-3 text-left font-mono text-xs text-slate-300 transition-colors hover:border-primary/25"><span className="truncate">{wallet}</span><span className="flex shrink-0 items-center gap-1.5 text-primary"><Copy size={14} />{copied ? "Copied" : "Copy"}</span></button>
        </div>
        <div><label className="mb-2 block text-xs font-semibold text-slate-400">Transaction hash</label><input type="text" className="input-field" placeholder="Paste your confirmed transaction hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} required /></div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Verifying on-chain…" : "Verify & unlock Pro"}</button>
      </form>

      {message && <div className={`rounded-xl border p-4 text-center text-sm font-medium ${message.startsWith("Payment") ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400" : "border-red-400/20 bg-red-400/10 text-red-400"}`}>{message}</div>}
    </div>
  );
}
