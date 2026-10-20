import Link from "next/link";
import { Logo } from "./Logo";
import { DEMO, WHATSAPP, WHATSAPP_PRETTY } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 whitespace-nowrap text-[15px] text-muted lg:flex">
          <Link href="/#como-funciona" className="hover:text-ink">Cómo funciona</Link>
          <Link href="/#cursos" className="hover:text-ink">Cursos</Link>
          <Link href="/#precios" className="hover:text-ink">Precios</Link>
          <Link href="/profesores" className="hover:text-ink">Trabaja con nosotros</Link>
        </nav>
        <div className="flex items-center gap-2">
          {!DEMO && (
            <Link href="/profesores/acceso" className="hidden whitespace-nowrap px-3 text-sm font-semibold text-muted hover:text-ink sm:block">
              Acceso profesores
            </Link>
          )}
          <Link href="/pedir-clases" className="btn btn-verde whitespace-nowrap !px-5 !py-2.5 text-sm">
            Pedir clases
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo claro />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Clases particulares con profesores verificados en Malabo, Bata y todo el país. Clases a domicilio
            de 1º de ESBA a 2º de Bachillerato.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Familias y alumnos</p>
          <ul className="space-y-2">
            <li><Link href="/pedir-clases" className="hover:text-white">Pedir clases</Link></li>
            <li><Link href="/#precios" className="hover:text-white">Precios</Link></li>
            <li><Link href="/#faq" className="hover:text-white">Preguntas frecuentes</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Profesores</p>
          <ul className="space-y-2">
            <li><Link href="/profesores" className="hover:text-white">Trabaja con nosotros</Link></li>
            <li><Link href="/profesores/registro" className="hover:text-white">Regístrate</Link></li>
            {!DEMO && <li><Link href="/profesores/acceso" className="hover:text-white">Acceso profesores</Link></li>}
            <li><a href={`https://wa.me/${WHATSAPP}`} className="hover:text-white">WhatsApp {WHATSAPP_PRETTY}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Clases Particulares GE · Hecho en Guinea Ecuatorial 🇬🇶
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola Clases Particulares GE, quiero información sobre clases particulares")}`}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.1 0 12 0 5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.8 1 3.8 1.5 5.7 1.5 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4z"/></svg>
    </a>
  );
}
