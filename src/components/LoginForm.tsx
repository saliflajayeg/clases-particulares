"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";

export function LoginForm({ action, conEmail = true, boton }: { action: (s: FormState, f: FormData) => Promise<FormState>; conEmail?: boolean; boton: string }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="space-y-4">
      {conEmail && (
        <div><label className="label">Email</label><input name="email" type="email" required className="field" autoComplete="email" /></div>
      )}
      <div><label className="label">Contraseña</label><input name="password" type="password" required className="field" autoComplete="current-password" /></div>
      {state?.error && <p className="rounded-xl bg-rojo/10 px-4 py-3 text-sm font-medium text-rojo">{state.error}</p>}
      <button disabled={pending} className="btn btn-verde w-full">{pending ? "Entrando…" : boton}</button>
    </form>
  );
}
