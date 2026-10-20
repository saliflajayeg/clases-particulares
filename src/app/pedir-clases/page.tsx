import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SolicitudForm } from "./SolicitudForm";

export const metadata: Metadata = { title: "Pedir clases particulares" };

export default function Page() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Pide tus clases particulares</h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Rellena este formulario y en menos de 24 horas te contactamos por WhatsApp con el profesor ideal, que irá a vuestra casa.
        </p>
        <Suspense>
          <SolicitudForm />
        </Suspense>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <Image src="/img/quimica.jpg" alt="Alumna en clase particular de Química" width={1168} height={880} sizes="380px" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <div className="card space-y-3 p-6 text-sm">
            <p className="font-bold">Por qué Clases Particulares GE</p>
            <p>✅ Profesores con títulos y certificados revisados</p>
            <p>🔁 Cambio de profesor sin coste</p>
            <p>💬 Seguimiento mensual por WhatsApp</p>
            <p>🏠 El profesor va a vuestra casa</p>
            <p>💵 Pago mensual en FCFA, sin adelantos</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
