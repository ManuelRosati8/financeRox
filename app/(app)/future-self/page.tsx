"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Info, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { useTransactions, useSavingsGoals } from "@/lib/supabase/hooks";
import { computeProjection, computeMilestones } from "@/lib/projection";
import { ProjectionChart } from "@/components/charts/ProjectionChart";
import { FutureCalendar } from "@/components/calendar/FutureCalendar";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { AppSelect } from "@/components/ui/AppSelect";
import { WhatIfScenario, TransactionType, RecurringInterval, Transaction } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

/** Easing: ease-out cubic */
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

/** Count-up hook — animates from 0 to `target` once the ref element enters viewport */
function useCountUp(target: number, duration = 1100) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const run = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    // Reset when target changes (month switch)
    started.current = false;
    const el = ref.current;
    if (!el) {
      // No DOM element attached — run immediately (used for secondary values like delta)
      run();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) run(); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, run]);

  return { display, ref };
}

function MilestoneCard({
  months, baseline, whatIf,
}: {
  months: number; baseline: number; whatIf?: number;
}) {
  const { locale, numberLocale } = useI18n();
  const { display: displayBase, ref } = useCountUp(Math.abs(Math.round(baseline)));
  const delta = whatIf !== undefined ? whatIf - baseline : undefined;
  const { display: displayDelta } = useCountUp(
    delta !== undefined ? Math.abs(Math.round(delta)) : 0
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <div
      ref={ref}
      className="glass card-hover"
      style={{ padding: "22px 22px", textAlign: "center", transition: "transform 0.18s, box-shadow 0.18s" }}
    >
      <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
        +{months} {locale === "en" ? (months === 1 ? "month" : "months") : (months === 1 ? "mese" : "mesi")}
      </div>
      <div
        className="money"
        style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}
      >
        {baseline < 0 ? "-" : ""}{fmt(displayBase)}
      </div>
      {delta !== undefined && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10 }}>
          {delta >= 0
            ? <ArrowUp size={12} color="var(--income-color)" />
            : <ArrowDown size={12} color="var(--expense-color)" />
          }
          <span className="money" style={{ fontSize: 13, color: delta >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>
            {delta >= 0 ? "+" : "-"}{fmt(displayDelta)}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{locale === "en" ? "what-if" : "what-if"}</span>
        </div>
      )}
    </div>
  );
}

