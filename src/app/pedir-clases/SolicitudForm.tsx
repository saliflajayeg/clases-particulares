"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { crearSolicitud } from "../actions";
import { Bloque } from "@/components/Bloque";
import { CIUDADES, CURSOS, DEMO, FRANJAS, RAMAS, TRONCALES, WHATSAPP, asignaturasDe, cursoNombre, esBach, ramaNombre } from "@/lib/constants";

export function SolicitudForm() {
  const params = useSearchParams();
  const cursoInicial = params.get("curso") ?? undefined;
  const asignaturaInicial = params.get("asignatura") ?? undefined;
  const [state, action, pending] = useActionState(crearSolicitud, undefined);
  const [resumen, setResumen] = useState("");
  const [curso, setCurso] = useState(CURSOS.some((c) => c.id === cursoInicial) ? cursoInicial! : "");
  const [rama, setRama] = useState("");
  const [marcadas, setMarcadas] = useState<string[]>(asignaturaInicial ? [asignaturaInicial] : []);

  const bach = esBach(curso);
  const disponibles = curso ? asignaturasDe(curso, rama || undefined) : [];
  const ramaSel = RAMAS.find((r) => r.id === rama);
  const toggle = (m: string) => setMarcadas((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  if (state?.ok) {
    const ref = state.id?.slice(0, 6).toUpperCase();
    const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Clases Particulares GE, quiero clases particulares a domicilio (ref. ${ref}).\n${resumen}`)}`;
    return (
      <div className="card mt-8 p-8 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 font-display text-3xl font-semibold">{DEMO ? "¡Último paso!" : "¡Solicitud recibida!"}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          {DEMO
            ? "Envíanos tu solicitud por WhatsApp (ya está escrita) y te respondemos con el profesor que irá a vuestra casa."
            : "Te escribiremos por WhatsApp en menos de 24 horas con el profesor que irá a vuestra casa."}{" "}
          Referencia: <b className="text-ink">{ref}</b>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="btn bg-[#25d366] text-white" href={wa}>
            {DEMO ? "Enviar por WhatsApp" : "Escribir ya por WhatsApp"}
          </a>
          <Link href="/" className="btn btn-claro">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const Chip = ({ m }: { m: string }) => (
    <label className="chip">
      <input type="checkbox" name="materias" value={m} checked={marcadas.includes(m)} onChange={() => toggle(m)} className="sr-only" />
      {m}
    </label>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const v = (k: string) => String(fd.get(k) ?? "").trim();
        setResumen(
          [
            `Nombre: ${v("nombre")} (${v("telefono")})`,
            v("alumno") && `Alumno: ${v("alumno")}`,
            `Curso: ${cursoNombre(v("curso"))}${ramaNombre(v("rama")) ? ` — ${ramaNombre(v("rama"))}` : ""}`,
            `Asignaturas: ${fd.getAll("materias").join(", ")}`,
            `Domicilio: ${v("ciudad")}, ${v("barrio")}${v("referencia") ? ` (${v("referencia")})` : ""}`,
            `Clases por semana: ${v("sesiones")}${fd.getAll("franjas").length ? ` · ${fd.getAll("franjas").join(", ")}` : ""}`,
            v("objetivo") && `Objetivo: ${v("objetivo")}`,
          ]
            .filter(Boolean)
            .join("\n"),
        );
        startTransition(() => action(fd));
      }}
      className="mt-8 space-y-6"
    >
      <Bloque n="1" titulo="¿Quién pide las clases?">
        <div className="flex flex-wrap gap-2">
          <label className="chip"><input type="radio" name="quien" value="padre" defaultChecked className="sr-only" />Soy padre / madre / tutor</label>
          <label className="chip"><input type="radio" name="quien" value="estudiante" className="sr-only" />Soy el estudiante</label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Tu nombre *</label><input name="nombre" required className="field" placeholder="Ej. María Nchama" /></div>
          <div><label className="label">Teléfono / WhatsApp *</label><input name="telefono" required inputMode="tel" className="field" placeholder="+240 222 ..." /></div>
          <div><label className="label">Nombre del alumno</label><input name="alumno" className="field" placeholder="Si eres el padre o la madre" /></div>
          <div><label className="label">Email (opcional)</label><input name="email" type="email" className="field" /></div>
        </div>
      </Bloque>

      <Bloque n="2" titulo="Curso y asignaturas" sub="Según el Plan de Estudios Nacional de ESBA y Bachillerato.">
        <div>
          <label className="label">¿En qué curso está el alumno? *</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CURSOS.map((c) => (
              <label key={c.id} className="chip justify-center !py-3 font-semibold">
                <input
                  type="radio"
                  name="curso"
                  value={c.id}
                  checked={curso === c.id}
                  onChange={() => {
                    setCurso(c.id);
                    setMarcadas((cur) => cur.filter((m) => asignaturasDe(c.id).includes(m)));
                  }}
                  className="sr-only"
                />
                {c.nombre}
              </label>
            ))}
          </div>
        </div>

        {bach && (
          <div>
            <label className="label">Rama de Bachillerato</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RAMAS.map((r) => (
                <label key={r.id} className="chip !items-start !rounded-2xl !px-4 !py-3">
                  <input type="radio" name="rama" value={r.id} checked={rama === r.id} onChange={() => {
                      setRama(r.id);
                      setMarcadas((cur) => cur.filter((m) => asignaturasDe(curso, r.id).includes(m)));
                    }} className="sr-only" />
                  <span>
                    <b className="block">{r.nombre}</b>
                    <span className="text-xs opacity-75">{r.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {curso ? (
          <div>
            <label className="label">Asignaturas * <span className="font-normal text-muted">(puedes elegir varias)</span></label>
            {bach && ramaSel ? (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-verde">Específicas de {ramaSel.nombre}</p>
                <div className="flex flex-wrap gap-2">{ramaSel.asignaturas.map((m) => <Chip key={m} m={m} />)}</div>
                <p className="pt-1 text-xs font-bold uppercase tracking-wider text-muted">Troncales</p>
                <div className="flex flex-wrap gap-2">{TRONCALES.filter((t) => !(ramaSel.asignaturas as readonly string[]).includes(t)).map((m) => <Chip key={m} m={m} />)}</div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">{disponibles.map((m) => <Chip key={m} m={m} />)}</div>
            )}
          </div>
        ) : (
          <p className="rounded-xl bg-sand px-4 py-3 text-sm text-muted">👆 Elige el curso para ver sus asignaturas.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <div>
            <label className="label">Objetivo</label>
            <input name="objetivo" className="field" placeholder="Ej. Aprobar la recuperación, subir nota, preparar exámenes…" />
          </div>
          <div>
            <label className="label">Clases por semana</label>
            <select name="sesiones" className="field" defaultValue="2">
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "clase" : "clases"}</option>)}
            </select>
          </div>
        </div>
      </Bloque>

      <Bloque n="3" titulo="Vuestro domicilio y horario" sub="El profesor va a vuestra casa.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Ciudad *</label>
            <select name="ciudad" required className="field" defaultValue="">
              <option value="" disabled>Elige…</option>
              {CIUDADES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Barrio *</label><input name="barrio" required className="field" placeholder="Ej. Caracolas, Ela Nguema, Comandachina…" /></div>
          <div className="sm:col-span-2">
            <label className="label">Punto de referencia</label>
            <input name="referencia" className="field" placeholder="Ej. Detrás de la farmacia, portón azul" />
          </div>
        </div>
        <div>
          <label className="label">Horario preferido</label>
          <div className="flex flex-wrap gap-2">
            {FRANJAS.map((m) => <label key={m} className="chip"><input type="checkbox" name="franjas" value={m} className="sr-only" />{m}</label>)}
          </div>
        </div>
      </Bloque>

      {state?.error && <p className="rounded-xl bg-rojo/10 px-4 py-3 text-sm font-medium text-rojo">{state.error}</p>}
      <button disabled={pending} className="btn btn-verde w-full text-base sm:w-auto">{pending ? "Enviando…" : "Enviar solicitud"}</button>
      <p className="text-xs text-muted">Sin compromiso. Solo usamos tus datos para buscarte profesor.</p>
    </form>
  );
}
