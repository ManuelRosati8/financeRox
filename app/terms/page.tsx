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

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", padding: "48px 20px 72px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, width: "fit-content" }}>
            ← Torna a financeRox
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
            <p>financeRox è un'applicazione per la gestione personale delle finanze. Le informazioni fornite hanno finalità organizzative e informative e non costituiscono consulenza fiscale, legale o finanziaria professionale.</p>
          </Section>

          <Section title="2. Account e sicurezza">
            <p>L'utente è responsabile dell'accuratezza dei dati inseriti e della riservatezza delle credenziali di accesso. In caso di uso non autorizzato, è necessario contattare il supporto appena possibile.</p>
          </Section>

          <Section title="3. Funzionalità beta preview">
            <p>Alcune funzionalità possono essere indicate come beta preview o in evoluzione. Questo significa che l'interfaccia, i limiti o il comportamento possono cambiare senza preavviso per migliorare il servizio.</p>
          </Section>

          <Section title="4. Prezzi e pagamenti">
            <p>Alla data di questo documento, il sito pubblico non conclude vendite e non raccoglie pagamenti online. Eventuali piani futuri a pagamento saranno pubblicati con termini e prezzi dedicati prima dell'attivazione commerciale.</p>
          </Section>

          <Section title="5. Cancellazione account e dati">
            <p>L'utente può richiedere la cancellazione del proprio account e dei dati associati dalle impostazioni disponibili nell'app o scrivendo a <a href="mailto:support@financerox.app" style={{ color: "var(--accent)" }}>support@financerox.app</a>.</p>
          </Section>

          <Section title="6. Limitazione di responsabilità">
            <p>financeRox viene fornito così com'è. Pur adottando misure ragionevoli di sicurezza e qualità, non è possibile garantire l'assenza assoluta di errori, interruzioni o stime perfettamente accurate.</p>
          </Section>
        </div>
      </div>
    </main>
  );
}