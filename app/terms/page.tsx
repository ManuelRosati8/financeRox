import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini di utilizzo | financeRox",
  description: "Termini di utilizzo del servizio financeRox.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}

type InfoPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

function getBackHref(returnTo?: string) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}

export default async function TermsPage({ searchParams }: InfoPageProps) {
  const { returnTo } = await searchParams;
  const backHref = getBackHref(returnTo);
  const backLabel = backHref === "/" ? "← Torna a financeRox" : "← Torna indietro";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", padding: "48px 20px 72px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href={backHref} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, width: "fit-content" }}>
            {backLabel}
          </Link>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
            Termini di utilizzo
          </span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Condizioni generali del servizio
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Ultimo aggiornamento: 23 aprile 2026. Usando financeRox accetti le seguenti condizioni.
          </p>
        </div>

        <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
          <Section title="1. Natura del servizio">
            <p>financeRox è un&apos;applicazione per la gestione personale delle finanze. Le informazioni fornite hanno finalità organizzative e informative e non costituiscono consulenza fiscale, legale o finanziaria professionale.</p>
          </Section>

          <Section title="2. Account e sicurezza">
            <p>L&apos;utente è responsabile dell&apos;accuratezza dei dati inseriti e della riservatezza delle credenziali di accesso. In caso di uso non autorizzato, è necessario contattare il supporto appena possibile.</p>
          </Section>

          <Section title="3. Funzionalità beta preview">
            <p>Alcune funzionalità possono essere indicate come beta preview o in evoluzione. Questo significa che l&apos;interfaccia, i limiti o il comportamento possono cambiare senza preavviso per migliorare il servizio.</p>
          </Section>

          <Section title="4. Prezzi e pagamenti">
            <p>Alla data di questo documento, il sito pubblico non conclude vendite e non raccoglie pagamenti online. Eventuali piani futuri a pagamento saranno pubblicati con termini e prezzi dedicati prima dell&apos;attivazione commerciale.</p>
          </Section>

          <Section title="5. Cancellazione account e dati">
            <p>L&apos;utente può richiedere la cancellazione del proprio account e dei dati associati dalle impostazioni disponibili nell&apos;app o scrivendo a <a href="mailto:support.financerox@gmail.com" style={{ color: "var(--accent)" }}>support.financerox@gmail.com</a>.</p>
          </Section>

          <Section title="6. Limitazione di responsabilità">
            <p>financeRox viene fornito così com&apos;è. Pur adottando misure ragionevoli di sicurezza e qualità, non è possibile garantire l&apos;assenza assoluta di errori, interruzioni o stime perfettamente accurate.</p>
          </Section>
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