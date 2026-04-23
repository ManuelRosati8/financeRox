import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | financeRox",
  description: "Informativa privacy di financeRox sul trattamento dei dati personali e sull'uso di Supabase.",
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

export default async function PrivacyPage({ searchParams }: InfoPageProps) {
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
            Privacy Policy
          </span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Informativa sul trattamento dei dati personali
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Ultimo aggiornamento: 23 aprile 2026. Questa informativa descrive come financeRox tratta i dati raccolti tramite il sito e l&apos;applicazione.
          </p>
        </div>

        <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
          <Section title="1. Titolare e contatti">
            <p>
              Per richieste privacy, accesso, rettifica o cancellazione dei dati puoi scrivere a <a href="mailto:support@financerox.app" style={{ color: "var(--accent)" }}>support@financerox.app</a>.
            </p>
          </Section>

          <Section title="2. Dati raccolti">
            <p>financeRox può trattare i seguenti dati:</p>
            <p>Nome, cognome ed email forniti in fase di registrazione.</p>
            <p>Dati di autenticazione gestiti tramite Supabase Auth.</p>
            <p>Dati finanziari inseriti volontariamente nell&apos;app, come transazioni, categorie, obiettivi e preferenze.</p>
            <p>Dati tecnici essenziali per il funzionamento del servizio, come sessione, log di accesso e preferenze di interfaccia.</p>
          </Section>

          <Section title="3. Finalità e base giuridica">
            <p>I dati vengono trattati per creare e gestire l&apos;account, fornire le funzionalità dell&apos;app, proteggere la sicurezza del servizio e rispondere alle richieste di supporto.</p>
            <p>La base giuridica principale è l&apos;esecuzione del servizio richiesto dall&apos;utente. Gli eventuali contatti di supporto sono trattati per dare seguito alla richiesta ricevuta.</p>
          </Section>

          <Section title="4. Dove sono ospitati i dati">
            <p>I dati applicativi e di autenticazione sono ospitati tramite Supabase, fornitore di infrastruttura e database usato da financeRox per autenticazione, persistenza e sessione.</p>
          </Section>

          <Section title="5. Conservazione">
            <p>I dati dell&apos;account restano conservati finché l&apos;account è attivo o finché necessario per erogare il servizio. Su richiesta di cancellazione, i dati vengono rimossi o anonimizzati compatibilmente con gli obblighi tecnici e legali applicabili.</p>
          </Section>

          <Section title="6. Diritti dell'utente">
            <p>Puoi chiedere accesso, rettifica, aggiornamento, esportazione o cancellazione dei tuoi dati. Puoi anche chiudere il tuo account dalle impostazioni dell&apos;app o contattare il supporto.</p>
          </Section>

          <Section title="7. Pagamenti e funzionalità beta">
            <p>Alla data di questo documento, financeRox non raccoglie pagamenti dal sito pubblico. Le funzioni contrassegnate come beta preview sono soggette a evoluzione e non costituiscono un&apos;offerta commerciale con prezzo pubblicato.</p>
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