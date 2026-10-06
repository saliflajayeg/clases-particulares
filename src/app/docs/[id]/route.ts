import { promises as fs } from "fs";
import path from "path";
import { read, UPLOADS } from "@/lib/db";
import { getSession } from "@/lib/session";

// Los documentos solo los ve el administrador o el propio profesor.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{16}\.(pdf|jpg|png|webp)$/.test(id)) return new Response("No encontrado", { status: 404 });

  const isAdmin = (await getSession("admin")) === "1";
  if (!isAdmin) {
    const profeId = await getSession("profe");
    const p = (await read()).profesores.find((x) => x.id === profeId);
    if (!p || (p.foto !== id && !p.docs.some((d) => d.id === id))) return new Response("No autorizado", { status: 403 });
  }

  try {
    const buf = await fs.readFile(path.join(UPLOADS, id));
    const type = { pdf: "application/pdf", jpg: "image/jpeg", png: "image/png", webp: "image/webp" }[id.split(".")[1]]!;
    return new Response(buf, { headers: { "Content-Type": type, "Cache-Control": "private, no-store" } });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
