interface ProgressRingProps {
  value: number;
  label: string;
  detail: string;
  size?: number;
}

export default function ProgressRing({ value, label, detail, size = 116 }: ProgressRingProps) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value}%`}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={radius} fill="none" stroke="#FF9500" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1)", filter: "drop-shadow(0 0 5px rgba(255,149,0,.45))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-white">{value}%</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">score</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
