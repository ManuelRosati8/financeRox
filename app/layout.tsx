import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "financeRox — Personal Finance",
  description:
    "Traccia entrate, uscite, obiettivi di risparmio e prevedi il tuo futuro finanziario con financeRox.",
  keywords: "finanza personale, risparmio, budget, investimenti",
  authors: [{ name: "financeRox" }],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className="antialiased">
        <Providers>
          <ScrollReveal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
