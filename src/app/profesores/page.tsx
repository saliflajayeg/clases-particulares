import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DEMO } from "@/lib/constants";

export const metadata: Metadata = { title: "Trabaja con nosotros — profesores" };

const VENTAJAS = [
  ["🎯", "Alumnos sin buscarlos", "Nosotros hacemos la publicidad y te asignamos alumnos que encajan con tus asignaturas, tus cursos y tu barrio."],
  ["🗓️", "Tú pones el horario", "Elige días y franjas, y los barrios a los que puedes ir: las clases son a domicilio."],
  ["💵", "Cobro puntual cada mes", "Las familias pagan a ProfeGE y tú recibes tu pago mensual, sin perseguir a nadie."],
  ["📚", "Varias asignaturas", "¿Das Matemáticas en ESBA y Física en Bachillerato? Marca cada asignatura y curso en los que tienes título."],
];

const REQUISITOS = [
  "Currículum actualizado (PDF o foto)",
  "Títulos y certificados de las asignaturas que quieres impartir",
  "Para cada asignatura: los cursos (de 1º de ESBA a 2º de Bachillerato), el título que te acredita y por qué la enseñas",
  "Teléfono con WhatsApp y poder desplazarte a casa de los alumnos",
];

export default function Page() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-verde">¿Eres profesor?</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-tight">Trabaja con nosotros y llena tu agenda de alumnos</h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            Únete a la red de profesores particulares de Guinea Ecuatorial. Registro gratuito; revisamos tu perfil en 48–72 horas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/profesores/registro" className="btn btn-verde text-base">Regístrate como profesor</Link>
            {!DEMO && <Link href="/profesores/acceso" className="btn btn-claro text-base">Ya tengo cuenta</Link>}
          </div>
        </div>
        <Image src="/img/profe-hombre.jpg" alt="Profesor en el porche de un colegio en Bata" width={896} height={1120} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/4.4] w-full rounded-[32px] object-cover object-top" />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {VENTAJAS.map(([i, t, d]) => (
            <div key={t} className="rounded-3xl bg-cream p-6">
              <div className="text-3xl">{i}</div>
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight">Qué necesitas para registrarte</h2>
          <ul className="mt-6 space-y-3">
            {REQUISITOS.map((r) => (
              <li key={r} className="flex gap-3"><span className="text-verde">✓</span>{r}</li>
            ))}
          </ul>
        </div>
        <div className="card p-7">
          <h3 className="text-lg font-bold">El proceso</h3>
          <ol className="mt-4 space-y-4 text-sm">
            <li><b>1. Registro online</b> — rellenas tu perfil y subes tus documentos.</li>
            <li><b>2. Verificación</b> — revisamos tus títulos y te llamamos para una breve entrevista.</li>
            <li><b>3. Perfil aprobado</b> — empiezas a recibir alumnos en tu panel y por WhatsApp.</li>
          </ol>
          <Link href="/profesores/registro" className="btn btn-verde mt-6 w-full">Empezar el registro</Link>
        </div>
      </section>
    </>
  );
}
