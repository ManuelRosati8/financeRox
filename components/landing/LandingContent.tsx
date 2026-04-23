"use client";

import Link from "next/link";
import {
  ArrowRight, BarChart3, Calendar, Zap, TrendingUp, Shield,
  Sparkles, Tag, Target, CheckCircle2, ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Type ────────────────────────────────────────────────────────────────────
type S = typeof it;

// ─── Italian strings ─────────────────────────────────────────────────────────
const it = {
  heroBadge: "Personal Finance Intelligente — Versione 2.0",
  heroH1a: "Controlla il Tuo",
  heroH1b: "Futuro Finanziario",
  heroSub: "Traccia entrate e uscite, visualizza proiezioni a 24 mesi e scopri un calendario finanziario interattivo che prevede ogni movimento sul tuo conto.",
  heroSupportLine: "Ti ritrovi con la calcolatrice? financeRox ti aiuta gia a leggere saldo attuale, entrate del mese, obiettivi e ricorrenze fisse senza rifare i conti a mano.",
  ctaDashboard: "Vai alla Dashboard",
  ctaStart: "Inizia Gratis",
  ctaSettings: "Impostazioni",
  ctaDemo: "Guarda la Demo",
  proofs: ["✅ Nessuna carta di credito", "🔒 Dati crittografati", "⚡ Sincronizzazione in tempo reale"],
  kpis: [
    { label: "Saldo Totale",   value: "€ 12.450", color: "#f97316" },
    { label: "Entrate Mese",   value: "€ 3.200",  color: "#22c55e" },
    { label: "Uscite Mese",    value: "€ 1.840",  color: "#ef4444" },
    { label: "Safe to Spend",  value: "€ 890",    color: "#f59e0b" },
  ],
  problemTitlePre: "Stanco di usare",
  problemTitleGrad: "la calcolatrice",
  problemTitlePost: "per le tue finanze?",
  problemIntro: "Ti riconosci in almeno una di queste situazioni?",
  problemItems: [
    { icon: "📊", text: "Apri Excel ogni mese e ricominci da capo a sommare entrate e uscite" },
    { icon: "🤔", text: "Non sai mai quanto puoi davvero spendere senza andare in rosso" },
    { icon: "🎯", text: "Hai un obiettivo di risparmio ma non sai se ce la farai" },
    { icon: "🔮", text: "Vorresti sapere com'è il tuo saldo tra 6 mesi ma non hai idea da dove cominciare" },
  ],
  problemClosingPre: "A tutto questo ci pensa",
  problemClosingPost: "— in automatico, ogni giorno.",
  closingBrand: "financeRox",
  featuresH2a: "Tutto sotto controllo,",
  featuresH2b: "in un solo posto",
  featuresSub: "Dashboard intuitive, grafici in tempo reale e proiezioni intelligenti per il tuo patrimonio.",
  bentoCards: [
    { badge: "Dashboard", badgeAccent: true, title: "Panoramica Finanziaria Completa", description: "KPI in tempo reale: saldo totale, entrate/uscite mensili, tasso di risparmio. Clicca su qualsiasi valore per aggiustare il saldo in un attimo." },
    { badge: "Safe to Spend", title: "Sai Sempre Quanto Puoi Spendere", description: "Calcola automaticamente il denaro libero sottraendo tutte le uscite fisse ricorrenti previste fino a fine mese." },
    { badge: "Future Self · Beta Preview", badgeAccent: true, title: "Proiezione Patrimonio 24 Mesi", description: "Vedi dove sarà il tuo conto tra 6, 12 o 24 mesi basandoti sulle ricorrenze reali. Le funzioni avanzate sono in beta preview e possono evolvere." },
    { badge: "Calendario · Beta Preview", title: "Running Balance Giornaliero", description: "Calendario mensile interattivo con saldo previsto per ogni giorno. I giorni in rosso segnalano saldo negativo: nessuna sorpresa di fine mese." },
    { badge: "Categorie", title: "Classifica con chiarezza", description: "Organizza ogni entrata e uscita con categorie visive e filtri immediati per capire subito dove va il tuo denaro." },
    { badge: "Lifestyle Inflation", title: "Analisi Incremento Stile di Vita", description: "Widget che confronta la crescita delle uscite variabili rispetto alle entrate negli ultimi 6 mesi per prevenire il lifestyle creep." },
    { badge: "Obiettivi", title: "Obiettivi di Risparmio", description: "Imposta un traguardo, monitora il progresso e destina una quota delle entrate direttamente al tuo obiettivo di risparmio." },
  ],
  futureBadge: "FUTURE SELF · BETA PREVIEW",
  futureH2a: "Vedi dove sarai",
  futureH2b: "tra 6, 12 e 24 mesi",
  futureSub: "La proiezione si basa sulle tue ricorrenze reali + media spese variabili degli ultimi 3 mesi. Ogni mese fai crescere un piano, non solo un numero.",
  futureBullets: [
    { icon: "📈", text: "Proiezione patrimonio personalizzata su 24 mesi" },
    { icon: "🔄", text: "Ricorrenze attive rilevate automaticamente" },
    { icon: "⚡", text: "Simulatore What-If: testa nuove entrate o uscite" },
  ],
  futureMockLabel: "Proiezione del tuo patrimonio",
  futureMockBasis: "Basato sulle tue abitudini attuali",
  futureMilestones: [{ label: "+6 mesi", value: "€ 15.200" }, { label: "+12 mesi", value: "€ 19.650" }, { label: "+24 mesi", value: "€ 28.100" }],
  calendarBadge: "CALENDARIO · BETA PREVIEW",
  calendarH2a: "Ogni giorno ha",
  calendarH2b: "il suo saldo previsto",
  calendarSub: "Il calendario proietta in automatico tutte le ricorrenze attive nel mese in corso. Clicca qualsiasi giorno per vederne i dettagli o aggiungere una transazione.",
  calendarBullets: [
    { icon: "📅", text: "Saldo running aggiornato giorno per giorno" },
    { icon: "🔴", text: "I giorni in rosso segnalano saldo negativo" },
    { icon: "➕", text: "Tap su un giorno → aggiungi transazione istantanea" },
  ],
  calendarMonth: "Marzo 2026",
  calendarWeekdays: ["L", "M", "M", "G", "V", "S", "D"],
  calendarLegend: [{ color: "#22c55e", label: "Entrata" }, { color: "#ef4444", label: "Uscita" }, { color: "var(--accent)", label: "Oggi" }],
  highlights: [
    { value: "24 mesi", label: "Proiezione patrimonio" },
    { value: "0",       label: "Carta di credito richiesta" },
    { value: "100%",    label: "Dati crittografati su Supabase" },
  ],
  faqBadge: "FAQ",
  faqTitle: "Domande Frequenti",
  faqSub: "Tutto quello che devi sapere per iniziare con financeRox.",
  faq: [
    { q: "Come aggiungo una transazione?", a: "Usa il pulsante \"+\" arancione in basso a destra in qualsiasi schermata, oppure vai nella sezione Transazioni e clicca \"Nuova Transazione\". Puoi registrare entrate, uscite, e indicare se si tratta di una spesa ricorrente (affitto, abbonamenti, ecc.)." },
    { q: "Cos'è il \"Safe to Spend\" (Denaro Libero)?", a: "È la somma che puoi spendere liberamente: saldo attuale meno le spese ricorrenti non ancora avvenute in questo mese. Serve a capire quanto puoi usare senza compromettere il resto del mese." },
    { q: "Come funzionano gli Obiettivi di Risparmio?", a: "Nella sezione Obiettivi crei un traguardo (es. \"Vacanza 2025 — €3000\") con una data limite e un importo corrente. L'app calcola quanto devi risparmiare ogni mese per arrivarci in tempo. Quando registri un'entrata, puoi destinare direttamente una percentuale o quota fissa a un obiettivo." },
    { q: "Come funziona il Calendario Finanziario?", a: "Lo trovi nella sezione Future Self. Mostra, giorno per giorno, tutte le entrate e uscite ricorrenti previste per il mese visualizzato. Puoi navigare avanti e indietro tra i mesi con le frecce. Il saldo stimato viene proiettato automaticamente in base alle transazioni ricorrenti." },
    { q: "Cosa sono le transazioni ricorrenti?", a: "Sono transazioni che si ripetono automaticamente con una certa frequenza (giornaliera, settimanale, mensile, annuale). Una volta registrata la prima occorrenza e spuntata l'opzione \"Ricorrente\", financeRox le include automaticamente nel Calendario e nelle proiezioni Future Self." },
    { q: "Come funziona la proiezione Future Self?", a: "Analizza il totale di entrate e uscite ricorrenti per stimare il tuo saldo mese per mese fino a 24 mesi nel futuro. Mostra milestone finanziarie (es. quando raggiungerai €10.000) e un grafico con la curva del patrimonio nel tempo." },
    { q: "Posso collegare il mio conto bancario?", a: "Al momento financeRox funziona con inserimento manuale delle transazioni — questo ti garantisce massimo controllo e privacy. L'integrazione con i conti bancari è nella roadmap e verrà annunciata solo quando saranno pubblicati termini e condizioni specifici." },
    { q: "I miei dati sono al sicuro?", a: "Sì. I dati sono memorizzati su Supabase con autenticazione sicura e crittografia. Non condividiamo mai le tue informazioni finanziarie con terze parti. Puoi esportare o eliminare il tuo account in qualsiasi momento dalle Impostazioni." },
  ],
  bugTitle: "Hai trovato un problema?",
  bugSub: "Aiutaci a migliorare financeRox. Segnala bug, comportamenti inattesi o suggerisci nuove funzionalità — ogni feedback conta!",
  bugChecklistTitle: "Includi nel report",
  bugItems: [
    "Descrizione del problema riscontrato",
    "Passaggi per riprodurlo (es. clicco su X, poi Y…)",
    "Qual era il comportamento atteso",
    "Screenshot o registrazione schermo (se possibile)",
  ],
  bugBtn: "✉️ Invia via Email",
  bugNote: "Risposta entro 24–48 ore nei giorni lavorativi.",
  ctaBadge: "Gratuito per sempre nel piano Base",
  ctaH2: "Pronto a prendere il controllo?",
  ctaSub: "Inizia gratuitamente. Nessuna carta di credito.\nSetup in meno di 2 minuti.",
  ctaBtn: "Parti subito — è gratuito",
  ctaBtnLoggedIn: "Vai alla Dashboard",
  footerCopyright: "Tutti i diritti riservati",
  footerLinks: ["Privacy", "Termini", "Contatti"],
};

// ─── English strings ──────────────────────────────────────────────────────────
const en: S = {
  heroBadge: "Intelligent Personal Finance — Version 2.0",
  heroH1a: "Take Control of Your",
  heroH1b: "Financial Future",
  heroSub: "Track income and expenses, view 24-month projections and explore an interactive financial calendar that predicts every movement in your account.",
  heroSupportLine: "Still reaching for a calculator? financeRox already helps you read your current balance, monthly income, goals and fixed recurring items without redoing the math by hand.",
  ctaDashboard: "Go to Dashboard",
  ctaStart: "Start for Free",
  ctaSettings: "Settings",
  ctaDemo: "View Demo",
  proofs: ["✅ No credit card required", "🔒 Encrypted data", "⚡ Real-time sync"],
  kpis: [
    { label: "Total Balance",     value: "€ 12,450", color: "#f97316" },
    { label: "Monthly Income",    value: "€ 3,200",  color: "#22c55e" },
    { label: "Monthly Expenses",  value: "€ 1,840",  color: "#ef4444" },
    { label: "Safe to Spend",     value: "€ 890",    color: "#f59e0b" },
  ],
  problemTitlePre: "Tired of using",
  problemTitleGrad: "a calculator",
  problemTitlePost: "for your finances?",
  problemIntro: "Do any of these situations sound familiar?",
  problemItems: [
    { icon: "📊", text: "You open a spreadsheet every month and start re-adding income and expenses from scratch" },
    { icon: "🤔", text: "You never know how much you can actually spend without going into the red" },
    { icon: "🎯", text: "You have a savings goal but don't know if you'll make it" },
    { icon: "🔮", text: "You'd like to know what your balance will be in 6 months but have no idea where to start" },
  ],
  problemClosingPre: "",
  problemClosingPost: "handles all of this — automatically, every day.",
  closingBrand: "financeRox",
  featuresH2a: "Everything under control,",
  featuresH2b: "in one place",
  featuresSub: "Intuitive dashboards, real-time charts and intelligent projections for your wealth.",
  bentoCards: [
    { badge: "Dashboard", badgeAccent: true, title: "Complete Financial Overview", description: "Real-time KPIs: total balance, monthly income/expenses, savings rate. Click any value to adjust your balance instantly." },
    { badge: "Safe to Spend", title: "Always Know How Much You Can Spend", description: "Automatically calculates your free money by subtracting all recurring fixed expenses expected by end of month." },
    { badge: "Future Self · Beta Preview", badgeAccent: true, title: "24-Month Wealth Projection", description: "See where your account will be in 6, 12 or 24 months based on real recurring transactions. Advanced tools are in beta preview and may evolve." },
    { badge: "Calendar · Beta Preview", title: "Daily Running Balance", description: "Interactive monthly calendar with projected balance for every day. Red days signal a negative balance: no end-of-month surprises." },
    { badge: "Categories", title: "Classify with clarity", description: "Organise every income and expense with visual categories and instant filters so you can immediately see where your money goes." },
    { badge: "Lifestyle Inflation", title: "Lifestyle Spending Analysis", description: "Widget that compares the growth of variable expenses vs income over the last 6 months to prevent lifestyle creep." },
    { badge: "Goals", title: "Savings Goals", description: "Set a target, track progress and allocate part of your income directly to a savings goal." },
  ],
  futureBadge: "FUTURE SELF · BETA PREVIEW",
  futureH2a: "See where you'll be",
  futureH2b: "in 6, 12 and 24 months",
  futureSub: "The projection is based on your real recurring transactions plus the average variable expenses of the last 3 months. Every month, grow a plan — not just a number.",
  futureBullets: [
    { icon: "📈", text: "Personalised wealth projection over 24 months" },
    { icon: "🔄", text: "Active recurrences detected automatically" },
    { icon: "⚡", text: "What-If simulator: test new income or expenses" },
  ],
  futureMockLabel: "Your wealth projection",
  futureMockBasis: "Based on your current habits",
  futureMilestones: [{ label: "+6 months", value: "€ 15,200" }, { label: "+12 months", value: "€ 19,650" }, { label: "+24 months", value: "€ 28,100" }],
  calendarBadge: "CALENDAR · BETA PREVIEW",
  calendarH2a: "Every day has",
  calendarH2b: "its projected balance",
  calendarSub: "The calendar automatically projects all active recurrences for the current month. Click any day to view details or add a transaction.",
  calendarBullets: [
    { icon: "📅", text: "Running balance updated day by day" },
    { icon: "🔴", text: "Red days flag a negative balance" },
    { icon: "➕", text: "Tap a day → add an instant transaction" },
  ],
  calendarMonth: "March 2026",
  calendarWeekdays: ["M", "T", "W", "T", "F", "S", "S"],
  calendarLegend: [{ color: "#22c55e", label: "Income" }, { color: "#ef4444", label: "Expense" }, { color: "var(--accent)", label: "Today" }],
  highlights: [
    { value: "24 months", label: "Wealth projection" },
    { value: "0",         label: "Credit card required" },
    { value: "100%",      label: "Data encrypted on Supabase" },
  ],
  faqBadge: "FAQ",
  faqTitle: "Frequently Asked Questions",
  faqSub: "Everything you need to know to get started with financeRox.",
  faq: [
    { q: "How do I add a transaction?", a: "Use the orange \"+\" button at the bottom right of any screen, or go to the Transactions section and click \"New Transaction\". You can record income, expenses, and mark whether it's a recurring expense (rent, subscriptions, etc.)." },
    { q: "What is \"Safe to Spend\"?", a: "It's the amount you can spend freely: your current balance minus recurring expenses that haven't occurred yet this month. It helps you understand what remains available without putting the rest of the month at risk." },
    { q: "How do Savings Goals work?", a: "In the Goals section, create a target (e.g. \"Vacation 2025 — €3,000\") with a deadline and current amount. The app calculates how much you need to save each month to reach it in time. When you record income, you can directly allocate a percentage or fixed amount to a goal." },
    { q: "How does the Financial Calendar work?", a: "You'll find it in the Future Self section. It shows, day by day, all projected recurring income and expenses for the displayed month. Navigate forward and backward between months using the arrows. The estimated balance is automatically projected based on recurring transactions." },
    { q: "What are recurring transactions?", a: "They are transactions that repeat automatically at a given frequency (daily, weekly, monthly, yearly). Once you register the first occurrence and check the \"Recurring\" option, financeRox automatically includes them in the Calendar and Future Self projections." },
    { q: "How does the Future Self projection work?", a: "It analyses the total of recurring income and expenses to estimate your balance month by month up to 24 months in the future. It shows financial milestones (e.g. when you'll reach €10,000) and a chart with your wealth curve over time." },
    { q: "Can I connect my bank account?", a: "Currently financeRox works with manual transaction entry — this guarantees maximum control and privacy. Bank account integration is on the roadmap and will be announced only once dedicated terms are published." },
    { q: "Is my data secure?", a: "Yes. Data is stored on Supabase with secure authentication and encryption. We never share your financial information with third parties. You can export or delete your account at any time from Settings." },
  ],
  bugTitle: "Found an issue?",
  bugSub: "Help us improve financeRox. Report bugs, unexpected behaviour or suggest new features — every piece of feedback counts!",
  bugChecklistTitle: "Include in your report",
  bugItems: [
    "Description of the issue encountered",
    "Steps to reproduce it (e.g. I click on X, then Y…)",
    "What the expected behaviour was",
    "Screenshot or screen recording (if possible)",
  ],
  bugBtn: "✉️ Send via Email",
  bugNote: "Response within 24–48 hours on working days.",
  ctaBadge: "Free forever on the Basic plan",
  ctaH2: "Ready to take control?",
  ctaSub: "Start for free. No credit card.\nSetup in less than 2 minutes.",
  ctaBtn: "Get started — it's free",
  ctaBtnLoggedIn: "Go to Dashboard",
  footerCopyright: "All rights reserved",
  footerLinks: ["Privacy", "Terms", "Contact"],
};

// ─── BentoCard (server-safe) ──────────────────────────────────────────────────
function BentoCard({ gridColumn, id, icon, badge, badgeAccent, title, description, className }: {
  gridColumn?: string; id?: string; icon: React.ReactNode;
  badge: string; badgeAccent?: boolean; title: string; description: string; className?: string;
}) {
  return (
    <div id={id} className={className} style={{ gridColumn, background: "var(--glass-bg)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: badgeAccent ? "1px solid rgba(249,115,22,0.28)" : "1px solid var(--glass-border)", borderRadius: 18, padding: "28px 28px 30px" }}>
      <div style={{ marginBottom: 14 }}>{icon}</div>
      <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 99, marginBottom: 12, background: badgeAccent ? "rgba(249,115,22,0.12)" : "var(--bg-subtle)", color: badgeAccent ? "var(--accent)" : "var(--text-muted)", border: badgeAccent ? "1px solid rgba(249,115,22,0.2)" : "1px solid var(--border-subtle)" }}>{badge}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{description}</p>
    </div>
  );
}

// ─── Calendar day data (same for both locales) ────────────────────────────────
const CAL_DAYS = [
  { d: 1,  e: false, t: "",        today: false, bal: null },
  { d: 2,  e: false, t: "",        today: false, bal: null },
  { d: 3,  e: true,  t: "income",  today: false, bal: "+320" },
  { d: 4,  e: false, t: "",        today: false, bal: null },
  { d: 5,  e: true,  t: "expense", today: false, bal: "-85" },
  { d: 6,  e: false, t: "",        today: false, bal: null },
  { d: 7,  e: false, t: "",        today: false, bal: null },
  { d: 8,  e: false, t: "",        today: false, bal: null },
  { d: 9,  e: false, t: "",        today: false, bal: null },
  { d: 10, e: true,  t: "expense", today: false, bal: "-120" },
  { d: 11, e: false, t: "",        today: false, bal: null },
  { d: 12, e: false, t: "",        today: false, bal: null },
  { d: 13, e: false, t: "",        today: false, bal: null },
  { d: 14, e: false, t: "",        today: false, bal: null },
  { d: 15, e: true,  t: "expense", today: false, bal: "-200" },
  { d: 16, e: false, t: "",        today: false, bal: null },
  { d: 17, e: false, t: "",        today: false, bal: null },
  { d: 18, e: false, t: "",        today: false, bal: null },
  { d: 19, e: false, t: "",        today: false, bal: null },
  { d: 20, e: false, t: "",        today: false, bal: null },
  { d: 21, e: false, t: "",        today: true,  bal: "12.180" },
  { d: 22, e: true,  t: "income",  today: false, bal: "+1.800" },
  { d: 23, e: false, t: "",        today: false, bal: null },
  { d: 24, e: false, t: "",        today: false, bal: null },
  { d: 25, e: true,  t: "expense", today: false, bal: "-45" },
  { d: 26, e: false, t: "",        today: false, bal: null },
  { d: 27, e: false, t: "",        today: false, bal: null },
  { d: 28, e: false, t: "",        today: false, bal: null },
  { d: 29, e: false, t: "",        today: false, bal: null },
  { d: 30, e: true,  t: "expense", today: false, bal: "-850" },
  { d: 31, e: false, t: "",        today: false, bal: null },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export function LandingContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { locale } = useI18n();
  const s = locale === "en" ? en : it;
  const compliance = locale === "en"
    ? {
        title: "Public beta notice",
        body: "financeRox currently offers the public app experience without collecting payments on the website. Advanced modules are marked as beta preview and may change before any paid launch.",
        points: [
          "Account and app data are handled via Supabase.",
          "No card details or mock payments are requested on this site.",
          "Privacy, terms and contact pages are available before registration.",
        ],
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      }
    : {
        title: "Avviso beta pubblica",
        body: "financeRox offre oggi l'esperienza pubblica dell'app senza raccogliere pagamenti dal sito. I moduli avanzati sono indicati come beta preview e possono cambiare prima di un eventuale lancio commerciale.",
        points: [
          "I dati dell'account e dell'app sono gestiti tramite Supabase.",
          "Sul sito non vengono richiesti dati carta né simulazioni di pagamento.",
          "Privacy, termini e contatti sono disponibili prima della registrazione.",
        ],
        privacy: "Privacy",
        terms: "Termini",
        contact: "Contatti",
      };

  const bentoIcons = [
    <BarChart3 key="bc" size={22} color="var(--accent)" />,
    <Shield    key="sh" size={22} color="#22c55e" />,
    <Zap       key="zp" size={22} color="var(--accent)" />,
    <Calendar  key="ca" size={22} color="#f59e0b" />,
    <Tag       key="tg" size={22} color="#8b5cf6" />,
    <TrendingUp key="tu" size={22} color="#f59e0b" />,
    <Target    key="ta" size={22} color="#06b6d4" />,
  ];

  const bentoIds   = [undefined, undefined, "futureself", "calendar", undefined, undefined, undefined];
  const bentoCols  = ["span 7","span 5","span 5","span 7","span 4","span 4","span 4"];
  const bentoClass = ["reveal reveal-d1","reveal reveal-d2","reveal reveal-d1","reveal reveal-d2","reveal reveal-d1","reveal reveal-d2","reveal reveal-d3"];

  return (
    <>
      {/* ─── HERO ─── */}
      <section style={{ padding: "110px 6% 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.11) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "7px 18px", borderRadius: 99, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <Sparkles size={13} color="var(--accent)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{s.heroBadge}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: 24 }}>
            {s.heroH1a}<br />
            <span style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {s.heroH1b}
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.7 }}>
            {s.heroSub}
          </p>

          <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 760, margin: "-24px auto 36px", lineHeight: 1.75 }}>
            {s.heroSupportLine}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={isLoggedIn ? "/dashboard" : "/register"} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--accent)", color: "white", padding: "15px 36px", borderRadius: 99, fontSize: 15, fontWeight: 800, textDecoration: "none", boxShadow: "0 8px 28px rgba(249,115,22,0.4)" }}>
              {isLoggedIn ? s.ctaDashboard : s.ctaStart}
              <ArrowRight size={16} />
            </Link>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bg-elevated)", color: "var(--text-primary)", padding: "15px 36px", borderRadius: 99, fontSize: 15, fontWeight: 700, textDecoration: "none", border: "1px solid var(--border)" }}>
              {isLoggedIn ? s.ctaSettings : s.ctaDemo}
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {s.proofs.map((item) => (
              <span key={item} style={{ fontSize: 12, color: "var(--text-muted)" }}>{item}</span>
            ))}
          </div>

          <div className="glass" style={{ marginTop: 28, padding: "18px 20px", textAlign: "left", maxWidth: 760, marginInline: "auto", border: "1px solid rgba(249,115,22,0.18)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              {compliance.title}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 12 }}>
              {compliance.body}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {compliance.points.map((item) => (
                <span key={item} style={{ fontSize: 13, color: "var(--text-secondary)" }}>• {item}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>{compliance.privacy}</Link>
              <Link href="/terms" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>{compliance.terms}</Link>
              <Link href="/contact" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>{compliance.contact}</Link>
            </div>
          </div>
        </div>

        {/* App preview mockup */}
        <div style={{ marginTop: 72, maxWidth: 960, margin: "72px auto 0", background: "var(--bg-surface)", border: "1px solid rgba(249,115,22,0.12)", borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(249,115,22,0.08)" }}>
          {/* Browser chrome */}
          <div style={{ padding: "14px 20px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ marginLeft: 14, fontSize: 12, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>financeRox — Dashboard</span>
          </div>
          {/* KPI grid */}
          <div style={{ padding: "28px 28px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {s.kpis.map((kpi) => (
              <div key={kpi.label} style={{ background: "var(--bg-subtle)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{kpi.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: kpi.color, fontFamily: "JetBrains Mono, monospace" }}>{kpi.value}</div>
              </div>
            ))}
          </div>
          {/* Mini bar chart */}
          <div style={{ padding: "16px 28px 28px", display: "flex", gap: 6, alignItems: "flex-end", height: 90 }}>
            {[60, 82, 48, 90, 65, 78].map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: "stretch" }}>
                <div style={{ height: `${h * 0.45}px`, borderRadius: "4px 4px 0 0", background: "rgba(249,115,22,0.55)" }} />
                <div style={{ height: `${(100 - h) * 0.3}px`, borderRadius: "4px 4px 0 0", background: "rgba(239,68,68,0.4)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ─── */}
      <section style={{ padding: "60px 6%" }}>
        <div className="reveal" style={{ maxWidth: 860, margin: "0 auto", background: "var(--glass-bg)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(249,115,22,0.18)", borderRadius: 20, padding: "44px 48px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 32 }}>😩</span>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.025em", margin: 0 }}>
              {s.problemTitlePre}{" "}
              <span style={{ background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.problemTitleGrad}
              </span>{" "}
              {s.problemTitlePost}
            </h2>
          </div>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>{s.problemIntro}</p>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {s.problemItems.map(({ icon, text }) => (
              <li key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4, borderTop: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: 22 }}>🚀</span>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
              {s.problemClosingPre && <>{s.problemClosingPre}{" "}</>}
              <span style={{ color: "var(--accent)" }}>{s.closingBrand}</span>
              {" "}{s.problemClosingPost}
            </p>
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section id="features" style={{ padding: "80px 6%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }} className="reveal">
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 14 }}>
            {s.featuresH2a}<br />
            <span style={{ color: "var(--accent)" }}>{s.featuresH2b}</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto" }}>{s.featuresSub}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
          {s.bentoCards.map((card, i) => (
            <BentoCard
              key={card.title}
              gridColumn={bentoCols[i]}
              id={bentoIds[i]}
              className={bentoClass[i]}
              icon={bentoIcons[i]}
              badge={card.badge}
              badgeAccent={card.badgeAccent}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* ─── FUTURE SELF SHOWCASE ─── */}
      <section id="futureself" style={{ padding: "90px 6%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left copy */}
          <div className="reveal">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "6px 14px", borderRadius: 99, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <Zap size={13} color="var(--accent)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>{s.futureBadge}</span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18 }}>
              {s.futureH2a}<br />
              <span style={{ color: "var(--accent)" }}>{s.futureH2b}</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>{s.futureSub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {s.futureBullets.map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right — milestone cards mockup */}
          <div className="reveal reveal-d1">
            <div style={{ background: "var(--bg-surface)", border: "1px solid rgba(249,115,22,0.14)", borderRadius: 20, padding: 24, boxShadow: "0 28px 64px rgba(0,0,0,0.5)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={13} color="var(--accent)" /> {s.futureMockLabel}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                {s.futureMilestones.map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--bg-subtle)", borderRadius: 12, padding: "16px 10px", textAlign: "center", border: "1px solid rgba(249,115,22,0.12)" }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 260 60" style={{ width: "100%", height: 60 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 55 C30 50 50 42 80 36 C110 30 130 22 160 16 C190 10 220 6 260 2" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 55 C30 50 50 42 80 36 C110 30 130 22 160 16 C190 10 220 6 260 2 L260 60 L0 60 Z" fill="url(#sparkGrad)" />
              </svg>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 6 }}>{s.futureMockBasis}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALENDAR SHOWCASE ─── */}
      <section id="calendar" style={{ padding: "90px 6%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left — calendar mockup */}
          <div className="reveal">
            <div style={{ background: "var(--bg-surface)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: 24, boxShadow: "0 28px 64px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{s.calendarMonth}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>financeRox</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
                {s.calendarWeekdays.map((d, i) => (
                  <div key={i} style={{ fontSize: 9, fontWeight: 600, color: "var(--text-muted)", textAlign: "center", textTransform: "uppercase" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => <div key={`e${i}`} />)}
                {CAL_DAYS.map(({ d, e, t, today, bal }) => (
                  <div key={d} style={{ minHeight: 36, borderRadius: 8, padding: "5px 4px", background: today ? "rgba(249,115,22,0.12)" : e ? (t === "income" ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)") : "var(--bg-subtle)", border: today ? "1px solid rgba(249,115,22,0.5)" : "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: today ? 800 : 500, color: today ? "var(--accent)" : "var(--text-secondary)" }}>{d}</span>
                    {e && <div style={{ width: 6, height: 6, borderRadius: "50%", background: t === "income" ? "#22c55e" : "#ef4444" }} />}
                    {bal && <span style={{ fontSize: 7, fontFamily: "JetBrains Mono, monospace", color: today ? "var(--accent)" : (t === "income" ? "#22c55e" : "#ef4444"), fontWeight: 700 }}>{bal}</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 14, justifyContent: "center" }}>
                {s.calendarLegend.map(({ color, label }) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />{label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Right copy */}
          <div className="reveal reveal-d1">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "6px 14px", borderRadius: 99, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Calendar size={13} color="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.06em" }}>{s.calendarBadge}</span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18 }}>
              {s.calendarH2a}<br />
              <span style={{ color: "#f59e0b" }}>{s.calendarH2b}</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>{s.calendarSub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {s.calendarBullets.map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIGHLIGHTS ROW ─── */}
      <section style={{ padding: "60px 6%", background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, transparent 50%)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, textAlign: "center" }}>
          {s.highlights.map(({ value, label }, i) => (
            <div key={label} className={`reveal reveal-d${i + 1}`}>
              <div style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "var(--accent)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.03em", marginBottom: 8 }}>{value}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: "100px 6%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "6px 16px", borderRadius: 99, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.faqBadge}</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14 }}>{s.faqTitle}</h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>{s.faqSub}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.faq.map(({ q, a }) => (
              <details key={q} style={{ background: "var(--glass-bg)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid var(--glass-border)", borderRadius: 14, overflow: "hidden" }}>
                <summary style={{ padding: "18px 22px", fontSize: 15, fontWeight: 600, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, userSelect: "none" }}>
                  {q}
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--accent)", fontWeight: 400 }}>+</span>
                </summary>
                <div style={{ padding: "16px 22px 20px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, borderTop: "1px solid var(--border-subtle)" }}>{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUG REPORT ─── */}
      <section id="bug-report" style={{ padding: "80px 6% 100px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", background: "var(--glass-bg)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 22, padding: "48px 44px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", fontSize: 26 }}>🐛</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "5px 14px", borderRadius: 99, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.07em", textTransform: "uppercase" }}>Bug &amp; Feedback</span>
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14 }}>{s.bugTitle}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 34, maxWidth: 460, margin: "0 auto 34px" }}>{s.bugSub}</p>
          <div style={{ textAlign: "left", marginBottom: 32, background: "var(--bg-subtle)", borderRadius: 12, padding: "18px 22px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>{s.bugChecklistTitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {s.bugItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:support@financerox.app?subject=Bug%20Report%20-%20financeRox&body=Description%3A%0A%0ASteps%3A%0A%0AExpected%3A%0A%0ADevice%2FBrowser%3A" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--accent)", color: "white", padding: "13px 28px", borderRadius: 99, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
              {s.bugBtn}
            </a>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 22 }}>{s.bugNote}</p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "100px 6%", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "7px 18px", borderRadius: 99, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
          <CheckCircle2 size={13} color="var(--accent)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{s.ctaBadge}</span>
        </div>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 18 }}>{s.ctaH2}</h2>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 40, maxWidth: 440, margin: "0 auto 40px", whiteSpace: "pre-line" }}>{s.ctaSub}</p>
        <Link href={isLoggedIn ? "/dashboard" : "/register"} style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "var(--accent)", color: "white", padding: "17px 44px", borderRadius: 99, fontSize: 16, fontWeight: 800, textDecoration: "none", boxShadow: "0 10px 32px rgba(249,115,22,0.45)" }}>
          {isLoggedIn ? s.ctaBtnLoggedIn : s.ctaBtn}
          <ChevronRight size={18} />
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "28px 6%", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} financeRox — {s.footerCopyright}
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/privacy" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>{s.footerLinks[0]}</Link>
          <Link href="/terms" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>{s.footerLinks[1]}</Link>
          <Link href="/contact" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>{s.footerLinks[2]}</Link>
        </div>
      </footer>
    </>
  );
}
