import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, BarChart3, Calendar, Zap, TrendingUp, Shield,
  Sparkles, Tag, Percent, CheckCircle2, ChevronRight,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ─── STICKY HEADER ─── */}
      <LandingHeader isLoggedIn={isLoggedIn} />

      {/* ─── HERO ─── */}
      <section
        style={{
          padding: "110px 6% 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.11) 0%, transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              padding: "7px 18px",
              borderRadius: 99,
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <Sparkles size={13} color="var(--accent)" />
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}
            >
              Personal Finance Intelligente — Versione 2.0
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              marginBottom: 24,
            }}
          >
            Controlla il Tuo
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Futuro Finanziario
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "var(--text-secondary)",
              maxWidth: 580,
              margin: "0 auto 44px",
              lineHeight: 1.7,
            }}
          >
            Traccia entrate e uscite, visualizza proiezioni a 24 mesi e scopri
            un calendario finanziario interattivo che prevede ogni movimento sul
            tuo conto.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--accent)",
                color: "white",
                padding: "15px 36px",
                borderRadius: 99,
                fontSize: 15,
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(249,115,22,0.4)",
              }}
            >
              {isLoggedIn ? "Vai alla Dashboard" : "Inizia Gratis"}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                padding: "15px 36px",
                borderRadius: 99,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid var(--border)",
              }}
            >
              {isLoggedIn ? "Impostazioni" : "Guarda la Demo"}
            </Link>
          </div>

          {/* Social proof line */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              "✅ Nessuna carta di credito",
              "🔒 Dati crittografati",
              "⚡ Sincronizzazione in tempo reale",
            ].map((item) => (
              <span
                key={item}
                style={{ fontSize: 12, color: "var(--text-muted)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── App Preview Mockup ── */}
        <div
          style={{
            marginTop: 72,
            maxWidth: 960,
            margin: "72px auto 0",
            background: "var(--bg-surface)",
            border: "1px solid rgba(249,115,22,0.12)",
            borderRadius: 22,
            overflow: "hidden",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(249,115,22,0.08)",
          }}
        >
          {/* Browser chrome bar */}
          <div
            style={{
              padding: "14px 20px",
              background: "var(--bg-elevated)",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                marginLeft: 14,
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              financeRox — Dashboard
            </span>
          </div>

          {/* KPI Cards Row */}
          <div
            style={{
              padding: "28px 28px 0",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {[
              { label: "Saldo Totale", value: "€ 12.450", color: "#f97316" },
              { label: "Entrate Mese", value: "€ 3.200", color: "#22c55e" },
              { label: "Uscite Mese", value: "€ 1.840", color: "#ef4444" },
              { label: "Safe to Spend", value: "€ 890", color: "#f59e0b" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: "var(--bg-subtle)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  {kpi.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: kpi.color,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Mini bar chart */}
          <div
            style={{
              padding: "16px 28px 28px",
              display: "flex",
              gap: 6,
              alignItems: "flex-end",
              height: 90,
            }}
          >
            {[60, 82, 48, 90, 65, 78].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    height: `${h * 0.45}px`,
                    borderRadius: "4px 4px 0 0",
                    background: "rgba(249,115,22,0.55)",
                  }}
                />
                <div
                  style={{
                    height: `${(100 - h) * 0.3}px`,
                    borderRadius: "4px 4px 0 0",
                    background: "rgba(239,68,68,0.4)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STRIP ─── */}
      <section style={{ padding: "60px 6%" }}>
        <div
          className="reveal"
          style={{
            maxWidth: 860,
            margin: "0 auto",
            background: "var(--glass-bg)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(249,115,22,0.18)",
            borderRadius: 20,
            padding: "44px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 32 }}>😩</span>
            <h2
              style={{
                fontSize: "clamp(22px, 3.5vw, 34px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              Stanco di usare{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                la calcolatrice
              </span>{" "}
              per le tue finanze?
            </h2>
          </div>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>
            Ti riconosci in almeno una di queste situazioni?
          </p>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { icon: "📊", text: "Apri Excel ogni mese e ricominci da capo a sommare entrate e uscite" },
              { icon: "🤔", text: "Non sai mai quanto puoi davvero spendere senza andare in rosso" },
              { icon: "🎯", text: "Hai un obiettivo di risparmio ma non sai se ce la farai" },
              { icon: "🔮", text: "Vorresti sapere com'è il tuo saldo tra 6 mesi ma non hai idea da dove cominciare" },
            ].map(({ icon, text }) => (
              <li
                key={text}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: 4,
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ fontSize: 22 }}>🚀</span>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
              A tutto questo ci pensa{" "}
              <span style={{ color: "var(--accent)" }}>financeRox</span>
              {" "}— in automatico, ogni giorno.
            </p>
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURE GRID ─── */}
      <section
        id="features"
        style={{ padding: "80px 6%", maxWidth: 1200, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }} className="reveal">
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: 14,
            }}
          >
            Tutto sotto controllo,
            <br />
            <span style={{ color: "var(--accent)" }}>in un solo posto</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Dashboard intuitive, grafici in tempo reale e proiezioni
            intelligenti per il tuo patrimonio.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
          }}
        >
          <BentoCard
            gridColumn="span 7"
            className="reveal reveal-d1"
            icon={<BarChart3 size={22} color="var(--accent)" />}
            badge="Dashboard"
            badgeAccent
            title="Panoramica Finanziaria Completa"
            description="KPI in tempo reale: saldo totale, entrate/uscite mensili, tasso di risparmio. Clicca su qualsiasi valore per aggiustare il saldo in un attimo."
          />
          <BentoCard
            gridColumn="span 5"
            className="reveal reveal-d2"
            icon={<Shield size={22} color="#22c55e" />}
            badge="Safe to Spend"
            title="Sai Sempre Quanto Puoi Spendere"
            description="Calcola automaticamente il denaro libero sottraendo tutte le uscite fisse ricorrenti previste fino a fine mese."
          />
          <BentoCard
            id="futureself"
            gridColumn="span 5"
            className="reveal reveal-d1"
            icon={<Zap size={22} color="var(--accent)" />}
            badge="Future Self ✦ PRO"
            badgeAccent
            title="Proiezione Patrimonio 24 Mesi"
            description="Vedi dove sarà il tuo conto tra 6, 12 o 24 mesi basandosi sulle ricorrenze reali. Testa scenari 'What-if' aggiungendo nuove entrate o uscite."
          />
          <BentoCard
            id="calendar"
            gridColumn="span 7"
            className="reveal reveal-d2"
            icon={<Calendar size={22} color="#f59e0b" />}
            badge="Calendario ✦ PRO"
            title="Running Balance Giornaliero"
            description="Calendario mensile interattivo con saldo previsto per ogni giorno. I giorni in rosso segnalano saldo negativo: nessuna sorpresa di fine mese."
          />
          <BentoCard
            gridColumn="span 4"
            className="reveal reveal-d1"
            icon={<Tag size={22} color="#8b5cf6" />}
            badge="Smart Tags"
            title="Raggruppa per Evento"
            description="Aggiungi #tag alle transazioni per vedere il costo totale di #vacanze2024, #rinnovo o qualsiasi progetto in un colpo solo."
          />
          <BentoCard
            gridColumn="span 4"
            className="reveal reveal-d2"
            icon={<TrendingUp size={22} color="#f59e0b" />}
            badge="Lifestyle Inflation"
            title="Analisi Incremento Stile di Vita"
            description="Widget che confronta la crescita delle uscite variabili rispetto alle entrate negli ultimi 6 mesi per prevenire il lifestyle creep."
          />
          <BentoCard
            gridColumn="span 4"
            className="reveal reveal-d3"
            icon={<Percent size={22} color="#06b6d4" />}
            badge="Pianificatore Tasse"
            title="Accantonamento Fiscale Automatico"
            description="Imposta la tua aliquota fiscale in Impostazioni. L'app calcolerà automaticamente la quota tasse da mettere da parte su ogni entrata."
          />
        </div>
      </section>

      {/* ─── FUTURE SELF SHOWCASE ─── */}
      <section
        id="futureself"
        style={{ padding: "90px 6%", maxWidth: 1200, margin: "0 auto" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left copy */}
          <div className="reveal">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
              padding: "6px 14px", borderRadius: 99,
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
            }}>
              <Zap size={13} color="var(--accent)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
                FUTURE SELF ✦ PRO
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900,
              letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18,
            }}>
              Vedi dove sarai<br />
              <span style={{ color: "var(--accent)" }}>tra 6, 12 e 24 mesi</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>
              La proiezione si basa sulle tue ricorrenze reali + media spese variabili degli ultimi 3 mesi.
              Ogni mese fai crescere un piano, non solo un numero.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "📈", text: "Proiezione patrimonio personalizzata su 24 mesi" },
                { icon: "🔄", text: "Ricorrenze attive rilevate automaticamente" },
                { icon: "⚡", text: "Simulatore What-If: testa nuove entrate o uscite" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — milestone cards mockup */}
          <div className="reveal reveal-d1">
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(249,115,22,0.14)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 28px 64px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={13} color="var(--accent)" /> Proiezione del tuo patrimonio
              </div>
              {/* 3 milestone cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "+6 mesi", value: "€ 15.200", color: "var(--accent)" },
                  { label: "+12 mesi", value: "€ 19.650", color: "var(--accent)" },
                  { label: "+24 mesi", value: "€ 28.100", color: "var(--accent)" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    background: "var(--bg-subtle)", borderRadius: 12, padding: "16px 10px",
                    textAlign: "center", border: "1px solid rgba(249,115,22,0.12)",
                  }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
                  </div>
                ))}
              </div>
              {/* Tiny sparkline */}
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
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 6 }}>
                Basato sulle tue abitudini attuali
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALENDAR SHOWCASE ─── */}
      <section
        id="calendar"
        style={{ padding: "90px 6%", maxWidth: 1200, margin: "0 auto" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left — calendar mockup */}
          <div className="reveal">
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 28px 64px rgba(0,0,0,0.5)",
            }}>
              {/* Month header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Marzo 2026</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>financeRox</span>
              </div>
              {/* Weekday labels */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
                {["L","M","M","G","V","S","D"].map((d, i) => (
                  <div key={i} style={{ fontSize: 9, fontWeight: 600, color: "var(--text-muted)", textAlign: "center", textTransform: "uppercase" }}>{d}</div>
                ))}
              </div>
              {/* Calendar grid — March 2026 starts on Sunday → 6 empty prefix */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {/* 5 empty prefix days (Mon–Fri blank before Sat 1st) */}
                {Array.from({ length: 5 }).map((_, i) => <div key={`e${i}`} />)}
                {[
                  // day, hasEvent, type (income/expense/none), isToday, balance
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
                ].map(({ d, e, t, today, bal }) => (
                  <div key={d} style={{
                    minHeight: 36, borderRadius: 8, padding: "5px 4px",
                    background: today
                      ? "rgba(249,115,22,0.12)"
                      : e ? (t === "income" ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)") : "var(--bg-subtle)",
                    border: today
                      ? "1px solid rgba(249,115,22,0.5)"
                      : "1px solid var(--border-subtle)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    position: "relative",
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: today ? 800 : 500,
                      color: today ? "var(--accent)" : "var(--text-secondary)",
                    }}>{d}</span>
                    {e && (
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: t === "income" ? "#22c55e" : "#ef4444",
                      }} />
                    )}
                    {bal && (
                      <span style={{
                        fontSize: 7, fontFamily: "JetBrains Mono, monospace",
                        color: today ? "var(--accent)" : (t === "income" ? "#22c55e" : "#ef4444"),
                        fontWeight: 700, lineHeight: 1,
                      }}>{bal}</span>
                    )}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: 14, marginTop: 14, justifyContent: "center" }}>
                {[
                  { dot: "#22c55e", label: "Entrata" },
                  { dot: "#ef4444", label: "Uscita" },
                  { dot: "var(--accent)", label: "Oggi" },
                ].map(({ dot, label }) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: dot }} />{label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right copy */}
          <div className="reveal reveal-d1">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
              padding: "6px 14px", borderRadius: 99,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
            }}>
              <Calendar size={13} color="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.06em" }}>
                CALENDARIO ✦ PRO
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900,
              letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18,
            }}>
              Ogni giorno ha<br />
              <span style={{ color: "#f59e0b" }}>il suo saldo previsto</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>
              Il calendario proietta in automatico tutte le ricorrenze attive nel mese in corso.
              Clicca qualsiasi giorno per vederne i dettagli o aggiungere una transazione.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "📅", text: "Saldo running aggiornato giorno per giorno" },
                { icon: "🔴", text: "I giorni in rosso segnalano saldo negativo" },
                { icon: "➕", text: "Tap su un giorno → aggiungi transazione istantanea" },
              ].map(({ icon, text }) => (
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
      <section
        style={{
          padding: "60px 6%",
          background:
            "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, transparent 50%)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            textAlign: "center",
          }}
        >
          {[
            { value: "24 mesi", label: "Proiezione patrimonio" },
            { value: "0", label: "Carta di credito richiesta" },
            { value: "100%", label: "Dati crittografati su Supabase" },
          ].map(({ value, label }, i) => (
            <div key={label} className={`reveal reveal-d${i + 1}`}>
              <div
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 900,
                  color: "var(--accent)",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: 14, color: "var(--text-secondary)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: "100px 6%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 20, padding: "6px 16px", borderRadius: 99,
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                FAQ
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900,
              letterSpacing: "-0.03em", marginBottom: 14,
            }}>
              Domande Frequenti
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Tutto quello che devi sapere per iniziare con financeRox.
            </p>
          </div>

          {/* FAQ items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {([
              {
                q: "Come aggiungo una transazione?",
                a: "Usa il pulsante \"+\" arancione in basso a destra in qualsiasi schermata, oppure vai nella sezione Transazioni e clicca \"Nuova Transazione\". Puoi registrare entrate, uscite, e indicare se si tratta di una spesa ricorrente (affitto, abbonamenti, ecc.).",
              },
              {
                q: "Cos'è il \"Safe to Spend\" (Denaro Libero)?",
                a: "È la somma che puoi spendere liberamente: saldo attuale meno le spese ricorrenti non ancora avvenute in questo mese. Se hai impostato un'aliquota fiscale nelle impostazioni, viene sottratta anche la quota accantonata per le tasse.",
              },
              {
                q: "Come funzionano gli Obiettivi di Risparmio?",
                a: "Nella sezione Obiettivi crei un traguardo (es. \"Vacanza 2025 — €3000\") con una data limite e un importo corrente. L'app calcola quanto devi risparmiare ogni mese per arrivarci in tempo. Quando registri un'entrata, puoi destinare direttamente una percentuale o quota fissa a un obiettivo.",
              },
              {
                q: "Come funziona il Calendario Finanziario?",
                a: "Lo trovi nella sezione Future Self. Mostra, giorno per giorno, tutte le entrate e uscite ricorrenti previste per il mese visualizzato. Puoi navigare avanti e indietro tra i mesi con le frecce. Il saldo stimato viene proiettato automaticamente in base alle transazioni ricorrenti.",
              },
              {
                q: "Cosa sono le transazioni ricorrenti?",
                a: "Sono transazioni che si ripetono automaticamente con una certa frequenza (giornaliera, settimanale, mensile, annuale). Una volta registrata la prima occorrenza e spuntata l'opzione \"Ricorrente\", financeRox le include automaticamente nel Calendario e nelle proiezioni Future Self.",
              },
              {
                q: "Come funziona la proiezione Future Self?",
                a: "Analizza il totale di entrate e uscite ricorrenti per stimare il tuo saldo mese per mese fino a 24 mesi nel futuro. Mostra milestone finanziarie (es. quando raggiungerai €10.000) e un grafico con la curva del patrimonio nel tempo.",
              },
              {
                q: "Posso collegare il mio conto bancario?",
                a: "Al momento financeRox funziona con inserimento manuale delle transazioni — questo ti garantisce massimo controllo e privacy. L'integrazione con i conti bancari è nella roadmap. Iscriviti per ricevere aggiornamenti sulle nuove funzionalità.",
              },
              {
                q: "I miei dati sono al sicuro?",
                a: "Sì. I dati sono memorizzati su Supabase con autenticazione sicura e crittografia. Non condividiamo mai le tue informazioni finanziarie con terze parti. Puoi esportare o eliminare il tuo account in qualsiasi momento dalle Impostazioni.",
              },
            ] as { q: string; a: string }[]).map(({ q, a }) => (
              <details
                key={q}
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    padding: "18px 22px",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    userSelect: "none",
                  }}
                >
                  {q}
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: "var(--accent)", fontWeight: 400, lineHeight: 1,
                  }}>
                    +
                  </span>
                </summary>
                <div style={{
                  padding: "0 22px 20px",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  borderTop: "1px solid var(--border-subtle)",
                  marginTop: 0,
                  paddingTop: 16,
                }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUG REPORT & FEEDBACK ─── */}
      <section id="bug-report" style={{ padding: "80px 6% 100px" }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          background: "var(--glass-bg)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(249,115,22,0.22)",
          borderRadius: 22,
          padding: "48px 44px",
          textAlign: "center",
        }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 22px",
            fontSize: 26,
          }}>
            🐛
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 16, padding: "5px 14px", borderRadius: 99,
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Bug & Feedback
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Hai trovato un problema?
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 34, maxWidth: 460, margin: "0 auto 34px" }}>
            Aiutaci a migliorare financeRox. Segnala bug, comportamenti inattesi
            o suggerisci nuove funzionalità — ogni feedback conta!
          </p>

          {/* What to include */}
          <div style={{
            textAlign: "left", marginBottom: 32,
            background: "var(--bg-subtle)", borderRadius: 12,
            padding: "18px 22px",
            border: "1px solid var(--border-subtle)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
              Includi nel report
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Descrizione del problema riscontrato",
                "Passaggi per riprodurlo (es. clicco su X, poi Y…)",
                "Qual era il comportamento atteso",
                "Screenshot o registrazione schermo (se possibile)",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:support@financerox.app?subject=Bug%20Report%20-%20financeRox&body=Descrizione%20del%20problema%3A%0A%0APassaggi%20per%20riprodurlo%3A%0A%0AComportamento%20atteso%3A%0A%0ADisspositivo%20%2F%20browser%3A"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "var(--accent)", color: "white",
                padding: "13px 28px", borderRadius: 99,
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
              }}
            >
              ✉️ Invia via Email
            </a>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 22 }}>
            Risposta entro 24–48 ore nei giorni lavorativi.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        style={{
          padding: "100px 6%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            padding: "7px 18px",
            borderRadius: 99,
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.25)",
          }}
        >
          <CheckCircle2 size={13} color="var(--accent)" />
          <span
            style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}
          >
            Gratuito per sempre nel piano Base
          </span>
        </div>
        <h2
          style={{
            fontSize: "clamp(30px, 5vw, 52px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: 18,
          }}
        >
          Pronto a prendere il controllo?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            marginBottom: 40,
            maxWidth: 440,
            margin: "0 auto 40px",
          }}
        >
          Inizia gratuitamente. Nessuna carta di credito.
          <br />
          Setup in meno di 2 minuti.
        </p>
        <Link
          href={isLoggedIn ? "/dashboard" : "/register"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "var(--accent)",
            color: "white",
            padding: "17px 44px",
            borderRadius: 99,
            fontSize: 16,
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 10px 32px rgba(249,115,22,0.45)",
          }}
        >
          {isLoggedIn ? "Vai alla Dashboard" : "Parti subito — è gratuito"}
          <ChevronRight size={18} />
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          padding: "28px 6%",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} financeRox — Tutti i diritti riservati
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Termini", "Contatti"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components (server-safe, no hooks) ───────────────────────────────

function BentoCard({
  gridColumn,
  id,
  icon,
  badge,
  badgeAccent,
  title,
  description,
  className,
}: {
  gridColumn?: string;
  id?: string;
  icon: React.ReactNode;
  badge: string;
  badgeAccent?: boolean;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={className}
      style={{
        gridColumn,
        background: "var(--glass-bg)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: badgeAccent
          ? "1px solid rgba(249,115,22,0.28)"
          : "1px solid var(--glass-border)",
        borderRadius: 18,
        padding: "28px 28px 30px",
      }}
    >
      <div style={{ marginBottom: 14 }}>{icon}</div>
      <div
        style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 99,
          marginBottom: 12,
          background: badgeAccent
            ? "rgba(249,115,22,0.12)"
            : "var(--bg-subtle)",
          color: badgeAccent ? "var(--accent)" : "var(--text-muted)",
          border: badgeAccent
            ? "1px solid rgba(249,115,22,0.2)"
            : "1px solid var(--border-subtle)",
        }}
      >
        {badge}
      </div>
      <h3
        style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>
    </div>
  );
}

