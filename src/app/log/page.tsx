"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CalendarDays, CloudSun, Pill, Salad, ShieldCheck } from "lucide-react";

type LogType = "symptom" | "diet" | "environment" | "medication";

export default function LogPage() {
  const [type, setType] = useState<LogType>("symptom");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    severity: 5,
    duration: "",
    food: "",
    ingredients: "",
    timing: "",
    factor: "Stress",
    value: "",
    medName: "",
    dosage: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = "";
      let body: any = { ...form };

      if (type === "symptom") {
        endpoint = "/api/logs/symptoms";
        body = { name: form.name, severity: Number(form.severity), duration: Number(form.duration), notes: form.notes, date: form.date };
      } else if (type === "diet") {
        endpoint = "/api/logs/diet";
        body = { food: form.food, ingredients: form.ingredients, timing: form.timing, notes: form.notes, date: form.date };
      } else if (type === "environment") {
        endpoint = "/api/logs/environment";
        body = { factor: form.factor, value: form.value, notes: form.notes, date: form.date };
      } else {
        endpoint = "/api/logs/medications";
        body = { medName: form.medName, dosage: form.dosage, timing: form.timing, notes: form.notes, date: form.date };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Logging failed");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      alert("Error saving log");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-5xl">✅</div>
      <h1 className="text-2xl font-bold">Logged Successfully!</h1>
      <p className="text-slate-500">Redirecting to dashboard...</p>
    </div>
  );

  const typeIcons = { symptom: Activity, diet: Salad, environment: CloudSun, medication: Pill };

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <div className="flex items-end justify-between">
        <div><p className="eyebrow">Daily check-in</p><h1 className="mt-1 text-3xl font-bold tracking-tight">How are you feeling?</h1><p className="mt-2 text-sm text-slate-500">Small details help reveal meaningful patterns.</p></div>
        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><ShieldCheck size={15} className="text-primary" /> Private & secure</div>
      </div>
      
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5">
        {(["symptom", "diet", "environment", "medication"] as LogType[]).map((t) => {
          const Icon = typeIcons[t];
          return (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-[10px] font-semibold transition-all sm:text-xs ${
              type === t ? "bg-primary text-black shadow-[0_6px_24px_rgba(255,149,0,.16)]" : "text-slate-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        )})}
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4"><span className="icon-tile"><CalendarDays size={18} /></span><div><p className="text-sm font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} details</p><p className="text-xs text-slate-500">Fields marked required help improve analysis</p></div></div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="input-field"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>

        {type === "symptom" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Symptom Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Headache, Bloating"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Severity (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="input-field"
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (min)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="30"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {type === "diet" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Food/Drink</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Greek Yogurt with Berries"
                value={form.food}
                onChange={(e) => setForm({ ...form, food: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ingredients</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Dairy, Strawberries, Honey"
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timing</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Breakfast, 8:00 AM"
                value={form.timing}
                onChange={(e) => setForm({ ...form, timing: e.target.value })}
              />
            </div>
          </>
        )}

        {type === "environment" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Factor</label>
              <select
                className="input-field"
                value={form.factor}
                onChange={(e) => setForm({ ...form, factor: e.target.value })}
              >
                <option value="Stress">Stress</option>
                <option value="Sleep">Sleep</option>
                <option value="Weather">Weather</option>
                <option value="Activity">Physical Activity</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value/Detail</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. High, 6 hours, Rainy"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
              />
            </div>
          </>
        )}

        {type === "medication" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Ibuprofen"
                value={form.medName}
                onChange={(e) => setForm({ ...form, medName: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dosage</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 200mg"
                  value={form.dosage}
                  onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timing</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. After lunch"
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            className="input-field h-24 resize-none"
            placeholder="Any additional details..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Log Entry"}
        </button>
      </form>
    </div>
  );
}
