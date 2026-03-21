# Documentazione Completa - financeRox

> **Versione 2.0** — Ultimo aggiornamento: Marzo 2026  
> Changelog v2: Landing Page premium, rimozione paywall Stripe (Testing Mode), Smart Tags, Lifestyle Inflation widget, Pianificatore Tasse, Running Balance Calendario.

Questo documento contiene tutte le istruzioni necessarie per lanciare, testare e deployare (pubblicare) l'applicazione **financeRox**, nonché un prompt dettagliato per rigenerare l'architettura da zero con un'altra Intelligenza Artificiale.

---

## PARTE 1: Guida al Lancio e Deploy

### 1. Prerequisiti
- Node.js (v18 o superiore) installato.
- Account GitHub (per il deploy su Vercel).
- Account Vercel (collegato a GitHub).
- Account Supabase.

### 2. Configurazione Supabase (Backend come Servizio)
Supabase gestirà l'autenticazione (login/registrazione) e il database PostgreSQL.
1. Vai su [Supabase.com](https://supabase.com/) e crea un nuovo progetto.
2. Vai su **Project Settings > API** e copia le due chiavi fondamentali:
   - `Project URL`
   - `anon` `public` key
3. Vai in **Authentication > Providers** e assicurati che "Email" sia abilitato (puoi anche configurare Google se lo desideri).
4. Vai in **SQL Editor** ed esegui il file di seed del database (il contenuto di `supabase/schema.sql`). Questo creerà le tabelle `profiles`, `categories`, `transactions` e `savings_goals`, oltre alle policy di sicurezza RLS (Row Level Security).

### 3. Avvio in Locale (Testing)
1. Nella cartella principale del progetto, rinomina (o crea) il file `.env.example` in `.env.local`.
2. Inserisci le tue chiavi Supabase nel file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=il_tuo_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=la_tua_anon_key
   ```
3. Installa le dipendenze aprendo il terminale nella cartella del progetto:
   ```bash
   npm install
   ```
4. Lancia il server di sviluppo:
   ```bash
   npm run dev
   ```
5. Visita `http://localhost:3000` nel tuo browser. L'app dovrebbe funzionare (per ora stiamo usando l'ambiente mockato `lib/mock/data.ts`, quando vorrai usare i dati reali dovrai sovrascrivere `lib/mock/hooks.ts` con vere chiamate Supabase).

### 4. Deploy su Vercel (Produzione)
1. Carica il codice del progetto su una repository privata su **GitHub**.
2. Vai su [Vercel.com](https://vercel.com/) e clicca su **Add New > Project**.
3. Importa la tua repository GitHub.
4. **ATTENZIONE**: Nella sezione "Environment Variables" di Vercel, devi incollare le stesse chiavi del tuo `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clicca su **Deploy**. In circa 2 minuti avrai un URL pubblico (es. `https://financerox.vercel.app`).

---

## PARTE 2: Prompt Completo per Rigenerare l'Applicazione con AI

*Puoi copiare e incollare il testo qui sotto in qualsiasi editor AI (es. Cursor, Devin, ChatGPT) per fargli ricreare l'applicazione partendo da un foglio bianco.*

### Copia da qui in giù:
---
**RUOLO**: Sei un Senior Frontend Engineer e UI/UX Designer specializzato in stack React moderno. Il tuo compito è costruire un'applicazione per il personal finance tracking chiamata "financeRox".

**TECNOLOGIE DA UTILIZZARE**:
- **Framework**: Next.js 15+ (App Router)
- **Linguaggio**: TypeScript
- **Stilizzazione**: CSS puro (o utility classes limitate, no Tailwind se non necessario), Theme Variables in `globals.css` (Dark/Light mode).
- **Grafici**: Recharts
- **Icone**: `lucide-react`
- **Gestione Stato Async**: `@tanstack/react-query`
- **Backend/Auth**: Supabase (Gestione sessione server/client via `@supabase/ssr`)

**DESIGN SYSTEM (MOLTO IMPORTANTE)**:
L'interfaccia deve avere un look & feel estremamente premium, ispirato al glassmorphism, con animazioni fluide e interfacce pulite ("Wow Factor" alto).
- **Colori Tema Scuro**: Background `#09090b` (Deep Black), Superfici `#18181b` con bordi molto sottili semi-trasparenti.
- **Colori Tema Chiaro**: Background `#f8fafc`, Superfici bianche.
- **Colore Accento Primario (Brand)**: **Arancione Vibrante** (es. `#f59e0b` o `#f97316`). DEVE essere usato per bottoni principali, gradienti sui testi, icone attive e focus states. L'arancione è l'anima del progetto.
- **Micro-interazioni**: Pulsanti e card che "scalano" leggermente all'hover (`transform: scale(1.02)`), tooltip descrittivi nativi o personalizzati.

**ARCHITETTURA APPLICATIVA E PAGINE**:
1. **Layout Wrapper (`/(app)/layout.tsx`)**: 
   - Sidebar a sinistra (Desktop) con link alle sezioni e Toggle Dark/Light mode.
   - Mobile Nav Bar in basso (Mobile) che nasconde la sidebar principale.
   - Floating Action Button Globale (+) per aggiungere velocemente transazioni da ogni pagina.
   
2. **Dashboard (`/dashboard`)**: 
   - 4 Card KPI in alto (Saldo Totale, Entrate Mese, Uscite Mese, Tasso di Risparmio). **MIGLIORAMENTO**: Cliccando il valore "Entrate Mese" o "Saldo Totale", si deve aprire una dialog pop-up rapida per "aggiustare il saldo" (inserisci la cifra corretta attuale e il sistema crea automaticamente un'uscita/entrata di compensazione).
   - **NUOVO KPI "Safe to Spend" (Denaro Libero)**: Una card o un banner che calcola quanto denaro libero l'utente ha da spendere *oggi* fino a fine mese calcolando: `Saldo Attuale - (Somma uscite ricorrenti rigide previste da oggi a fine mese)`. Se questo numero è basso, l'utente saprà di non poter fare spese extra.
   - Grafico a barre raggruppate Entrate vs Uscite (ultimi 6 mesi).
   - Lista delle ultime 5 transazioni.
   
3. **Sezione Transazioni (`/transactions`)**:
   - Tabella delle transazioni (Data, Descrizione, Categoria, Importo).
   - **MUST HAVE**: Selezione multipla (checkbox per ogni riga) con una "Bulk action bar" fissa in basso per eliminare in blocco le voci selezionate. Selettore "ricorrente" esplicito durante la creazione.
   
4. **Sezione Obiettivi (`/goals`)**:
   - Card per obiettivi di risparmio con progress bar arrotondate.
   
5. **Sezione Future Self (`/future-self`)**:
   - **MOTORE PROIEZIONE**: È vitale che la logica delle entrate ricorrenti (Stipendio, ecc.) sia calcolata raggruppando le voci per `description` o ID. Le transazioni ricorrenti mensili NON DEVONO sommare la storicità dei vecchi depositi. Se io segno "Stipendio €2000 Mensile", la proiezione a 6 mesi aggiungerà 2000€/mese, ignorando i 12 mesi storici passati dello stesso stipendio altrimenti "drogerebbe" i calcoli di crescita. 
   - Grafico Proiezione Area lineare a 24 mesi. Aggiungi il pulsante "What if?" per simulare una nuova uscita/entrata.
   - **FutureCalendar**: Un componente UI visuale stile Calendario mensile diviso per grid di 7 giorni. Per ogni giorno il calcolo deve prendere le "sole voci attive" (come l'affitto il 5 del mese e lo stipendio il 27 del mese) ed elencarle esplicitamente all'interno dello slot giornaliero in verde (entrate) e rosso (uscite). 
   - **INNOVAZIONE CALENDARIO (Running Balance)**: Il calendario non deve solo mostrare i costi, ma calcolare il **Saldo Corrente Previsto (Running Balance)** giorno per giorno a partire da oggi. Se in un dato giorno l'affitto porta il conto in rosso (< 0€), quel giorno del calendario deve allarmare l'utente visivamente. I giorni del calendario devono essere cliccabili per aprire il form di Nuova Transazione pre-compilato su quel giorno.

6. **Sezione Settings (`/settings`)**:
   - Account, Tema (Light/Dark bypassabile da UI), Auth (Se l'utente è Loggato o Demo Mode).

**MIGLIORAMENTI AL DATA ENTRY (Richiesti per calcoli precisi)**:
- Il form transazioni DEVE avere il flag `is_recurring` (booleano) e intervallo (`daily`, `weekly`, `monthly`, `yearly`). Fallo estremamente comprensibile ad interfaccia (icona di rigenerazione 🔁).
- Il calcolo netto mensile della Dashboard DEVE esplicitare le differenze tra spese variabili e fisse in un info panel o un tooltip per far capire all'utente *esattamente* perché oggi vede una certa stima sul saldo futuro.

**FLUSSO DI LAVORO (ORDINE OPERATIVO)**:
1. Imposta la base Next.js e il `globals.css` definendo tutte le `--variables` colore tema scuro e chiaro, in particolare l'arancione primario con hover states.
2. Costruisci il Mock Database in memoria usando `react-query` per permettere l'utilizzo senza backend inizialmente. Setta `Provider`.
3. Costruisci l'infrastruttura di Layout (Sidebar Desktop, Header Mobile, Mobile Nav) perfettamente funzionante a stringimento di viewport.
4. Completa la Dashboard e il componente per le transazioni con multiseat e `AdjustBalanceDialog` per modica rapida.
5. Sviluppa interamente la schermata complessa `Future-self` assicurandoti della matematica sana basata su dati raggruppati unici. Implementa il Calendario Mensile Cliccabile.
6. Alla fine fornisci l'integrazione a `@supabase/ssr` per mappare `Login`/`Register` scambiando la libreria di mock in chiamate remote DB reali.
---
(Fine del Prompt)

---

## PARTE 3: Integrazione Abbonamenti PRO (Stripe)

> ⚠️ **Testing Mode attivo**: Il paywall Stripe è attualmente disabilitato. La funzione `useSubscription` in `lib/supabase/hooks.ts` restituisce `{ isPro: true }`. Le funzionalità PRO (Future Self 24 mesi, What-if, Calendario) sono visibili con un'etichetta "PRO" ma pienamente accessibili. Per ri-abilitare il paywall in produzione, cambia `isPro: true` → `isPro: false` e collega la verifica al campo `is_pro` del profilo utente.

La sezione "Future Self" contiene un paywall mockato per bloccare alcune funzioni (es. previsione oltre i 6 mesi, What-if e Calendario). Per rendere reale questo sistema con **Stripe**:

1. Crea un account su [Stripe](https://stripe.com).
2. Crea un **Prodotto** (es. "FinanceRox Pro") di tipo Ricorrente (Abbonamento Mensile/Annuale) e ottieni il suo `price_id`.
3. Nel tuo codice, crea una API Route in Next.js (es. `app/api/checkout/route.ts`) che usa l'SDK `stripe` per generare una **Checkout Session**. Al click del bottone "Upgrade" nel frontend, chiama questa API e fai il redirect dell'utente alla pagina di pagamento ospitata da Stripe.
4. **Webhooks**: Crea una seconda API Route (es. `app/api/webhooks/route.ts`) per ricevere gli eventi da Stripe (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`).
5. Quando il webhook riceve l'evento di pagamento confermato, aggiorna la tabella `profiles` su Supabase impostando `is_pro = true` per quell'utente.
6. Nel frontend e nelle chiamate API, verifica la property `is_pro` del profilo utente per mostrare o nascondere i contenuti premium.

---

## PARTE 4: Changelog Fase 2 — Marzo 2026

### 4.1 Landing Page Premium (`app/page.tsx`)
- **Server component** che verifica la sessione Supabase lato server.
- Render differenziale: se l'utente è loggato mostra CTA "Vai alla Dashboard"; altrimenti mostra la landing completa.
- Sezioni: Header sticky (logo/nav/CTA), Hero con gradiente arancione + mockup app interattivo, Bento Grid 12-colonne con 7 feature card (Dashboard, Safe to Spend, Future Self PRO, Calendario PRO, Smart Tags, Lifestyle Inflation, Pianificatore Tasse), Stats row, Final CTA, Footer.
- Nessuna dipendenza client / ReactQuery — puro HTML server-side.

### 4.2 Rimozione Paywall Stripe (Testing Mode)
- `lib/supabase/hooks.ts` → `useSubscription` restituisce ora `{ isPro: true, plan: "PRO" }`.
- Tutte le funzioni Future Self (Calendario, What-if, proiezioni 12/24 mesi) sono sbloccate.
- Le etichette "PRO" rimangono visibili nell'UI come indicatori futuri di monetizzazione.
- **Per ripristinare il paywall**: cambia `isPro: true` → `isPro: false`.

### 4.3 Widget "Lifestyle Inflation" (`components/dashboard/LifestyleInflationWidget.tsx`)
- Analizza gli ultimi 6 mesi completi di transazioni confermate.
- Separa **entrate** vs **uscite variabili** (non-ricorrenti) mese per mese.
- Calcola la variazione % media (media ultimi 3m vs primi 3m).
- Tre stati: `ok` (uscite controllate), `warning` (lieve incremento), `danger` (lifestyle inflation rilevata).
- Mini bar-chart a sei colonne integrato con tooltip hover.
- Inserito nel pannello destro della Dashboard dopo lo Spending Donut.

### 4.4 Pianificatore Tasse (`app/(app)/settings/page.tsx`)
- Nuovo campo numerico "Aliquota fiscale prevista (%)". 
- Salvato in `localStorage` con chiave `financerox_tax_rate` (nessuna migrazione DB richiesta).
- Preview dinamica: mostra l'importo di tasse calcolato su €2.000 di esempio.
- Sezione dedicata "Finanza" nell'interfaccia Impostazioni.

### 4.5 Smart Tags nelle Transazioni
- **`lib/types.ts`**: aggiunta property `tags?: string[]` all'interfaccia `Transaction` (documentazione).
- **Implementazione "hashtag-in-description"**: i tag vengono memorizzati come token `#nomtag` appendati alla descrizione — nessuna colonna DB aggiuntiva richiesta.
- **`components/transactions/TransactionDialog.tsx`**: 
  - Form arricchito con input tag stile "chip" (Spazio/Invio per aggiungere, Backspace per rimuovere).
  - Al salvataggio i tag vengono appendati alla descrizione: `"Spesa supermerc. #vacanze2024"`.
  - In modalità edit, i tag vengono estratti e mostrati già come chip.
- **`app/(app)/transactions/page.tsx`**: 
  - Le chip tag sono cliccabili nelle righe della tabella → attiva filtro istantaneo.
  - Filtro tag attivo mostra un badge dismiss visibile nella barra filtri.
  - `filtered` useMemo aggiornato per includere `matchTag`.

### 4.6 Running Balance Calendario (già implementato, documentato)
- `components/calendar/FutureCalendar.tsx`: calcola il saldo cumulativo giorno per giorno a partire dal saldo corrente.
- I giorni con saldo negativo mostrano bordo rosso + dot rosso.
- Le celle del giorno sono cliccabili per pre-riempire la data nel form nuova transazione.
- Deduplicazione ricorrenze per description per evitare double-counting.

### 4.7 Tipo Profile aggiornato (`lib/types.ts`)
- `Profile.tax_rate?: number` — percentuale aliquota fiscale personale.
