export const BRAND = "ProfeGE";
/** Versión de demostración (web estática publicada): no guarda datos, sin cuentas ni panel. */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";
export const WHATSAPP = "240555573464"; // número de contacto de la empresa
export const WHATSAPP_PRETTY = "+240 555 573 464";

/* ---------------------------------------------------------------------------
 * Plan de Estudios Nacional (Ministerio de Educación) — ESBA y Bachillerato.
 * Los mismos cursos y asignaturas los usan los alumnos para pedir clases
 * y los profesores para indicar qué pueden impartir.
 * ------------------------------------------------------------------------- */

export type CursoId = "1esba" | "2esba" | "3esba" | "4esba" | "1bach" | "2bach";

export const CURSOS: { id: CursoId; nombre: string; corto: string; ciclo: "ESBA" | "Bachillerato" }[] = [
  { id: "1esba", nombre: "1º de ESBA", corto: "1º ESBA", ciclo: "ESBA" },
  { id: "2esba", nombre: "2º de ESBA", corto: "2º ESBA", ciclo: "ESBA" },
  { id: "3esba", nombre: "3º de ESBA", corto: "3º ESBA", ciclo: "ESBA" },
  { id: "4esba", nombre: "4º de ESBA", corto: "4º ESBA", ciclo: "ESBA" },
  { id: "1bach", nombre: "1º de Bachillerato", corto: "1º Bach.", ciclo: "Bachillerato" },
  { id: "2bach", nombre: "2º de Bachillerato", corto: "2º Bach.", ciclo: "Bachillerato" },
];

export const cursoNombre = (id: string) => CURSOS.find((c) => c.id === id)?.nombre ?? id;
export const esBach = (id: string) => id === "1bach" || id === "2bach";

const ESBA: Record<"1esba" | "2esba" | "3esba" | "4esba", string[]> = {
  "1esba": ["Lengua Española y Literatura", "Geografía General y de Guinea Ecuatorial", "Matemáticas", "Ciencias Naturales I", "Educación Plástica y Visual I", "Francés", "Inglés", "Religión", "Educación Física"],
  "2esba": ["Lengua Española y Literatura", "Geografía Descriptiva Universal", "Matemáticas", "Ciencias Naturales II", "Educación Plástica y Visual II", "Francés", "Inglés", "Religión", "Educación Física"],
  "3esba": ["Lengua Española y Literatura", "Historia de África y de Guinea Ecuatorial", "Matemáticas", "Biología y Geología", "Tecnología", "Educación Plástica y Artística I", "Francés", "Inglés", "Religión", "Educación Física"],
  "4esba": ["Lengua Española y Literatura", "Historia Universal", "Matemáticas", "Física y Química", "Biología y Geología", "Tecnología", "Educación Plástica y Artística II", "Francés", "Inglés", "Religión", "Educación Física"],
};

export const TRONCALES = ["Lengua Española", "Filosofía", "Historia de África y de Guinea Ecuatorial", "Francés", "Inglés", "Ciencias de la Tierra y Medioambientales", "Economía / Formación Cívica", "Religión", "Educación Física y Deportiva"];

export const RAMAS = [
  { id: "ciencias", nombre: "Ciencias de la Naturaleza y Salud", desc: "Medicina, biología y ciencias", asignaturas: ["Matemáticas", "Biología", "Física", "Química"] },
  { id: "tecnologia", nombre: "Tecnología", desc: "Ingenierías y arquitectura", asignaturas: ["Tecnología Industrial", "Matemáticas", "Dibujo Técnico", "Física", "Biología"] },
  { id: "humanidades", nombre: "Humanidades y Ciencias Sociales", desc: "Derecho, economía y letras", asignaturas: ["Latín y Griego", "Geografía de Grandes Espacios Mundiales", "Matemáticas Aplicadas a las CC.SS.", "Historia del Arte", "Literatura Universal"] },
  { id: "artes", nombre: "Artes", desc: "Bellas artes, diseño y escena", asignaturas: ["Dibujo Artístico", "Historia del Arte", "Diseño", "Artes Escénicas y Culturales"] },
] as const;

export const ramaNombre = (id?: string) => RAMAS.find((r) => r.id === id)?.nombre;

const BACH_TODAS = [...new Set([...TRONCALES, ...RAMAS.flatMap((r) => r.asignaturas)])];

/** Asignaturas de un curso. En Bachillerato: troncales + las de la rama (o todas si no hay rama). */
export function asignaturasDe(curso: string, rama?: string): string[] {
  if (curso in ESBA) return ESBA[curso as keyof typeof ESBA];
  if (!esBach(curso)) return [];
  const r = RAMAS.find((x) => x.id === rama);
  return r ? [...r.asignaturas, ...TRONCALES.filter((t) => !(r.asignaturas as readonly string[]).includes(t))] : BACH_TODAS;
}

/** Todas las asignaturas del plan, agrupadas por área, con los cursos donde se imparten. */
const AREAS: [string, string[]][] = [
  ["Lengua y Literatura", ["Lengua Española y Literatura", "Lengua Española", "Literatura Universal", "Latín y Griego"]],
  ["Matemáticas", ["Matemáticas", "Matemáticas Aplicadas a las CC.SS."]],
  ["Ciencias", ["Ciencias Naturales I", "Ciencias Naturales II", "Biología y Geología", "Física y Química", "Biología", "Física", "Química", "Ciencias de la Tierra y Medioambientales"]],
  ["Geografía, Historia y Sociales", ["Geografía General y de Guinea Ecuatorial", "Geografía Descriptiva Universal", "Historia de África y de Guinea Ecuatorial", "Historia Universal", "Geografía de Grandes Espacios Mundiales", "Filosofía", "Economía / Formación Cívica"]],
  ["Idiomas", ["Francés", "Inglés"]],
  ["Tecnología y Dibujo", ["Tecnología", "Tecnología Industrial", "Dibujo Técnico"]],
  ["Artes", ["Educación Plástica y Visual I", "Educación Plástica y Visual II", "Educación Plástica y Artística I", "Educación Plástica y Artística II", "Dibujo Artístico", "Historia del Arte", "Diseño", "Artes Escénicas y Culturales"]],
  ["Otras", ["Religión", "Educación Física", "Educación Física y Deportiva"]],
];

export const CATALOGO = AREAS.map(([area, nombres]) => ({
  area,
  asignaturas: nombres.map((nombre) => ({
    nombre,
    cursos: CURSOS.filter((c) => asignaturasDe(c.id).includes(nombre)).map((c) => c.id),
  })),
}));

export const CIUDADES = [
  "Malabo",
  "Bata",
  "Ebebiyín",
  "Mongomo",
  "Evinayong",
  "Ciudad de la Paz",
  "Luba",
  "Riaba",
  "Mbini",
  "Aconibe",
  "Añisok",
  "Annobón",
] as const;

export const FRANJAS = ["Mañanas", "Tardes (después del cole)", "Noches", "Fines de semana"] as const;

export const PRECIOS = [
  { nivel: "1º y 2º de ESBA", desde: 4000 },
  { nivel: "3º y 4º de ESBA", desde: 4500 },
  { nivel: "Bachillerato", desde: 5000 },
];

export const fcfa = (n: number) => n.toLocaleString("es-ES").replace(/,/g, ".") + " FCFA";
