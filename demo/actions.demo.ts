// Versión de demostración de src/app/actions.ts para la web estática (GitHub Pages).
// No hay servidor: los formularios no guardan nada y la pantalla final envía todo por WhatsApp.
// demo/prepare.sh copia este archivo encima de src/app/actions.ts SOLO en la compilación de la demo.

export type FormState = { error?: string; ok?: boolean; id?: string } | undefined;

const espera = () => new Promise((r) => setTimeout(r, 500));
const ref = () => Math.random().toString(16).slice(2, 10).padEnd(8, "0");

export async function crearSolicitud(_: FormState, f: FormData): Promise<FormState> {
  await espera();
  if (!String(f.get("nombre") ?? "").trim() || String(f.get("telefono") ?? "").replace(/\D/g, "").length < 6)
    return { error: "Escribe tu nombre y un teléfono / WhatsApp válido." };
  if (!f.get("curso")) return { error: "Elige el curso del alumno." };
  if (!f.getAll("materias").length) return { error: "Elige al menos una asignatura." };
  if (!f.get("ciudad") || !String(f.get("barrio") ?? "").trim()) return { error: "Indica la ciudad y el barrio: las clases son a domicilio." };
  return { ok: true, id: ref() };
}

export async function registrarProfesor(_: FormState, f: FormData): Promise<FormState> {
  await espera();
  if (!f.getAll("materias").length) return { error: "Marca al menos una asignatura y curso que puedas impartir." };
  return { ok: true, id: ref() };
}
