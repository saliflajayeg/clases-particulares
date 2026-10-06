"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mutate, read, newId, hashPass, checkPass, saveUpload, type Profesor, type Solicitud, type MateriaProfe } from "@/lib/db";
import { CURSOS, asignaturasDe, esBach } from "@/lib/constants";
import { setSession, clearSession, getSession, ADMIN_PASS } from "@/lib/session";

export type FormState = { error?: string; ok?: boolean; id?: string } | undefined;

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const tel = (v: string) => v.replace(/[^\d+]/g, "");

/* ---------- Familias / alumnos ---------- */

export async function crearSolicitud(_: FormState, f: FormData): Promise<FormState> {
  const sol: Solicitud = {
    id: newId(),
    creado: new Date().toISOString(),
    estado: "nueva",
    nombre: s(f, "nombre"),
    telefono: tel(s(f, "telefono")),
    email: s(f, "email") || undefined,
    quien: s(f, "quien") === "estudiante" ? "estudiante" : "padre",
    alumno: s(f, "alumno"),
    curso: s(f, "curso"),
    rama: esBach(s(f, "curso")) ? s(f, "rama") || undefined : undefined,
    materias: f.getAll("materias").map(String),
    ciudad: s(f, "ciudad"),
    barrio: s(f, "barrio"),
    referencia: s(f, "referencia"),
    franjas: f.getAll("franjas").map(String),
    sesionesSemana: Number(s(f, "sesiones")) || 2,
    objetivo: s(f, "objetivo"),
  };
  if (!sol.nombre || sol.telefono.length < 6) return { error: "Escribe tu nombre y un teléfono / WhatsApp válido." };
  if (!CURSOS.some((c) => c.id === sol.curso)) return { error: "Elige el curso del alumno." };
  const validas = asignaturasDe(sol.curso, sol.rama);
  sol.materias = sol.materias.filter((m) => validas.includes(m));
  if (!sol.materias.length) return { error: "Elige al menos una asignatura." };
  if (!sol.ciudad || !sol.barrio) return { error: "Indica la ciudad y el barrio: las clases son a domicilio." };
  await mutate((db) => void db.solicitudes.unshift(sol));
  return { ok: true, id: sol.id };
}

/* ---------- Profesores ---------- */

export async function registrarProfesor(_: FormState, f: FormData): Promise<FormState> {
  try {
    const email = s(f, "email").toLowerCase();
    const pass = s(f, "password");
    const materias: MateriaProfe[] = f
      .getAll("materias")
      .map(String)
      .map((m) => ({
        materia: m,
        cursos: f.getAll(`cursos_${m}`).map(String).filter((c) => asignaturasDe(c).includes(m)),
        titulo: s(f, `titulo_${m}`),
        motivo: s(f, `motivo_${m}`),
      }))
      .filter((m) => m.cursos.length);

    if (!s(f, "nombre") || !email.includes("@") || tel(s(f, "telefono")).length < 6)
      return { error: "Revisa tu nombre, email y teléfono." };
    if (pass.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };
    if (!materias.length) return { error: "Marca al menos una asignatura y curso que puedas impartir." };
    const sinTitulo = materias.find((m) => !m.titulo);
    if (sinTitulo) return { error: `Indica qué título o certificado te acredita para ${sinTitulo.materia}.` };
    const sinMotivo = materias.find((m) => m.motivo.length < 40);
    if (sinMotivo) return { error: `Explícanos (mínimo 40 caracteres) por qué eres profesor de ${sinMotivo.materia}.` };

    const cv = f.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return { error: "Sube tu currículum (PDF o foto)." };
    const certs = f.getAll("certificados").filter((x): x is File => x instanceof File && x.size > 0);
    if (!certs.length) return { error: "Sube al menos un título o certificado." };

    if ((await read()).profesores.some((p) => p.email === email))
      return { error: "Ya existe una cuenta con ese email. Inicia sesión." };

    const docs = [await saveUpload(cv, "cv")];
    for (const c of certs.slice(0, 10)) docs.push(await saveUpload(c, "certificado"));
    const foto = f.get("foto");
    let fotoId: string | undefined;
    if (foto instanceof File && foto.size > 0) {
      if (!foto.type.startsWith("image/")) return { error: "La foto de perfil debe ser una imagen." };
      fotoId = (await saveUpload(foto, "foto")).id;
    }

    const p: Profesor = {
      id: newId(),
      creado: new Date().toISOString(),
      estado: "pendiente",
      nombre: s(f, "nombre"),
      email,
      telefono: tel(s(f, "telefono")),
      ciudad: s(f, "ciudad"),
      barrio: s(f, "barrio"),
      pass: hashPass(pass),
      titulacion: s(f, "titulacion"),
      experienciaAnios: Number(s(f, "anios")) || 0,
      experiencia: s(f, "experiencia"),
      presentacion: s(f, "presentacion"),
      materias,
      zonas: s(f, "zonas"),
      franjas: f.getAll("franjas").map(String),
      tarifa: Number(s(f, "tarifa")) || 0,
      foto: fotoId,
      docs,
    };
    await mutate((db) => void db.profesores.unshift(p));
    await setSession("profe", p.id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo completar el registro." };
  }
  redirect("/profesores/panel?nuevo=1");
}

export async function loginProfesor(_: FormState, f: FormData): Promise<FormState> {
  const email = s(f, "email").toLowerCase();
  const p = (await read()).profesores.find((x) => x.email === email);
  if (!p || !checkPass(s(f, "password"), p.pass)) return { error: "Email o contraseña incorrectos." };
  await setSession("profe", p.id);
  redirect("/profesores/panel");
}

export async function logoutProfesor() {
  await clearSession("profe");
  redirect("/");
}

/* ---------- Admin ---------- */

export async function loginAdmin(_: FormState, f: FormData): Promise<FormState> {
  if (s(f, "password") !== ADMIN_PASS) return { error: "Contraseña incorrecta." };
  await setSession("admin", "1");
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSession("admin");
  redirect("/admin");
}

async function requireAdmin() {
  if ((await getSession("admin")) !== "1") throw new Error("No autorizado");
}

export async function estadoProfesor(f: FormData) {
  await requireAdmin();
  const id = s(f, "id");
  await mutate((db) => {
    const p = db.profesores.find((x) => x.id === id);
    if (p) p.estado = s(f, "estado") as Profesor["estado"];
  });
  revalidatePath("/admin");
}

export async function asignarProfesor(f: FormData) {
  await requireAdmin();
  const id = s(f, "id");
  const profesorId = s(f, "profesorId");
  await mutate((db) => {
    const sol = db.solicitudes.find((x) => x.id === id);
    if (!sol) return;
    sol.profesorId = profesorId || undefined;
    sol.estado = profesorId ? (sol.estado === "nueva" ? "asignada" : sol.estado) : "nueva";
  });
  revalidatePath("/admin");
}

export async function estadoSolicitud(f: FormData) {
  await requireAdmin();
  const id = s(f, "id");
  await mutate((db) => {
    const sol = db.solicitudes.find((x) => x.id === id);
    if (sol) sol.estado = s(f, "estado") as Solicitud["estado"];
  });
  revalidatePath("/admin");
}
