"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm py-8 sm:py-14">
      <div className="mb-7 text-center"><p className="eyebrow">Private health intelligence</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Your health timeline is ready when you are.</p></div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        New to ChroniCare? <Link href="/auth/signup" className="font-semibold text-primary hover:text-primary-hover">Create an account</Link>
      </div>
    </div>
  );
}