export default function FutureSelfPage() {
  const { data: transactions = [] } = useTransactions();
  const { data: goals = [] }        = useSavingsGoals();
  const { locale, numberLocale } = useI18n();
  const isEnglish = locale === "en";
  const copy = isEnglish
    ? {
        title: "Future Self",
        badge: "Wealth Snapshot™",
        subtitle: "Project your balance from your current habits — recurring flows plus the average variable expenses of the last 3 months.",
        algorithmTitle: "How the projection works:",
        algorithmRecurring: "Recurring active flows",
        algorithmTail: "are converted to a monthly value and applied to your current balance, then we subtract the average of your variable expenses over the last 3 months.",
        recurringDetected: "Recurring flows detected in projection:",
        customMonthsPreview: "Custom month preview",
        customPlaceholder: "e.g. 48",
        reset: "Reset",
        balanceProjection: "Balance Projection",
        baseline: "Baseline",
        whatIf: "What-If",
        calendarTitle: "Interactive Monthly Calendar",
        beta: "BETA PREVIEW",
        whatIfSectionTitle: "\"What Happens If...\" Simulator",
        whatIfPanelTitle: "What happens if...",
        whatIfPanelDescription: "Simulate the impact of a new recurring item on your future balance.",
        quickScenarios: "Quick scenarios",
        newExpense: "💸 New Expense",
        newIncome: "💰 New Income",
        amount: "Amount (€)",
        frequency: "Frequency",
        description: "Description",
        descriptionPlaceholder: "e.g. Car payment",
        newEntry: "New entry",
        tableHeaders: ["Months", "Base balance", "With scenario", "Δ Difference"],
        monthShort: "m",
        presets: [
          { label: "🏠 Mortgage €800/mo", type: "expense" as const, amount: "800", interval: "monthly" as const, desc: "Home mortgage" },
          { label: "🚗 Car payment €300/mo", type: "expense" as const, amount: "300", interval: "monthly" as const, desc: "Car payment" },
          { label: "💹 Investment €200", type: "expense" as const, amount: "200", interval: "monthly" as const, desc: "Monthly investment" },
          { label: "📱 Subscription €15", type: "expense" as const, amount: "15", interval: "monthly" as const, desc: "New subscription" },
          { label: "💰 Extra income €500", type: "income" as const, amount: "500", interval: "monthly" as const, desc: "Extra income" },
          { label: "🎁 Annual bonus €1000", type: "income" as const, amount: "1000", interval: "yearly" as const, desc: "Annual bonus" },
        ],
        intervals: {
          monthly: "every month",
          yearly: "every year",
          weekly: "every week",
          daily: "every day",
        },
      }
    : {
        title: "Future Self",
        badge: "Wealth Snapshot™",
        subtitle: "Proiezione del tuo patrimonio basata sulle abitudini attuali — ricorrenze + media spese variabili ultimi 3 mesi.",
        algorithmTitle: "Come calcoliamo la proiezione:",
        algorithmRecurring: "fonti ricorrenti attive",
        algorithmTail: "vengono mensilizzate e applicate al saldo attuale, poi sottraiamo la media delle spese variabili degli ultimi 3 mesi.",
        recurringDetected: "Ricorrenze rilevate ed in proiezione:",
        customMonthsPreview: "Mesi custom preview",
        customPlaceholder: "es. 48",
        reset: "Reset",
        balanceProjection: "Proiezione del Saldo",
        baseline: "Baseline",
        whatIf: "What-If",
        calendarTitle: "Calendario Mensile Interattivo",
        beta: "BETA PREVIEW",
        whatIfSectionTitle: "Simulatore \"Cosa Succede Se…\"",
        whatIfPanelTitle: "Cosa succede se...",
        whatIfPanelDescription: "Simula l'impatto di una nuova voce ricorrente sul tuo futuro.",
        quickScenarios: "Scenari rapidi",
        newExpense: "💸 Nuova Uscita",
        newIncome: "💰 Nuova Entrata",
        amount: "Importo (€)",
        frequency: "Frequenza",
        description: "Descrizione",
        descriptionPlaceholder: "es. Rata auto",
        newEntry: "Nuova voce",
        tableHeaders: ["Mesi", "Saldo Base", "Con scenario", "Δ Differenza"],
        monthShort: "m",
        presets: [
          { label: "🏠 Mutuo 800€/mese", type: "expense" as const, amount: "800", interval: "monthly" as const, desc: "Mutuo casa" },
          { label: "🚗 Rata auto 300€/mese", type: "expense" as const, amount: "300", interval: "monthly" as const, desc: "Rata auto" },
          { label: "💹 Investimento 200€", type: "expense" as const, amount: "200", interval: "monthly" as const, desc: "Investimento mensile" },
          { label: "📱 Abbonamento 15€", type: "expense" as const, amount: "15", interval: "monthly" as const, desc: "Nuovo abbonamento" },
          { label: "💰 Entrata extra 500€", type: "income" as const, amount: "500", interval: "monthly" as const, desc: "Entrata extra" },
          { label: "🎁 Bonus annuale 1000€", type: "income" as const, amount: "1000", interval: "yearly" as const, desc: "Bonus annuale" },
        ],
        intervals: {
          monthly: "ogni mese",
          yearly: "ogni anno",
          weekly: "ogni settimana",
          daily: "ogni giorno",
        },
      };

  const [months, setMonths] = useState<number>(6);
  const [customMonths, setCustomMonths] = useState("");

  const activeMonths = useMemo(() => {
    const n = parseInt(customMonths);
    if (!isNaN(n) && n >= 1) return Math.min(n, 120);
    return months;
  }, [customMonths, months]);
  
  const [whatIfActive,   setWhatIfActive]   = useState(false);
  const [whatIfAmount,   setWhatIfAmount]   = useState("");
  const [whatIfType,     setWhatIfType]     = useState<TransactionType>("expense");
  const [whatIfInterval, setWhatIfInterval] = useState<RecurringInterval>("monthly");
  const [whatIfDesc,     setWhatIfDesc]     = useState("");
  
  const [calendarTxDate, setCalendarTxDate] = useState("");
  const [isTxDialogOpen, setTxDialogOpen] = useState(false);

  const whatIfScenario = useMemo<WhatIfScenario | undefined>(() => {
    if (!whatIfActive || !whatIfAmount || parseFloat(whatIfAmount) <= 0) return undefined;
    return {
      amount: parseFloat(whatIfAmount) || 0,
      type: whatIfType,
      interval: whatIfInterval,
      description: whatIfDesc || copy.newEntry,
    };
  }, [whatIfActive, whatIfAmount, whatIfType, whatIfInterval, whatIfDesc, copy.newEntry]);

  const projectionData = useMemo(
    () => computeProjection(transactions, goals, activeMonths, whatIfScenario),
    [transactions, goals, activeMonths, whatIfScenario]
  );
  
  const currentBalance = useMemo(() => {
    return transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
  }, [transactions]);

  const milestones = useMemo(
    () => computeMilestones(transactions, goals, whatIfScenario),
    [transactions, goals, whatIfScenario]
  );

  // Compute monthly stats for info panel
  const monthlyStats = useMemo(() => {
    // Group recurring by description so we don't count historical instances of the same recurring transaction Multiple times
    const recurringMap = new Map<string, Transaction>();
    transactions.filter(t => t.is_recurring).forEach(t => {
      // Keep the most recent one (Assuming sorted descending)
      if (!recurringMap.has(t.description)) {
        recurringMap.set(t.description, t);
      }
    });

    const uniqueRecurring = Array.from(recurringMap.values());

    const incomeFixed = uniqueRecurring.filter((t) => t.type === "income").reduce((s, t) => {
      if (t.interval === "monthly") return s + t.amount;
      if (t.interval === "yearly")  return s + t.amount / 12;
      return s;
    }, 0);
    const expenseFixed = uniqueRecurring.filter((t) => t.type === "expense").reduce((s, t) => {
      if (t.interval === "monthly") return s + t.amount;
      if (t.interval === "yearly")  return s + t.amount / 12;
      return s;
    }, 0);
    const net = incomeFixed - expenseFixed;
    return { incomeFixed, expenseFixed, net, uniqueRecurring };
  }, [transactions]);

  const formatMoney = useCallback(
    (value: number) => new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value),
    [numberLocale]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 120 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Zap size={24} color="var(--accent-purple)" />
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>{copy.title}</h1>
          <span style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 99,
            background: "rgba(124,111,247,0.15)", color: "var(--accent-purple)",
            fontWeight: 600, border: "1px solid rgba(124,111,247,0.3)",
          }}>
            {copy.badge}
          </span>
        </div>
        <p style={{ color: "var(--text-secondary)" }}>
          {copy.subtitle}
        </p>
      </div>

      {/* Algorithm info */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px",
        borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Info size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-primary)" }}>{copy.algorithmTitle} </strong>
            {isEnglish ? "Your current balance is adjusted by your " : "Al saldo attuale si somma il flusso delle tue "}
            <strong style={{ color: "var(--text-primary)" }}>{copy.algorithmRecurring}</strong>
            {isEnglish ? " converted to monthly values (e.g. recurring income " : " mensilizzate (es. entrate fisse mensili "}
            <strong style={{ color: "var(--income-color)", fontFamily: "JetBrains Mono, monospace" }}> +{formatMoney(monthlyStats.incomeFixed)}</strong>
            {isEnglish ? " and fixed expenses " : " e spese fisse "}
            <strong style={{ color: "var(--expense-color)", fontFamily: "JetBrains Mono, monospace" }}> -{formatMoney(monthlyStats.expenseFixed)}</strong>
            {isEnglish ? "), then we subtract the average of your " : "), poi sottraiamo la media delle tue spese "}
            <em>{isEnglish ? "variable" : "variabili"}</em>
            {isEnglish ? " expenses over the last 3 months." : " degli ultimi 3 mesi."}
          </div>
        </div>
        
        {monthlyStats.uniqueRecurring.length > 0 && (
          <div style={{ paddingLeft: 26, fontSize: 12, color: "var(--text-muted)" }}>
            <strong>{copy.recurringDetected}</strong>{" "}
            {monthlyStats.uniqueRecurring.map((t, i) => (
              <span key={i}>
                {t.description} (<span style={{ color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)" }}>
                  {t.type === "income" ? "+" : "-"}{t.amount}€
                </span>)
                {i < monthlyStats.uniqueRecurring.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Milestone cards — 4 col */}
      <div className="milestone-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {milestones.map(({ months, balance, whatIfBalance }) => (
          <MilestoneCard
            key={months}
            months={months}
            baseline={balance}
            whatIf={whatIfScenario ? whatIfBalance : undefined}
          />
        ))}
      </div>

      {/* Controls — preset buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        {([6, 12, 24, 36] as const).map((m) => {
          const isBetaPreview = m > 6;
          const isActive = !customMonths && months === m;
          return (
            <button
              key={m}
              onClick={() => { setMonths(m); setCustomMonths(""); }}
              style={{
                padding: "8px 16px", borderRadius: 20, border: "1px solid", cursor: "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
                background: isActive ? "var(--bg-elevated)" : "transparent",
                borderColor: isActive ? "var(--accent)" : "var(--border-subtle)",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {m} {isEnglish ? "Months" : "Mesi"}
              {isBetaPreview && (
                <span style={{
                  fontSize: 9, padding: "1px 5px", borderRadius: 99, fontWeight: 700,
                  background: "rgba(249,115,22,0.12)", color: "var(--accent)",
                  border: "1px solid rgba(249,115,22,0.2)",
                }}>
                  {copy.beta}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <span style={{ width: 1, height: 24, background: "var(--border-subtle)", margin: "0 4px" }} />

        {/* Beta custom months input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px 6px 10px", borderRadius: 20,
          border: `1px solid ${customMonths ? "var(--accent-purple)" : "var(--border-subtle)"}`,
          background: customMonths ? "rgba(124,111,247,0.07)" : "transparent",
          transition: "all 0.15s",
        }}>
          <span style={{
            fontSize: 9, padding: "2px 6px", borderRadius: 99, fontWeight: 700,
            background: "rgba(124,111,247,0.15)", color: "var(--accent-purple)",
            border: "1px solid rgba(124,111,247,0.3)", whiteSpace: "nowrap",
          }}>{copy.beta}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{copy.customMonthsPreview}</span>
          <input
            type="number"
            min="1"
            max="120"
            value={customMonths}
            onChange={(e) => setCustomMonths(e.target.value)}
            placeholder={copy.customPlaceholder}
            style={{
              width: 64, padding: "2px 8px", borderRadius: 8,
              background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)", fontSize: 13,
              fontFamily: "JetBrains Mono, monospace", outline: "none",
            }}
          />
          {customMonths && (
            <button
              type="button"
              onClick={() => setCustomMonths("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, fontSize: 14, lineHeight: 1 }}
              title={copy.reset}
            >×</button>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>{copy.balanceProjection} — {activeMonths} {isEnglish ? "months" : "mesi"}</h2>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 3, background: "var(--accent)", display: "inline-block", borderRadius: 2 }} /> {copy.baseline}
            </span>
            {whatIfScenario && (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 20, height: 3, background: "#f59e0b", display: "inline-block", borderRadius: 2, border: "none", backgroundImage: "repeating-linear-gradient(90deg,#f59e0b 0,#f59e0b 6px,transparent 6px,transparent 9px)" }} /> {copy.whatIf}
              </span>
            )}
          </div>
        </div>
        <ProjectionChart data={projectionData} showWhatIf={!!whatIfScenario} />
      </div>

      {/* Transaction Dialog mapped from calendar */}
      <TransactionDialog 
        open={isTxDialogOpen} 
        onClose={() => setTxDialogOpen(false)} 
        initialDate={calendarTxDate}
      />

      {/* ── Advanced features in beta preview ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 10 }}>
        
        {/* Calendar section header with beta badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>{copy.calendarTitle}</h2>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700,
            background: "rgba(249,115,22,0.12)", color: "var(--accent)",
            border: "1px solid rgba(249,115,22,0.25)", letterSpacing: "0.07em",
          }}>
            {copy.beta}
          </span>
        </div>

        {/* Calendar */}
        <FutureCalendar 
          transactions={transactions} 
          currentBalance={currentBalance}
          onDayClick={(date) => {
            setCalendarTxDate(date);
            setTxDialogOpen(true);
          }}
        />

        {/* What-If section header with beta badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>{copy.whatIfSectionTitle}</h2>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700,
            background: "rgba(249,115,22,0.12)", color: "var(--accent)",
            border: "1px solid rgba(249,115,22,0.25)", letterSpacing: "0.07em",
          }}>
            {copy.beta}
          </span>
        </div>

        {/* What-If Panel */}
        <div className="glass" style={{
          padding: 24, border: whatIfActive ? "1px solid rgba(245,158,11,0.3)" : "1px solid var(--border-subtle)",
          background: whatIfActive ? "rgba(245,158,11,0.04)" : undefined, transition: "all 0.25s",
        }}>
          <div className="whatif-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: whatIfActive ? 24 : 0, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 240 }}>
              <Zap size={18} color={whatIfActive ? "#f59e0b" : "var(--text-muted)"} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: whatIfActive ? "#f59e0b" : "var(--text-primary)" }}>
                  {copy.whatIfPanelTitle}
                </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {copy.whatIfPanelDescription}
                  </div>
                </div>
              </div>
              {/* Toggle */}
              <button
                className="whatif-switch"
                type="button"
                onClick={() => setWhatIfActive(!whatIfActive)}
                aria-pressed={whatIfActive}
                style={{
                  minWidth: 96, height: 40, borderRadius: 999, border: `1px solid ${whatIfActive ? "rgba(245,158,11,0.45)" : "var(--border-subtle)"}`, cursor: "pointer",
                  background: whatIfActive ? "rgba(245,158,11,0.14)" : "var(--bg-elevated)",
                  position: "relative", transition: "background 0.2s, border-color 0.2s", display: "flex", alignItems: "center", padding: "0 12px", justifyContent: whatIfActive ? "flex-end" : "flex-start", gap: 10, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: whatIfActive ? "#f59e0b" : "var(--text-muted)" }}>
                  {whatIfActive ? "ON" : "OFF"}
                </span>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: whatIfActive ? "#f59e0b" : "white", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                }} />
              </button>
            </div>

            {whatIfActive && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Quick preset scenarios */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{copy.quickScenarios}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {copy.presets.map(preset => (
                      <button key={preset.label} type="button"
                        onClick={() => { setWhatIfType(preset.type); setWhatIfAmount(preset.amount); setWhatIfInterval(preset.interval); setWhatIfDesc(preset.desc); }}
                        style={{
                          padding: "5px 10px", borderRadius: 8, border: "1px solid", cursor: "pointer",
                          fontSize: 11, fontWeight: 500, transition: "all 0.12s",
                          background: "var(--bg-subtle)",
                          borderColor: whatIfAmount === preset.amount && whatIfDesc === preset.desc ? "#f59e0b" : "var(--border-subtle)",
                          color: whatIfAmount === preset.amount && whatIfDesc === preset.desc ? "#f59e0b" : "var(--text-secondary)",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type toggle */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {(["expense", "income"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setWhatIfType(t)}
                      style={{
                        padding: "9px 0", borderRadius: 8, border: "1px solid",
                        cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                        borderColor: whatIfType === t ? "#f59e0b" : "var(--border-subtle)",
                        background: whatIfType === t ? "rgba(245,158,11,0.15)" : "var(--bg-subtle)",
                        color: whatIfType === t ? "#f59e0b" : "var(--text-secondary)",
                      }}>
                      {t === "expense" ? copy.newExpense : copy.newIncome}
                    </button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {/* Amount */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{copy.amount}</div>
                    <input type="number" step="1" min="0"
                      value={whatIfAmount} onChange={(e) => setWhatIfAmount(e.target.value)}
                      placeholder="0"
                      style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 16, fontFamily: "JetBrains Mono, monospace", outline: "none" }}
                    />
                  </label>
                  {/* Interval */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{copy.frequency}</div>
                    <AppSelect
                      options={[
                        { value: "monthly", label: copy.intervals.monthly },
                        { value: "yearly", label: copy.intervals.yearly },
                        { value: "weekly", label: copy.intervals.weekly },
                        { value: "daily", label: copy.intervals.daily },
                      ]}
                      value={whatIfInterval}
                      onChange={(value) => setWhatIfInterval(value as RecurringInterval)}
                    />
                  </label>
                  {/* Description */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{copy.description}</div>
                    <input type="text"
                      value={whatIfDesc} onChange={(e) => setWhatIfDesc(e.target.value)}
                      placeholder={copy.descriptionPlaceholder}
                      style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none" }}
                    />
                  </label>
                </div>

                {/* Per-milestone impact table */}
                {whatIfAmount && parseFloat(whatIfAmount) > 0 && (() => {
                  const fmt = (n: number) => new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
                  return (
                    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                      {/* Header */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        background: whatIfType === "expense" ? "rgba(244,63,94,0.08)" : "rgba(16,185,129,0.08)",
                        padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)",
                      }}>
                        {copy.tableHeaders.map(h => (
                          <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                        ))}
                      </div>
                      {/* Rows */}
                      {milestones.map(({ months: m, balance, whatIfBalance }) => {
                        const delta = whatIfBalance !== undefined ? whatIfBalance - balance : 0;
                        return (
                          <div key={m} style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            padding: "10px 14px",
                            borderBottom: "1px solid var(--border-subtle)",
                            background: m === months ? "var(--accent-dim)" : "transparent",
                            transition: "background 0.15s",
                          }}>
                            <div style={{ fontSize: 13, fontWeight: m === months ? 700 : 500, color: m === months ? "var(--accent)" : "var(--text-secondary)" }}>+{m}{copy.monthShort}</div>
                            <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>{fmt(balance)}</div>
                            <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: whatIfType === "expense" ? "var(--expense-color)" : "var(--income-color)" }}>
                              {whatIfBalance !== undefined ? fmt(whatIfBalance) : "—"}
                            </div>
                            <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: delta >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>
                              {whatIfBalance !== undefined ? (delta >= 0 ? "+" : "") + fmt(delta) : "—"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
