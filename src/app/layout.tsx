import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "CheckHotel - Sistema de Gestão de Vistorias",
  description: "Plataforma profissional para gestão de governança e vistorias hoteleiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("antialiased", inter.variable)}>
      <body className="font-sans antialiased bg-background selection:bg-primary/10 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
