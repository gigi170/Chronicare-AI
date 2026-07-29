"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = { date: string; severity: number };

const previewData: ChartPoint[] = [
  { date: "Mon", severity: 3.2 }, { date: "Tue", severity: 5.4 }, { date: "Wed", severity: 4.1 },
  { date: "Thu", severity: 6.8 }, { date: "Fri", severity: 3.7 }, { date: "Sat", severity: 2.5 }, { date: "Sun", severity: 4.3 },
];

export default function SymptomChart() {
  const [data, setData] = useState<ChartPoint[]>(previewData);
  const [isPreview, setIsPreview] = useState(true);

  useEffect(() => {
    async function fetchSymptoms() {
      try {
        const res = await fetch("/api/logs/symptoms");
        if (!res.ok) return;
        const symptoms = await res.json();
        if (!Array.isArray(symptoms) || symptoms.length === 0) return;
        const aggregated = symptoms.reduce((acc: Record<string, { total: number; count: number }>, curr: { date: string; severity: number }) => {
          const date = new Date(curr.date).toLocaleDateString(undefined, { weekday: "short" });
          acc[date] ??= { total: 0, count: 0 };
          acc[date].total += curr.severity;
          acc[date].count += 1;
          return acc;
        }, {});
        const entries = Object.entries(aggregated) as [string, { total: number; count: number }][];
        setData(entries.map(([date, value]) => ({ date, severity: Number((value.total / value.count).toFixed(1)) })).slice(-7));
        setIsPreview(false);
      } catch { /* Keep the illustrative empty-state chart. */ }
    }
    fetchSymptoms();
  }, []);

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-white">4.3<span className="ml-1 text-sm font-medium text-slate-500">/ 10</span></p>
          <p className="mt-1 text-xs text-slate-500">Average symptom intensity</p>
        </div>
        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">↓ 12% this week</span>
      </div>
      <div className="h-56 w-full" aria-label="Weekly symptom severity bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="orangeBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFB340" /><stop offset="100%" stopColor="#FF7A00" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="rgba(255,255,255,.06)" />
            <XAxis dataKey="date" tick={{ fill: "#737b88", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
            <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fill: "#737b88", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(255,255,255,.025)" }} contentStyle={{ background: "#1a1d22", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "white", boxShadow: "0 16px 30px rgba(0,0,0,.4)" }} itemStyle={{ color: "#FF9500" }} />
            <Bar dataKey="severity" fill="url(#orangeBar)" radius={[7, 7, 3, 3]} maxBarSize={28} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {isPreview && <p className="mt-3 text-center text-[11px] text-slate-600">Sample view · Add logs to personalize this chart</p>}
    </div>
  );
}
