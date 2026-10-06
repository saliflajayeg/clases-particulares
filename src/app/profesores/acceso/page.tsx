import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginProfesor } from "@/app/actions";
import { LoginForm } from "@/components/LoginForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Acceso profesores" };

export default async function Page() {
  if (await getSession("profe")) redirect("/profesores/panel");
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="font-display text-3xl font-semibold">Acceso profesores</h1>
        <p className="mb-6 mt-1 text-muted">Entra para ver el estado de tu perfil y tus alumnos asignados.</p>
        <LoginForm action={loginProfesor} boton="Entrar" />
        <p className="mt-6 text-center text-sm text-muted">
          ¿Aún no tienes cuenta? <Link href="/profesores/registro" className="font-semibold text-verde">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
