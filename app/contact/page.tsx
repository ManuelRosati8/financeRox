import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contatti | financeRox",
  description: "Contatti e supporto di financeRox.",
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", padding: "48px 20px 72px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, width: "fit-content" }}>
          ← Torna a financeRox
        </Link>
        <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
            Contatti
          </span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Supporto, privacy e richieste account
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Per supporto tecnico, richieste privacy, rettifica o cancellazione dati puoi contattare financeRox all'indirizzo seguente.
          </p>
          <a href="mailto:support@financerox.app" style={{ color: "var(--accent)", fontSize: 18, fontWeight: 800, textDecoration: "none" }}>
            support@financerox.app
          </a>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Per segnalare bug puoi anche usare il link email presente nella landing page. Le richieste vengono gestite nei giorni lavorativi.
          </p>
        </div>
      </div>
    </main>
  );
}