import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Header, Footer, WhatsAppFab } from "@/components/Chrome";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://clases.mercadosemu.com"),
  title: { default: "ProfeGE — Clases particulares en Guinea Ecuatorial", template: "%s · ProfeGE" },
  description:
    "Encuentra profesores particulares verificados en Malabo, Bata y todo Guinea Ecuatorial. Clases a domicilio de 1º de ESBA a 2º de Bachillerato: Matemáticas, Física y Química, Francés, Inglés y todas las asignaturas del plan de estudios.",
  openGraph: { locale: "es_GQ", siteName: "ProfeGE", images: ["/img/hero.jpg"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0f7a3d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${jakarta.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
