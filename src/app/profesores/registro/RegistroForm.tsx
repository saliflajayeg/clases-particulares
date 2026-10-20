"use client";

import { startTransition, useActionState, useState } from "react";
import { registrarProfesor } from "@/app/actions";
import { Bloque } from "@/components/Bloque";
import { CATALOGO, CIUDADES, CURSOS, FRANJAS, WHATSAPP } from "@/lib/constants";

export function RegistroForm() {
  const [state, action, pending] = useActionState(registrarProfesor, undefined);
  // asignatura → cursos en los que la imparte
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [certs, setCerts] = useState<string[]>([]);
  const [cv, setCv] = useState("");

  const elegidas = CATALOGO.flatMap((a) => a.asignaturas).filter((a) => sel[a.nombre]?.length);

  if (state?.ok)
    return (
      <div className="card mt-8 p-8 text-center">
        <div className="text-5xl">🎓</div>
        <h2 className="mt-4 font-display text-3xl font-semibold">¡Gracias por registrarte!</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Para completar tu solicitud, envíanos por WhatsApp tu CV y tus títulos. Te llamaremos para una breve entrevista.
        </p>
        <a
          className="btn mt-6 bg-[#25d366] text-white"
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
            `Hola Clases Particulares GE, me he registrado como profesor.\nAsignaturas: ${elegidas.map((a) => `${a.nombre} (${sel[a.nombre].map((c) => CURSOS.find((x) => x.id === c)!.corto).join(", ")})`).join("; ")}\nOs envío mi CV y mis títulos.`,
          )}`}
        >
          Enviar CV por WhatsApp
        </a>
      </div>
    );

  const toggle = (m: string, c: string) =>
    setSel((cur) => {
      const xs = cur[m] ?? [];
      return { ...cur, [m]: xs.includes(c) ? xs.filter((x) => x !== c) : [...xs, c] };
    });
  const todos = (m: string, cursos: string[]) =>
    setSel((cur) => ({ ...cur, [m]: (cur[m]?.length ?? 0) === cursos.length ? [] : cursos }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="mt-8 space-y-6"
    >
      <Bloque n="1" titulo="Datos personales">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">Nombre y apellidos *</label><input name="nombre" required className="field" /></div>
          <div><label className="label">Email *</label><input name="email" type="email" required className="field" /></div>
          <div><label className="label">Teléfono / WhatsApp *</label><input name="telefono" required inputMode="tel" className="field" placeholder="+240 222 ..." /></div>
          <div>
            <label className="label">Ciudad *</label>
            <select name="ciudad" required className="field" defaultValue="">
              <option value="" disabled>Elige…</option>
              {CIUDADES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Barrio donde vives</label><input name="barrio" className="field" /></div>
          <div><label className="label">Contraseña * <span className="font-normal text-muted">(mín. 6)</span></label><input name="password" type="password" minLength={6} required className="field" autoComplete="new-password" /></div>
          <div>
            <label className="label">Foto de perfil</label>
            <input name="foto" type="file" accept="image/*" className="field file:mr-3 file:rounded-full file:border-0 file:bg-verde-soft file:px-3 file:py-1 file:text-sm file:font-semibold file:text-verde" />
          </div>
        </div>
      </Bloque>

      <Bloque
        n="2"
        titulo="¿Qué asignaturas y cursos puedes impartir?"
        sub="Plan de Estudios Nacional, de 1º de ESBA a 2º de Bachillerato. Marca solo los cursos para los que tienes formación o título."
      >
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {CATALOGO.map((area) => {
            const n = area.asignaturas.filter((a) => sel[a.nombre]?.length).length;
            return (
              <details key={area.area} className="group" open={area.area === "Matemáticas"}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-cream px-4 py-3 font-semibold">
                  <span>
                    {area.area}
                    {n > 0 && <span className="ml-2 rounded-full bg-verde px-2 py-0.5 text-xs text-white">{n}</span>}
                  </span>
                  <span className="text-verde transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="divide-y divide-line">
                  {area.asignaturas.map((a) => {
                    const marcados = sel[a.nombre] ?? [];
                    return (
                      <div key={a.nombre} className={`flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${marcados.length ? "bg-verde-soft/40" : ""}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-medium">{a.nombre}</span>
                          {a.cursos.length > 1 && (
                            <button type="button" onClick={() => todos(a.nombre, a.cursos)} className="text-xs font-semibold text-verde hover:underline">
                              {marcados.length === a.cursos.length ? "quitar" : "todos"}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {a.cursos.map((c) => (
                            <label key={c} className="chip !px-2.5 !py-1 text-xs font-semibold">
                              <input type="checkbox" name={`cursos_${a.nombre}`} value={c} checked={marcados.includes(c)} onChange={() => toggle(a.nombre, c)} className="sr-only" />
                              {CURSOS.find((x) => x.id === c)!.corto}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </Bloque>

      {elegidas.length > 0 && (
        <Bloque n="3" titulo="Tu título y tu motivación para cada asignatura" sub="Las familias confían en profesores que demuestran su formación.">
          {elegidas.map((a) => (
            <div key={a.nombre} className="rounded-2xl border border-verde/30 bg-verde-soft/40 p-5">
              <input type="hidden" name="materias" value={a.nombre} />
              <p className="font-bold text-verde">{a.nombre}</p>
              <p className="text-xs text-muted">{sel[a.nombre].map((c) => CURSOS.find((x) => x.id === c)!.nombre).join(" · ")}</p>
              <label className="label mt-3">Título o certificado que te acredita *</label>
              <input name={`titulo_${a.nombre}`} required className="field" placeholder="Ej. Licenciatura en Ciencias Exactas (UNGE, 2018)" />
              <label className="label mt-3">¿Por qué eres profesor de {a.nombre}? *</label>
              <textarea
                name={`motivo_${a.nombre}`}
                rows={3}
                required
                minLength={40}
                className="field"
                placeholder="Cuántos años la enseñas, resultados de tus alumnos, tu método…"
              />
            </div>
          ))}
        </Bloque>
      )}

      <Bloque n={elegidas.length ? "4" : "3"} titulo="Formación y experiencia">
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <div><label className="label">Titulación principal *</label><input name="titulacion" required className="field" placeholder="Ej. Licenciado en Matemáticas (UNGE)" /></div>
          <div><label className="label">Años dando clase</label><input name="anios" type="number" min={0} max={60} className="field" defaultValue={0} /></div>
        </div>
        <div><label className="label">Experiencia</label><textarea name="experiencia" rows={3} className="field" placeholder="Colegios, institutos o clases particulares en las que has trabajado…" /></div>
        <div><label className="label">Preséntate a las familias *</label><textarea name="presentacion" rows={3} required className="field" placeholder="Un texto corto y cercano: cómo das tus clases y qué consigues con tus alumnos." /></div>
      </Bloque>

      <Bloque n={elegidas.length ? "5" : "4"} titulo="Documentos" sub="PDF, JPG o PNG, máximo 8 MB cada uno. Puedes hacer una foto clara con el móvil.">
        <FileDrop name="cv" label="Currículum (CV) *" hint={cv || "Toca para subir tu CV"} onChange={(fs) => setCv(fs[0] ?? "")} />
        <FileDrop
          name="certificados"
          multiple
          label="Títulos y certificados * (sube los de cada asignatura que marcaste)"
          hint={certs.length ? certs.join(" · ") : "Toca para subir tus títulos, diplomas, certificados…"}
          onChange={setCerts}
        />
      </Bloque>

      <Bloque n={elegidas.length ? "6" : "5"} titulo="Disponibilidad y tarifa" sub="Las clases son a domicilio, en casa del alumno.">
        <div>
          <label className="label">Barrios o zonas a los que puedes desplazarte</label>
          <input name="zonas" className="field" placeholder="Ej. Todo Malabo II, Caracolas, Ela Nguema, Sampaka" />
        </div>
        <div>
          <label className="label">Horarios disponibles</label>
          <div className="flex flex-wrap gap-2">
            {FRANJAS.map((m) => <label key={m} className="chip"><input type="checkbox" name="franjas" value={m} className="sr-only" />{m}</label>)}
          </div>
        </div>
        <div className="max-w-xs">
          <label className="label">Tarifa deseada por hora (FCFA)</label>
          <input name="tarifa" type="number" min={0} step={500} className="field" placeholder="Ej. 4500" />
        </div>
      </Bloque>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-verde" />
        Confirmo que la información y los documentos son verdaderos y acepto que Clases Particulares GE los verifique.
      </label>

      {state?.error && <p className="rounded-xl bg-rojo/10 px-4 py-3 text-sm font-medium text-rojo">{state.error}</p>}
      <button disabled={pending} className="btn btn-verde w-full text-base sm:w-auto">{pending ? "Enviando documentos…" : "Enviar mi solicitud"}</button>
    </form>
  );
}

function FileDrop({ name, label, hint, multiple, onChange }: { name: string; label: string; hint: string; multiple?: boolean; onChange: (names: string[]) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-cream px-5 py-5 transition hover:border-verde">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl shadow-sm">📎</span>
        <span className="min-w-0 truncate text-sm text-muted">{hint}</span>
        <input
          type="file"
          name={name}
          multiple={multiple}
          accept=".pdf,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => onChange(Array.from(e.target.files ?? []).map((f) => f.name))}
        />
      </label>
    </div>
  );
}
