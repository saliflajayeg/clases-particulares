import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import { Header, Footer, WhatsAppFab } from "@/components/Chrome";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://clases.mercadosemu.com"),
  title: { default: "Clases Particulares GE — Apoyo escolar a domicilio en Guinea Ecuatorial", template: "%s · Clases Particulares GE" },
  description:
    "Encuentra profesores particulares verificados en Malabo, Bata y todo Guinea Ecuatorial. Clases a domicilio de 1º de ESBA a 2º de Bachillerato: Matemáticas, Física y Química, Francés, Inglés y todas las asignaturas del plan de estudios.",
  openGraph: { locale: "es_GQ", siteName: "Clases Particulares GE", images: [{ url: "/img/banner.jpg", width: 1600, height: 595, alt: "Clases Particulares GE — apoyo escolar a domicilio" }] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d2b6b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${jakarta.variable} ${montserrat.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
