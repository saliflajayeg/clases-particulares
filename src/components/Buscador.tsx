"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CURSOS, asignaturasDe } from "@/lib/constants";

export function Buscador() {
  const router = useRouter();
  const [curso, setCurso] = useState("");
  const [asig, setAsig] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = new URLSearchParams();
        if (curso) q.set("curso", curso);
        if (asig) q.set("asignatura", asig);
        router.push(`/pedir-clases${q.size ? `?${q}` : ""}`);
      }}
      className="mt-8 grid gap-2 rounded-3xl border border-line bg-white p-2 shadow-xl shadow-verde/5 sm:grid-cols-[1fr_1.3fr_auto]"
    >
      <select
        aria-label="Curso"
        value={curso}
        onChange={(e) => {
          setCurso(e.target.value);
          if (!asignaturasDe(e.target.value).includes(asig)) setAsig("");
        }}
        className="rounded-2xl bg-cream px-4 py-3.5 text-[15px] font-medium outline-none"
      >
        <option value="">¿Qué curso?</option>
        {CURSOS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </select>
      <select
        aria-label="Asignatura"
        value={asig}
        onChange={(e) => setAsig(e.target.value)}
        disabled={!curso}
        className="rounded-2xl bg-cream px-4 py-3.5 text-[15px] font-medium outline-none disabled:text-muted"
      >
        <option value="">{curso ? "¿Qué asignatura?" : "Elige antes el curso"}</option>
        {asignaturasDe(curso).map((a) => <option key={a}>{a}</option>)}
      </select>
      <button className="btn btn-verde !rounded-2xl">Buscar profesor</button>
    </form>
  );
}
