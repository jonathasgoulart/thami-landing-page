import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiquei Assim - THAMI",
  description: "Experiência Vintage R&B - Ouça agora o novo single",
};

import { Watermark } from "@/components/Watermark";
import { FacebookPixel } from "@/components/FacebookPixel";
import { Analytics } from "@/components/Analytics";
import { getSiteContent } from "@/lib/db";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        <FacebookPixel />
        <Analytics />
        <Watermark url={content.theme?.watermark} />
        {children}
      </body>
    </html>
  );
}
