import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: "CheckHotel - Premium Inspection System",
  description: "Advanced PWA for luxury hotel inspection and housekeeping management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans antialiased", playfair.variable, plusJakarta.variable)}>
      <body className="antialiased bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
