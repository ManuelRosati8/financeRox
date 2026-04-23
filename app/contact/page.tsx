import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contatti | financeRox",
  description: "Contatti e supporto di financeRox.",
};

type ContactPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

function getBackHref(returnTo?: string) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { returnTo } = await searchParams;
  const backHref = getBackHref(returnTo);
  const backLabel = backHref === "/" ? "← Torna a financeRox" : "← Torna indietro";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", padding: "48px 20px 72px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <Link href={backHref} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, width: "fit-content" }}>
          {backLabel}
        </Link>
        <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
            Contatti
          </span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Supporto, privacy e richieste account
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Per supporto tecnico, richieste privacy, rettifica o cancellazione dati puoi contattare financeRox all&apos;indirizzo seguente.
          </p>
          <a href="mailto:support@financerox.app" style={{ color: "var(--accent)", fontSize: 18, fontWeight: 800, textDecoration: "none" }}>
            support@financerox.app
          </a>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Per segnalare bug puoi anche usare il link email presente nella landing page. Le richieste vengono gestite nei giorni lavorativi.
          </p>
        </div>

        <div style={{ position: "sticky", bottom: 16, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
          <Link
            href={backHref}
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 132,
              padding: "12px 18px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 16px 32px rgba(15,23,42,0.16)",
            }}
          >
            Chiudi
          </Link>
        </div>
      </div>
    </main>
  );
}