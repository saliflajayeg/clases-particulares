import type { Metadata } from "next";
import Link from "next/link";
import { RegistroForm } from "./RegistroForm";

export const metadata: Metadata = { title: "Registro de profesores" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/profesores" className="text-sm font-semibold text-verde">← Trabaja con nosotros</Link>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Regístrate como profesor</h1>
      <p className="mt-3 text-lg text-muted">
        Cuanto más completo sea tu perfil, antes lo aprobamos y más alumnos te asignamos. Te llevará unos 10 minutos.
      </p>
      <RegistroForm />
    </div>
  );
}
