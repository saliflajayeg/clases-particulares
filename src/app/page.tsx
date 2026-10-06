import Image from "next/image";
import Link from "next/link";
import { Buscador } from "@/components/Buscador";
import { CATALOGO, CIUDADES, CURSOS, PRECIOS, RAMAS, TRONCALES, asignaturasDe, fcfa } from "@/lib/constants";

const N_ASIGNATURAS = CATALOGO.reduce((n, a) => n + a.asignaturas.length, 0);

const PASOS = [
  { n: "1", t: "Cuéntanos qué necesitas", d: "Materia, curso del alumno, barrio y horario. Te lleva 2 minutos desde el móvil." },
  { n: "2", t: "Te asignamos un profesor", d: "Elegimos entre nuestros profesores verificados al que tiene título en esa asignatura y curso, y te llamamos por WhatsApp." },
  { n: "3", t: "El profesor va a vuestra casa", d: "Clases a domicilio, en vuestro horario. Si el profesor no os convence, lo cambiamos sin coste." },
];

const TESTIMONIOS = [
  { t: "Mi hijo suspendía Matemáticas en 3º de ESBA. Con su profesor de ProfeGE aprobó la recuperación con un 7.", a: "Mamá de Rubén", c: "Malabo · Ela Nguema" },
  { t: "En 2º de Bachillerato de Ciencias tuve clases de Química y Física en casa dos veces por semana. Entré en Medicina en la UNGE.", a: "Lucía, 18 años", c: "Bata" },
  { t: "Mi hija de 1º de ESBA no entendía el francés. El profesor viene a casa dos tardes por semana y ya saca notables.", a: "Papá de Ana", c: "Malabo · Paraíso" },
];

