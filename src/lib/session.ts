import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET || "cambia-esto-en-produccion";
// Sin ADMIN_PASSWORD (en .env.local) el panel de administración queda cerrado.
export const ADMIN_PASS = process.env.ADMIN_PASSWORD || crypto.randomBytes(32).toString("hex");

const sign = (v: string) => crypto.createHmac("sha256", SECRET).update(v).digest("hex");

export async function setSession(name: "profe" | "admin", value: string) {
  (await cookies()).set(name, `${value}.${sign(name + value)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(name: "profe" | "admin"): Promise<string | null> {
  const raw = (await cookies()).get(name)?.value;
  if (!raw) return null;
  const i = raw.lastIndexOf(".");
  const value = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const good = sign(name + value);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  return value;
}

export async function clearSession(name: "profe" | "admin") {
  (await cookies()).delete(name);
}
