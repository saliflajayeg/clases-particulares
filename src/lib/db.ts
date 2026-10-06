import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA = path.join(process.cwd(), "data");
export const UPLOADS = path.join(DATA, "uploads");

export type Doc = { id: string; nombre: string; tipo: "cv" | "certificado" | "foto"; mime: string };

/** Una asignatura que el profesor puede impartir, en qué cursos, y con qué título la acredita. */
export type MateriaProfe = { materia: string; cursos: string[]; titulo: string; motivo: string };

export type Profesor = {
  id: string;
  creado: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  barrio: string;
  pass: string; // salt:hash (scrypt)
  titulacion: string;
  experienciaAnios: number;
  experiencia: string;
  presentacion: string;
  materias: MateriaProfe[];
  zonas: string; // barrios / zonas a las que se desplaza (clases a domicilio)
  franjas: string[];
  tarifa: number;
  foto?: string;
  docs: Doc[];
  notaAdmin?: string;
};

export type Solicitud = {
  id: string;
  creado: string;
  estado: "nueva" | "asignada" | "en_curso" | "cerrada";
  nombre: string;
  telefono: string;
  email?: string;
  quien: "padre" | "estudiante";
  alumno: string;
  curso: string; // id de CURSOS
  rama?: string; // solo Bachillerato
  materias: string[];
  ciudad: string;
  barrio: string;
  referencia: string; // dirección / punto de referencia para ir a domicilio
  franjas: string[];
  sesionesSemana: number;
  objetivo: string;
  profesorId?: string;
  notaAdmin?: string;
};

type Shape = { profesores: Profesor[]; solicitudes: Solicitud[] };

const FILE = path.join(DATA, "db.json");
let lock: Promise<unknown> = Promise.resolve();

async function load(): Promise<Shape> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return { profesores: [], solicitudes: [] };
  }
}

export async function read(): Promise<Shape> {
  return load();
}

/** Serializa las escrituras para no pisar el JSON con peticiones simultáneas. */
export async function mutate<T>(fn: (db: Shape) => T | Promise<T>): Promise<T> {
  const run = lock.then(async () => {
    const db = await load();
    const out = await fn(db);
    await fs.mkdir(DATA, { recursive: true });
    await fs.writeFile(FILE + ".tmp", JSON.stringify(db, null, 2));
    await fs.rename(FILE + ".tmp", FILE);
    return out;
  });
  lock = run.catch(() => {});
  return run;
}

export const newId = () => crypto.randomBytes(8).toString("hex");

export function hashPass(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(pw, salt, 32).toString("hex");
}

export function checkPass(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const h = crypto.scryptSync(pw, salt, 32);
  return crypto.timingSafeEqual(h, Buffer.from(hash, "hex"));
}

const OK_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function saveUpload(file: File, tipo: Doc["tipo"]): Promise<Doc> {
  const ext = OK_MIME[file.type];
  if (!ext) throw new Error(`Formato no permitido: ${file.name} (solo PDF, JPG, PNG o WEBP)`);
  if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} supera 8 MB`);
  const id = newId() + ext;
  await fs.mkdir(UPLOADS, { recursive: true });
  await fs.writeFile(path.join(UPLOADS, id), Buffer.from(await file.arrayBuffer()));
  return { id, nombre: file.name, tipo, mime: file.type };
}
