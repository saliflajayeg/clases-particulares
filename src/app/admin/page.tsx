import type { Metadata } from "next";
import Link from "next/link";
import { asignarProfesor, estadoProfesor, estadoSolicitud, loginAdmin, logoutAdmin } from "@/app/actions";
import { LoginForm } from "@/components/LoginForm";
import { read, type Profesor, type Solicitud } from "@/lib/db";
import { getSession } from "@/lib/session";
import { cursoNombre, fcfa, ramaNombre } from "@/lib/constants";

export const metadata: Metadata = { title: "Administración", robots: { index: false } };
export const dynamic = "force-dynamic";

const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const SOL_ESTADOS: Record<Solicitud["estado"], string> = { nueva: "Nueva", asignada: "Asignada", en_curso: "En curso", cerrada: "Cerrada" };
const SOL_COLOR: Record<Solicitud["estado"], string> = {
  nueva: "bg-rojo/10 text-rojo",
  asignada: "bg-sol/20 text-[#8a5a00]",
  en_curso: "bg-verde-soft text-verde",
  cerrada: "bg-line text-muted",
};
const PRO_COLOR: Record<Profesor["estado"], string> = { pendiente: "bg-sol/20 text-[#8a5a00]", aprobado: "bg-verde-soft text-verde", rechazado: "bg-rojo/10 text-rojo" };

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if ((await getSession("admin")) !== "1")
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="card p-8">
          <h1 className="mb-6 font-display text-3xl font-semibold">Administración</h1>
          <LoginForm action={loginAdmin} conEmail={false} boton="Entrar" />
        </div>
      </div>
    );

  const { tab = "solicitudes" } = await searchParams;
  const db = await read();
  const aprobados = db.profesores.filter((p) => p.estado === "aprobado");
  const pendientes = db.profesores.filter((p) => p.estado === "pendiente").length;
  const nuevas = db.solicitudes.filter((s) => s.estado === "nueva").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold">Panel de control</h1>
        <form action={logoutAdmin}><button className="btn btn-claro !py-2 text-sm">Salir</button></form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat n={nuevas} t="Solicitudes nuevas" />
        <Stat n={db.solicitudes.filter((s) => s.estado === "en_curso").length} t="Clases en curso" />
        <Stat n={pendientes} t="Profesores por revisar" />
        <Stat n={aprobados.length} t="Profesores aprobados" />
      </div>

      <div className="mt-8 flex gap-2 border-b border-line">
        <Tab href="/admin?tab=solicitudes" on={tab === "solicitudes"}>Solicitudes ({db.solicitudes.length})</Tab>
        <Tab href="/admin?tab=profesores" on={tab === "profesores"}>Profesores ({db.profesores.length})</Tab>
      </div>

      {tab === "solicitudes" ? (
        <div className="mt-6 space-y-4">
          {db.solicitudes.length === 0 && <p className="card p-6 text-muted">Aún no hay solicitudes.</p>}
          {db.solicitudes.map((s) => {
            // Candidatos: aprobados que imparten alguna de las asignaturas EN ese curso.
            // Orden: más asignaturas cubiertas, luego misma ciudad.
            const cubre = (p: Profesor) => p.materias.filter((m) => s.materias.includes(m.materia) && m.cursos.includes(s.curso)).length;
            const candidatos = aprobados
              .filter((p) => cubre(p) > 0)
              .sort((a, b) => cubre(b) - cubre(a) || Number(b.ciudad === s.ciudad) - Number(a.ciudad === s.ciudad));
            const asignado = db.profesores.find((p) => p.id === s.profesorId);
            return (
              <div key={s.id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${SOL_COLOR[s.estado]}`}>{SOL_ESTADOS[s.estado]}</span>
                      <span className="text-xs text-muted">#{s.id.slice(0, 6).toUpperCase()} · {fecha(s.creado)}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{s.materias.join(", ")} — {cursoNombre(s.curso)}{s.rama && ` (${ramaNombre(s.rama)})`}</h3>
                    <p className="text-sm text-muted">
                      🏠 {s.ciudad}{s.barrio && `, ${s.barrio}`}{s.referencia && ` (${s.referencia})`} · {s.sesionesSemana}/semana · {s.franjas.join(", ") || "horario libre"}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <b>{s.nombre}</b> <span className="text-muted">({s.quien === "padre" ? `familia de ${s.alumno || "—"}` : "estudiante"})</span>
                    <div>
                      <a className="font-semibold text-verde" href={`https://wa.me/${s.telefono.replace("+", "")}`}>WhatsApp {s.telefono}</a>
                    </div>
                  </div>
                </div>
                {s.objetivo && <p className="mt-3 rounded-xl bg-cream px-4 py-2 text-sm">“{s.objetivo}”</p>}
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <form action={asignarProfesor} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <div>
                      <label className="label !text-xs">Profesor asignado</label>
                      <select name="profesorId" defaultValue={s.profesorId ?? ""} className="field !py-2 text-sm">
                        <option value="">— Sin asignar —</option>
                        {candidatos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} · {p.ciudad} · {cubre(p)}/{s.materias.length} asig.{p.tarifa ? ` · ${fcfa(p.tarifa)}/h` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className="btn btn-verde !px-4 !py-2 text-sm">Asignar</button>
                  </form>
                  <form action={estadoSolicitud} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <select name="estado" defaultValue={s.estado} className="field !py-2 text-sm">
                      {Object.entries(SOL_ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button className="btn btn-claro !px-4 !py-2 text-sm">Cambiar estado</button>
                  </form>
                </div>
                {candidatos.length === 0 && <p className="mt-2 text-xs text-rojo">No hay profesores aprobados que impartan estas asignaturas en este curso.</p>}
                {asignado && (
                  <p className="mt-3 text-sm">
                    Avisar al profesor:{" "}
                    <a
                      className="font-semibold text-verde"
                      href={`https://wa.me/${asignado.telefono.replace("+", "")}?text=${encodeURIComponent(
                        `Hola ${asignado.nombre.split(" ")[0]}, te hemos asignado un alumno en Clases Particulares GE: ${s.materias.join(", ")} (${cursoNombre(s.curso)}), clases a domicilio en ${s.ciudad}${s.barrio ? ", " + s.barrio : ""}${s.referencia ? " (" + s.referencia + ")" : ""}. Contacto: ${s.nombre} ${s.telefono}.`,
                      )}`}
                    >
                      WhatsApp a {asignado.nombre}
                    </a>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {db.profesores.length === 0 && <p className="card p-6 text-muted">Aún no hay profesores registrados.</p>}
          {db.profesores.map((p) => (
            <details key={p.id} className="card group p-6" open={p.estado === "pendiente"}>
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4">
                {p.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/docs/${p.foto}`} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-verde-soft font-bold text-verde">{p.nombre[0]}</span>
                )}
                <div className="flex-1">
                  <b>{p.nombre}</b> <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${PRO_COLOR[p.estado]}`}>{p.estado}</span>
                  <p className="text-sm text-muted">
                    {p.materias.map((m) => m.materia).join(", ")} · {p.ciudad} · {p.experienciaAnios} años exp. {p.tarifa ? `· ${fcfa(p.tarifa)}/h` : ""}
                  </p>
                </div>
                <span className="text-xs text-muted">{fecha(p.creado)}</span>
              </summary>
              <div className="mt-5 grid gap-6 border-t border-line pt-5 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-4 text-sm">
                  <p><b>Titulación:</b> {p.titulacion}</p>
                  {p.presentacion && <p><b>Presentación:</b> {p.presentacion}</p>}
                  {p.experiencia && <p><b>Experiencia:</b> {p.experiencia}</p>}
                  {p.materias.map((m) => (
                    <div key={m.materia} className="rounded-xl bg-cream p-4">
                      <b>{m.materia}</b> <span className="text-muted">· {m.cursos.map(cursoNombre).join(", ")}</span>
                      <p className="mt-1 text-xs"><b>🎓 Título:</b> {m.titulo}</p>
                      <p className="mt-1">{m.motivo}</p>
                    </div>
                  ))}
                  <p className="text-muted">
                    🏠 Se desplaza a: {p.zonas || "—"} · {p.franjas.join(", ") || "sin horario indicado"}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-sm">
                    <p><b>Email:</b> {p.email}</p>
                    <p><b>Teléfono:</b> <a className="text-verde" href={`https://wa.me/${p.telefono.replace("+", "")}`}>{p.telefono}</a></p>
                    <p><b>Zona:</b> {p.ciudad}{p.barrio && `, ${p.barrio}`}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-bold">Documentos</p>
                    <ul className="space-y-1.5">
                      {p.docs.map((d) => (
                        <li key={d.id}>
                          <a href={`/docs/${d.id}`} target="_blank" className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm hover:border-verde">
                            <span>{d.tipo === "cv" ? "📄 CV" : "🎓 Certificado"}</span>
                            <span className="truncate text-muted">{d.nombre}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form action={estadoProfesor} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <button name="estado" value="aprobado" className="btn btn-verde !px-4 !py-2 text-sm">✓ Aprobar</button>
                    <button name="estado" value="rechazado" className="btn !px-4 !py-2 text-sm text-rojo ring-1 ring-rojo/30">Rechazar</button>
                    {p.estado !== "pendiente" && <button name="estado" value="pendiente" className="btn btn-claro !px-4 !py-2 text-sm">Volver a pendiente</button>}
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ n, t }: { n: number; t: string }) {
  return (
    <div className="card p-5">
      <p className="font-display text-3xl font-semibold">{n}</p>
      <p className="text-sm text-muted">{t}</p>
    </div>
  );
}

function Tab({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold ${on ? "border-verde text-verde" : "border-transparent text-muted hover:text-ink"}`}>
      {children}
    </Link>
  );
}
