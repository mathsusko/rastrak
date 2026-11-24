import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RASTRAK — Psytrance // Full-On Underground",
  description:
    "Web presskit de RASTRAK, projeto de full-on underground de Raphael Ferreira. Arquitetura sonora para pista noturna: grooves hipnóticos, tensão mental e condução técnica. Booking & collabs.",
  openGraph: {
    title: "RASTRAK — Psytrance // Full-On Underground",
    description: "Arquitetura sonora para pista noturna. Booking, collabs e curadoria.",
    images: ["/img/og.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
