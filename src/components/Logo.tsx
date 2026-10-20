import Image from "next/image";

export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return <Image src="/logo-sm.png" alt="" width={160} height={160} priority className={`${className} shrink-0`} />;
}

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[19px] font-bold tracking-tight ${claro ? "text-white" : "text-ink"}`}>Clases Particulares</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.25em] text-sol">
          <span className="h-px w-4 bg-sol" />GE<span className="h-px w-4 bg-sol" />
        </span>
      </span>
    </span>
  );
}
