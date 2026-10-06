export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#0f7a3d" />
      <path d="M0 27h40v13H0z" fill="#d6312a" />
      <path d="M0 23h40v4H0z" fill="#fff" />
      <path d="M0 0l15 20L0 40z" fill="#1e5aa8" />
      <path d="M17 11.5l11-4 11 4-11 4z" fill="#fff" />
      <path d="M22 14v4.2c0 1.6 2.7 2.8 6 2.8s6-1.2 6-2.8V14l-6 2.2z" fill="#fff" />
      <path d="M38 12v6" stroke="#f3b229" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[22px] font-semibold tracking-tight">
        Profe<span className="text-verde">GE</span>
      </span>
    </span>
  );
}
