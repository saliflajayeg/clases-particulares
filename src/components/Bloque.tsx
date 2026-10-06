export function Bloque({ n, titulo, sub, children }: { n: string; titulo: string; sub?: string; children: React.ReactNode }) {
  return (
    <fieldset className="card min-w-0 space-y-5 p-6 sm:p-8">
      <legend className="sr-only">{titulo}</legend>
      <div>
        <h2 className="flex items-center gap-3 text-lg font-bold">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-verde-soft text-sm text-verde">{n}</span>
          {titulo}
        </h2>
        {sub && <p className="ml-11 mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </fieldset>
  );
}
