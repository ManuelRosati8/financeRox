"use client";

import { useState, useMemo } from "react";
import { Info, Lock, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { useTransactions, useSavingsGoals, useSubscription } from "@/lib/supabase/hooks";
import { computeProjection, computeMilestones } from "@/lib/projection";
import { ProjectionChart } from "@/components/charts/ProjectionChart";
import { FutureCalendar } from "@/components/calendar/FutureCalendar";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { MoneyValue } from "@/components/ui/MoneyValue";
import { WhatIfScenario, TransactionType, RecurringInterval, Transaction } from "@/lib/types";

const INTERVALS: { value: RecurringInterval; label: string }[] = [
  { value: "daily",   label: "/ giorno"  },
  { value: "weekly",  label: "/ sett."   },
  { value: "monthly", label: "/ mese"    },
  { value: "yearly",  label: "/ anno"    },
];

function MilestoneCard({
  months, baseline, whatIf,
}: {
  months: number; baseline: number; whatIf?: number;
}) {
  const delta = whatIf !== undefined ? whatIf - baseline : undefined;
  return (
    <div className="glass" style={{ padding: "20px 22px", textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
        +{months} mesi
      </div>
      <MoneyValue amount={baseline} size="xl" color="var(--accent)" />
      {delta !== undefined && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}>
          {delta >= 0
            ? <ArrowUp size={12} color="var(--income-color)" />
            : <ArrowDown size={12} color="var(--expense-color)" />
          }
          <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: delta >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>
            {delta >= 0 ? "+" : ""}
            {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(delta)}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>what-if</span>
        </div>
      )}
    </div>
  );
}

export default function FutureSelfPage() {
  const { data: transactions = [] } = useTransactions();
  const { data: goals = [] }        = useSavingsGoals();
  const { data: subscription } = useSubscription();

  const isPro = subscription?.isPro || false;

  const [months, setMonths] = useState<6 | 12 | 24>(6);
  
  const [whatIfActive,   setWhatIfActive]   = useState(false);
  const [whatIfAmount,   setWhatIfAmount]   = useState("");
  const [whatIfType,     setWhatIfType]     = useState<TransactionType>("expense");
  const [whatIfInterval, setWhatIfInterval] = useState<RecurringInterval>("monthly");
  const [whatIfDesc,     setWhatIfDesc]     = useState("");
  
  const [calendarTxDate, setCalendarTxDate] = useState("");
  const [isTxDialogOpen, setTxDialogOpen] = useState(false);

  const whatIfScenario = useMemo<WhatIfScenario | undefined>(() => {
    if (!whatIfActive || !whatIfAmount) return undefined;
    return {
      amount: parseFloat(whatIfAmount) || 0,
      type: whatIfType,
      interval: whatIfInterval,
      description: whatIfDesc || "Nuova voce",
    };
  }, [whatIfActive, whatIfAmount, whatIfType, whatIfInterval, whatIfDesc]);

  const projectionData = useMemo(
    () => computeProjection(transactions, goals, months, whatIfScenario),
    [transactions, goals, months, whatIfScenario]
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Zap size={24} color="var(--accent-purple)" />
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Future Self</h1>
          <span style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 99,
            background: "rgba(124,111,247,0.15)", color: "var(--accent-purple)",
            fontWeight: 600, border: "1px solid rgba(124,111,247,0.3)",
          }}>
            Wealth Snapshot™
          </span>
        </div>
        <p style={{ color: "var(--text-secondary)" }}>
          Proiezione del tuo patrimonio basata sulle abitudini attuali — ricorrenze + media spese variabili ultimi 3 mesi.
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
            <strong style={{ color: "var(--text-primary)" }}>Come calcoliamo la proiezione: </strong>
            Al saldo attuale si somma il flusso delle tue <strong style={{ color: "var(--text-primary)" }}>fonti ricorrenti attive</strong> mensilizzate (es. entrate fisse mensili 
            <strong style={{ color: "var(--income-color)", fontFamily: "JetBrains Mono, monospace" }}> +{new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(monthlyStats.incomeFixed)}</strong>
            &nbsp;− spese fisse 
            <strong style={{ color: "var(--expense-color)", fontFamily: "JetBrains Mono, monospace" }}> -{new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(monthlyStats.expenseFixed)}</strong>),
            sottraendo poi la media delle tue spese <em>variabili</em> degli ultimi 3 mesi.
          </div>
        </div>
        
        {monthlyStats.uniqueRecurring.length > 0 && (
          <div style={{ paddingLeft: 26, fontSize: 12, color: "var(--text-muted)" }}>
            <strong>Ricorrenze rilevate ed in proiezione:</strong>{" "}
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

      {/* Milestone cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {milestones.map(({ months, balance, whatIfBalance }) => (
          <MilestoneCard
            key={months}
            months={months}
            baseline={balance}
            whatIf={whatIfScenario ? whatIfBalance : undefined}
          />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {[6, 12, 24].map((m) => {
          const locked = !isPro && m > 6;
          return (
            <button
              key={m}
              onClick={() => {
                if (!locked) setMonths(m as 6 | 12 | 24);
              }}
              style={{
                padding: "8px 16px", borderRadius: 20, border: "1px solid", cursor: locked ? "not-allowed" : "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
                background: months === m ? "var(--bg-elevated)" : "transparent",
                borderColor: months === m ? "var(--accent)" : "var(--border-subtle)",
                color: months === m ? "var(--accent)" : (locked ? "var(--text-muted)" : "var(--text-secondary)"),
                opacity: locked ? 0.6 : 1,
              }}
              title={locked ? "Passa a PRO per proiezioni a lungo termine" : ""}
            >
              {locked && <Lock size={12} />}
              {m} Mesi
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="glass" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Proiezione del Saldo</h2>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 3, background: "var(--accent)", display: "inline-block", borderRadius: 2 }} /> Baseline
            </span>
            {whatIfScenario && (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 20, height: 3, background: "#f59e0b", display: "inline-block", borderRadius: 2, border: "none", backgroundImage: "repeating-linear-gradient(90deg,#f59e0b 0,#f59e0b 6px,transparent 6px,transparent 9px)" }} /> What-If
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

      {/* Paywall Overlay Wrapper for Calendar and What-If */}
      <div style={{ position: "relative", marginTop: 10 }}>
        {!isPro && (
          <div style={{
            position: "absolute", inset: -10, zIndex: 10,
            backdropFilter: "blur(6px) grayscale(0.2)", background: "rgba(9, 9, 11, 0.5)",
            borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", padding: 24, textAlign: "center", border: "1px solid rgba(245,158,11,0.2)"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              boxShadow: "0 8px 24px rgba(245,158,11, 0.4)"
            }}>
              <Zap size={28} color="white" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 8 }}>
              Sblocca il Potere del tuo Futuro
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", maxWidth: 380, lineHeight: 1.6, marginBottom: 24 }}>
              Il <strong style={{color:"var(--accent)"}}>Calendario Mensile Interattivo</strong> e le <strong style={{color:"var(--accent)"}}>Simulazioni "What if"</strong> sono funzionalità esclusive per gli utenti FinanceRox PRO. Prendi il controllo definitivo delle tue previsioni!
            </p>
            <button
              style={{
                background: "white", color: "#000", border: "none", padding: "12px 28px",
                borderRadius: 24, fontSize: 14, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255,255,255,0.2)", transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              onClick={() => alert("Simulazione Stripe: qui partirà la Checkout Session (es. /api/checkout) per il pagamento mensile/annuale.")}
            >
              Passa a PRO con Stripe 💳
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24, pointerEvents: isPro ? "auto" : "none", userSelect: isPro ? "auto" : "none" }}>
          
          {/* Calendar */}
          <FutureCalendar 
            transactions={transactions} 
            currentBalance={currentBalance}
            onDayClick={(date) => {
              setCalendarTxDate(date);
              setTxDialogOpen(true);
            }}
          />

          {/* What-If Panel */}
          <div className="glass" style={{
            padding: 24, border: whatIfActive ? "1px solid rgba(245,158,11,0.3)" : "1px solid var(--border-subtle)",
            background: whatIfActive ? "rgba(245,158,11,0.04)" : undefined, transition: "all 0.25s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: whatIfActive ? 24 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Zap size={18} color={whatIfActive ? "#f59e0b" : "var(--text-muted)"} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: whatIfActive ? "#f59e0b" : "var(--text-primary)" }}>
                    Cosa succede se...
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Simula l&apos;impatto di una nuova voce ricorrente sul tuo futuro
                  </div>
                </div>
              </div>
              {/* Toggle */}
              <button
                type="button"
                onClick={() => setWhatIfActive(!whatIfActive)}
                style={{
                  width: 52, height: 28, borderRadius: 99, border: "none", cursor: "pointer",
                  background: whatIfActive ? "#f59e0b" : "var(--bg-elevated)",
                  position: "relative", transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 4, left: whatIfActive ? 27 : 4,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "white", transition: "left 0.2s",
                }} />
              </button>
            </div>

            {whatIfActive && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                      {t === "expense" ? "💸 Nuova Uscita" : "💰 Nuova Entrata"}
                    </button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {/* Amount */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Importo (€)</div>
                    <input type="number" step="1" min="0"
                      value={whatIfAmount} onChange={(e) => setWhatIfAmount(e.target.value)}
                      placeholder="0"
                      style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 16, fontFamily: "JetBrains Mono, monospace", outline: "none" }}
                    />
                  </label>
                  {/* Interval */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Frequenza</div>
                    <select value={whatIfInterval} onChange={(e) => setWhatIfInterval(e.target.value as RecurringInterval)}
                      style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none", cursor: "pointer" }}
                    >
                      <option value="monthly">ogni mese</option>
                      <option value="yearly">ogni anno</option>
                      <option value="weekly">ogni settimana</option>
                      <option value="daily">ogni giorno</option>
                    </select>
                  </label>
                  {/* Description */}
                  <label>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Descrizione</div>
                    <input type="text"
                      value={whatIfDesc} onChange={(e) => setWhatIfDesc(e.target.value)}
                      placeholder="es. Rata auto"
                      style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none" }}
                    />
                  </label>
                </div>

                {whatIfAmount && parseFloat(whatIfAmount) > 0 && (
                  <div style={{
                    padding: "14px 18px", borderRadius: 10,
                    background: whatIfType === "expense" ? "rgba(244,63,94,0.08)" : "rgba(16,185,129,0.08)",
                    border: `1px solid ${whatIfType === "expense" ? "rgba(244,63,94,0.2)" : "rgba(16,185,129,0.2)"}`,
                    fontSize: 13,
                  }}>
                    <strong style={{ color: whatIfType === "expense" ? "var(--expense-color)" : "var(--income-color)" }}>
                      {whatIfType === "expense" ? "⚠️ Impatto negativo" : "🚀 Impatto positivo"}:&nbsp;
                    </strong>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Aggiungere{" "}
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
                        {new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(parseFloat(whatIfAmount))} {whatIfInterval === "monthly" ? "al mese" : whatIfInterval}
                      </span>{" "}
                      cambierà il tuo patrimonio a {months} mesi di{" "}
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: whatIfType === "expense" ? "var(--expense-color)" : "var(--income-color)" }}>
                        {milestones.length > 0 && milestones[0]?.whatIfBalance !== undefined
                          ? new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(milestones[milestones.length - 1].whatIfBalance! - milestones[milestones.length - 1].balance)
                          : "—"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
