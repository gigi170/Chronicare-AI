# ChroniCare AI — Vercel Deployment Guide

## Quick Deploy (One Command)

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. From the project root, deploy
vercel --prod
```

Vercel will detect Next.js automatically and ask you a few setup questions.
That's it — you get a permanent URL like `https://chronicare-ai.vercel.app`.

---

## Environment Variables

After deploying, go to your Vercel dashboard → **Settings → Environment Variables**
and add these:

| Key                  | Example Value                                      | Notes                                    |
|----------------------|-----------------------------------------------------|------------------------------------------|
| `DATABASE_URL`       | `postgresql://user:pass@host:5432/dbname`          | Use a cloud Postgres (Neon, Supabase, etc.) |
| `JWT_SECRET`         | `any-random-long-string-here`                       | For session tokens                       |
| `OPENAI_API_KEY`     | `sk-...`                                            | For AI insights feature                  |

### Recommended free Postgres providers:
- **Neon** — https://neon.tech (free tier, great for Next.js)
- **Supabase** — https://supabase.com (free tier with Postgres)
- **Vercel Postgres** — built into the Vercel dashboard

---

## Custom Domain

1. Go to Vercel → your project → **Settings → Domains**
2. Add your custom domain (e.g. `chronicare.app`)
3. Update DNS as instructed by Vercel

---

## Project Structure

```
chronicare-ai/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # Backend API (auth, logs, AI, payments)
│   │   ├── auth/         # Login & signup pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── insights/     # AI pattern analysis
│   │   ├── log/          # Symptom, diet, environment logging
│   │   ├── premium/      # USDT payment verification
│   │   └── reports/      # Doctor-ready PDF reports
│   ├── components/       # Shared UI components
│   ├── db/               # Drizzle ORM schema & client
│   └── lib/              # Auth utilities
├── vercel.json           # Vercel deployment config
└── package.json
```

---

## What You Get

- ✅ **Permanent URL** via Vercel
- ✅ **Automatic HTTPS** on all deployments
- ✅ **Global CDN** for fast page loads
- ✅ **Preview deployments** on every Git push
- ✅ **Serverless API routes** — no server management
- ✅ **Environment variable encryption** for secrets