const FAQ = [
  ["¿Cómo sé que los profesores son de confianza?", "Todos envían su currículum, títulos y certificados. Revisamos cada documento, hacemos una entrevista y solo entonces el profesor puede recibir alumnos."],
  ["¿Dónde se dan las clases?", "En vuestra casa. El profesor se desplaza a domicilio en Malabo, Bata y el resto de ciudades del país."],
  ["¿Qué cursos y asignaturas cubrís?", "De 1º de ESBA a 2º de Bachillerato, todas las asignaturas del Plan de Estudios Nacional, incluidas las específicas de cada rama de Bachillerato."],
  ["¿Cómo se paga?", "Pagas mensualmente en FCFA, por transferencia bancaria o en efectivo. Sin pagos por adelantado antes de la primera clase."],
  ["¿Y si el profesor no nos convence?", "Nos escribes y te asignamos otro profesor sin coste adicional."],
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-verde-soft px-3.5 py-1.5 text-sm font-semibold text-verde">
              <span className="h-2 w-2 rounded-full bg-verde" /> Clases a domicilio · ESBA y Bachillerato
            </span>
            <h1 className="mt-5 font-display text-[42px] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Clases particulares que <span className="text-verde">sí</span> mejoran las notas.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Profesores verificados que van a vuestra casa, en Malabo, Bata y toda Guinea Ecuatorial. De 1º de ESBA a 2º
              de Bachillerato, todas las asignaturas del plan de estudios.
            </p>
            <Buscador />
            <p className="mt-3 text-sm text-muted">
              ¿Eres profesor? <Link href="/profesores" className="font-semibold text-verde hover:underline">Trabaja con nosotros →</Link>
            </p>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
              <span><b className="text-xl text-ink">6</b> cursos</span>
              <span><b className="text-xl text-ink">{N_ASIGNATURAS}</b> asignaturas</span>
              <span><b className="text-xl text-ink">100%</b> a domicilio</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-sol/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl shadow-verde/10">
              <Image src="/img/hero.jpg" alt="Profesora particular ayudando a un alumno con Matemáticas en casa, en Malabo" width={1344} height={752} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[5/4] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-left-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-verde-soft text-lg">✅</span>
              <div className="text-sm leading-tight">
                <b>Títulos revisados</b>
                <div className="text-muted">CV, certificados y entrevista</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-verde">Para familias y alumnos</p>
          <h2 className="mt-2 max-w-xl font-display text-4xl font-semibold tracking-tight">Así de fácil es empezar</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="space-y-8">
              {PASOS.map((p) => (
                <div key={p.n} className="flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-verde font-display text-xl font-semibold text-white">{p.n}</span>
                  <div>
                    <h3 className="text-lg font-bold">{p.t}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{p.d}</p>
                  </div>
                </div>
              ))}
              <Link href="/pedir-clases" className="btn btn-verde">Empezar ahora</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image src="/img/familia.jpg" alt="Madre e hija buscando profesor particular desde el móvil" width={1168} height={880} sizes="(min-width: 768px) 55vw, 100vw" className="col-span-2 aspect-[16/10] w-full rounded-3xl object-cover" />
              <Image src="/img/quimica.jpg" alt="Alumna estudiando Química con su profesor" width={1168} height={880} sizes="(min-width: 768px) 28vw, 50vw" className="aspect-square w-full rounded-3xl object-cover" />
              <Image src="/img/domicilio.jpg" alt="Profesor dando clase a domicilio a una alumna en su casa" width={1168} height={880} sizes="(min-width: 768px) 28vw, 50vw" className="aspect-square w-full rounded-3xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-verde">Plan de Estudios Nacional</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Elige el curso y la asignatura</h2>
            </div>
            <p className="max-w-sm text-muted">Toca una asignatura para pedir un profesor que la imparta en ese curso.</p>
          </div>

          <h3 className="mt-10 text-lg font-bold">Educación Secundaria Básica (ESBA)</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CURSOS.filter((c) => c.ciclo === "ESBA").map((c) => (
              <div key={c.id} className="card p-5">
                <Link href={`/pedir-clases?curso=${c.id}`} className="font-display text-2xl font-semibold hover:text-verde">{c.nombre}</Link>
                <ul className="mt-3 space-y-1 text-sm">
                  {asignaturasDe(c.id).map((a) => (
                    <li key={a}>
                      <Link href={`/pedir-clases?curso=${c.id}&asignatura=${encodeURIComponent(a)}`} className="text-muted hover:text-verde">{a}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-lg font-bold">Bachillerato <span className="font-normal text-muted">· 1º y 2º</span></h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-3xl bg-verde p-6 text-white">
              <p className="font-display text-2xl font-semibold">Troncales</p>
              <p className="text-sm text-white/75">Comunes a todas las ramas</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {TRONCALES.map((a) => (
                  <li key={a}>
                    <Link href={`/pedir-clases?curso=1bach&asignatura=${encodeURIComponent(a)}`} className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm hover:bg-white/25">{a}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {RAMAS.map((r) => (
                <div key={r.id} className="card p-5">
                  <p className="font-bold">{r.nombre}</p>
                  <p className="text-xs text-muted">{r.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {r.asignaturas.map((a) => (
                      <li key={a}>
                        <Link href={`/pedir-clases?curso=1bach&asignatura=${encodeURIComponent(a)}`} className="inline-block rounded-full bg-sand px-3 py-1 text-sm hover:bg-verde-soft hover:text-verde">{a}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="scroll-mt-20 bg-ink py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-sol">Precios claros</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Pagas por hora de clase, en FCFA</h2>
          <p className="mt-3 max-w-xl text-white/70">Precios orientativos por hora de clase. Clase en vuestra casa, desplazamiento del profesor incluido. Te confirmamos el precio final antes de empezar.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PRECIOS.map((p, i) => (
              <div key={p.nivel} className={`rounded-3xl p-6 ${i === PRECIOS.length - 1 ? "bg-verde" : "bg-white/5 ring-1 ring-white/10"}`}>
                <p className="font-semibold">{p.nivel}</p>
                <p className="mt-4 text-sm text-white/60">desde</p>
                <p className="font-display text-3xl font-semibold">{fcfa(p.desde)}</p>
                <p className="text-sm text-white/60">por hora</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/60">💡 Packs mensuales con descuento para 2 o más clases por semana, o para hermanos.</p>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Lo que dicen las familias</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIOS.map((t) => (
              <figure key={t.a} className="card p-7">
                <div className="text-sol">★★★★★</div>
                <blockquote className="mt-3 leading-relaxed">“{t.t}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <b>{t.a}</b> <span className="text-muted">· {t.c}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PROFESORES CTA */}
      <section className="px-4">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-verde text-white md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-sol">¿Eres profesor?</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Trabaja con nosotros</h2>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Te conseguimos alumnos cerca de ti, cobras puntualmente cada mes y tú decides tus horarios, asignaturas y cursos.
            </p>
            <ul className="mt-6 space-y-2 text-white/90">
              <li>✓ Alumnos cerca de tu barrio, clases a domicilio</li>
              <li>✓ Elige las asignaturas y cursos en los que tienes título</li>
              <li>✓ Sin cuotas: regístrate gratis</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/profesores/registro" className="btn bg-white text-verde hover:bg-sand">Regístrate como profesor</Link>
              <Link href="/profesores" className="btn border border-white/40 text-white hover:bg-white/10">Más información</Link>
            </div>
          </div>
          <div className="relative min-h-72">
            <Image src="/img/profe-mujer.jpg" alt="Profesora sonriente con sus certificados en un aula" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      {/* CIUDADES + FAQ */}
      <section id="faq" className="scroll-mt-20 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight">Estamos en todo el país</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {CIUDADES.map((c) => (
                <span key={c} className="rounded-full bg-sand px-3.5 py-1.5 text-sm">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight">Preguntas frecuentes</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {q}
                    <span className="text-xl text-verde transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 leading-relaxed text-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
