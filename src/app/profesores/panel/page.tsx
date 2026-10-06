import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logoutProfesor } from "@/app/actions";
import { read } from "@/lib/db";
import { getSession } from "@/lib/session";
import { WHATSAPP, cursoNombre, ramaNombre } from "@/lib/constants";

export const metadata: Metadata = { title: "Mi panel" };
export const dynamic = "force-dynamic";

const ESTADO = {
  pendiente: { t: "En revisión", c: "bg-sol/20 text-[#8a5a00]", d: "Estamos revisando tus documentos. Te llamaremos por WhatsApp para una breve entrevista en 48–72 h." },
  aprobado: { t: "Perfil aprobado", c: "bg-verde-soft text-verde", d: "¡Bienvenido al equipo! Ya puedes recibir alumnos. Te avisaremos por WhatsApp de cada nueva asignación." },
  rechazado: { t: "No aprobado", c: "bg-rojo/10 text-rojo", d: "Ahora mismo no podemos aprobar tu perfil. Escríbenos por WhatsApp si quieres más información." },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ nuevo?: string }> }) {
  const id = await getSession("profe");
  if (!id) redirect("/profesores/acceso");
  const db = await read();
  const p = db.profesores.find((x) => x.id === id);
  if (!p) redirect("/profesores/acceso");
  const { nuevo } = await searchParams;
  const asignadas = db.solicitudes.filter((s) => s.profesorId === p.id && s.estado !== "cerrada");
  const e = ESTADO[p.estado];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {nuevo && (
        <div className="mb-6 rounded-2xl bg-verde p-5 text-white">
          <b>¡Registro completado!</b> Hemos recibido tu perfil y tus documentos.
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {p.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/docs/${p.foto}`} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-verde-soft font-display text-2xl text-verde">{p.nombre[0]}</span>
          )}
          <div>
            <h1 className="font-display text-3xl font-semibold">Hola, {p.nombre.split(" ")[0]}</h1>
            <p className="text-muted">{p.ciudad}{p.barrio && ` · ${p.barrio}`}</p>
          </div>
        </div>
        <form action={logoutProfesor}><button className="btn btn-claro !py-2 text-sm">Cerrar sesión</button></form>
      </div>

      <div className="card mt-8 p-6">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${e.c}`}>{e.t}</span>
        <p className="mt-3 text-muted">{e.d}</p>
      </div>

      <h2 className="mt-10 text-xl font-bold">Mis alumnos asignados</h2>
      {asignadas.length === 0 ? (
        <p className="card mt-3 p-6 text-muted">Todavía no tienes alumnos asignados.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {asignadas.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <b>{s.alumno || s.nombre} · {cursoNombre(s.curso)}{s.rama && ` (${ramaNombre(s.rama)})`}</b>
                <span className="text-sm text-muted">🏠 {s.ciudad}{s.barrio && `, ${s.barrio}`}{s.referencia && ` (${s.referencia})`}</span>
              </div>
              <p className="mt-1 text-sm">{s.materias.join(", ")} · {s.sesionesSemana} clases/semana · {s.franjas.join(", ") || "horario a convenir"}</p>
              {s.objetivo && <p className="mt-2 text-sm text-muted">“{s.objetivo}”</p>}
              <p className="mt-3 text-sm">Contacto: <b>{s.nombre}</b> · <a className="font-semibold text-verde" href={`https://wa.me/${s.telefono.replace("+", "")}`}>{s.telefono}</a></p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-xl font-bold">Mi perfil</h2>
      <div className="card mt-3 divide-y divide-line">
        {p.materias.map((m) => (
          <div key={m.materia} className="p-5">
            <b>{m.materia}</b> <span className="text-sm text-muted">· {m.cursos.map(cursoNombre).join(", ")}</span>
            <p className="mt-1 text-xs text-muted">🎓 {m.titulo}</p>
            <p className="mt-1 text-sm text-muted">{m.motivo}</p>
          </div>
        ))}
        <div className="p-5 text-sm">
          <b>Documentos enviados:</b> {p.docs.map((d) => d.nombre).join(" · ")}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        ¿Quieres cambiar algo de tu perfil? <a className="font-semibold text-verde" href={`https://wa.me/${WHATSAPP}`}>Escríbenos por WhatsApp</a>.
      </p>
    </div>
  );
}
