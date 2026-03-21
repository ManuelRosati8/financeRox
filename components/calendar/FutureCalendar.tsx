import { useMemo, useState } from "react";
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, parseISO, isSameDay, addMonths
} from "date-fns";
import { it } from "date-fns/locale";
import { X, Plus, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
  onDayClick?: (dateString: string) => void;
  currentBalance?: number;
}

export function FutureCalendar({ transactions, onDayClick, currentBalance = 0 }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Compute the viewed month (stable base = first of current month + offset)
  const viewDate = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    return addMonths(base, monthOffset);
  }, [monthOffset]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd   = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 1. Unique active recurring transactions
  const activeRecurring = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.filter(t => t.is_recurring).forEach(t => {
      if (!map.has(t.description)) map.set(t.description, t);
    });
    return Array.from(map.values());
  }, [transactions]);

  // 2. Map day â†’ expected recurring transactions for the viewed month
  const dayMap = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    daysInMonth.forEach(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const expected: Transaction[] = [];
      activeRecurring.forEach(t => {
        const txDate = parseISO(t.date);
        let matches = false;
        if (t.interval === "daily") {
          matches = true;
        } else if (t.interval === "weekly") {
          matches = getDay(day) === getDay(txDate);
        } else if (t.interval === "monthly") {
          const targetDay = Math.min(txDate.getDate(), monthEnd.getDate());
          matches = day.getDate() === targetDay;
        } else if (t.interval === "yearly") {
          matches = day.getMonth() === txDate.getMonth() && day.getDate() === txDate.getDate();
        }
        if (matches) expected.push(t);
      });
      if (expected.length > 0) map.set(dayStr, expected);
    });
    return map;
  }, [activeRecurring, daysInMonth, monthEnd]);

  // Calendar grid padding â€” Monday first (Italian locale)
  const startDay = getDay(monthStart);
  const emptyPrefixDays = startDay === 0 ? 6 : startDay - 1;
  const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Estimate the balance at the START of the viewed month
  // For offset=0: use currentBalance as-is (projecting from today within the month)
  // For other offsets: approximate by applying the monthly net recurring for each offset step
  const estimatedMonthStartBalance = useMemo(() => {
    if (monthOffset === 0) return currentBalance;
    const monthlyNet = activeRecurring.reduce((s, t) => {
      if (!t.interval) return s;
      const sign = t.type === "income" ? 1 : -1;
      if (t.interval === "monthly") return s + sign * t.amount;
      if (t.interval === "yearly")  return s + sign * (t.amount / 12);
      if (t.interval === "weekly")  return s + sign * (t.amount * 4.33);
      if (t.interval === "daily")   return s + sign * (t.amount * 30);
      return s;
    }, 0);
    return currentBalance + monthlyNet * monthOffset;
  }, [monthOffset, currentBalance, activeRecurring]);

  // Running balance across viewed month's days
  const runningBalances = useMemo(() => {
    let bal = estimatedMonthStartBalance;
    const map = new Map<string, number>();
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    daysInMonth.forEach(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      // Current month: only project from today onward
      if (monthOffset === 0 && day < todayMidnight) return;

      const expectedTxs = dayMap.get(dayStr) || [];
      const net = expectedTxs.reduce(
        (sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0
      );
      bal += net;
      map.set(dayStr, bal);
    });
    return map;
  }, [daysInMonth, dayMap, estimatedMonthStartBalance, monthOffset]);

  // Detail panel data
  const selectedDayTxs     = selectedDay ? (dayMap.get(selectedDay) || []) : [];
  const selectedDayBalance = selectedDay ? runningBalances.get(selectedDay) : undefined;
  const selectedDayDate    = selectedDay ? new Date(selectedDay + "T12:00:00") : null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

  const isCurrentMonth = monthOffset === 0;
  const isFutureMonth  = monthOffset > 0;

  return (
    <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* â”€â”€ Header with month navigation â”€â”€ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Calendario</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => { setMonthOffset(o => o - 1); setSelectedDay(null); }}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-subtle)",
              background: "var(--bg-subtle)", cursor: "pointer", color: "var(--text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.12s",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            title="Mese precedente"
          >
            <ChevronLeft size={15} />
          </button>

          <div style={{ minWidth: 140, textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", textTransform: "capitalize" }}>
              {format(viewDate, "MMMM yyyy", { locale: it })}
            </span>
            {monthOffset !== 0 && (
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>
                {isFutureMonth ? `+${monthOffset} mese` : `${monthOffset} mese`}
                <button
                  onClick={() => { setMonthOffset(0); setSelectedDay(null); }}
                  style={{ marginLeft: 6, background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 10, fontWeight: 600, padding: 0 }}
                >
                  â† Oggi
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { setMonthOffset(o => o + 1); setSelectedDay(null); }}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-subtle)",
              background: "var(--bg-subtle)", cursor: "pointer", color: "var(--text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.12s",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            title="Mese successivo"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Estimated balance banner for non-current months */}
      {monthOffset !== 0 && (
        <div style={{
          padding: "10px 14px", borderRadius: 8,
          background: isFutureMonth ? "var(--accent-dim)" : "var(--bg-subtle)",
          border: `1px solid ${isFutureMonth ? "var(--accent-border)" : "var(--border-subtle)"}`,
          fontSize: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ color: "var(--text-secondary)" }}>
            {isFutureMonth ? "Saldo stimato a inizio mese:" : "Proiezione retrospettiva â€” saldo stimato:"}
          </span>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 13,
            color: estimatedMonthStartBalance < 0 ? "var(--expense-color)" : "var(--income-color)",
          }}>
            {fmt(estimatedMonthStartBalance)}
          </span>
        </div>
      )}

      {/* â”€â”€ Calendar Grid â”€â”€ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center" }}>
        {WEEKDAYS.map(wd => (
          <div key={wd} style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", paddingBottom: 4 }}>
            {wd}
          </div>
        ))}
        {Array.from({ length: emptyPrefixDays }).map((_, i) => <div key={`empty-${i}`} />)}

        {daysInMonth.map(day => {
          const dayStr       = format(day, "yyyy-MM-dd");
          const expectedTxs  = dayMap.get(dayStr) || [];
          const isToday      = isSameDay(day, new Date());
          const isSelected   = selectedDay === dayStr;
          const netAmount    = expectedTxs.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
          const hasEvents    = expectedTxs.length > 0;
          const runningBal   = runningBalances.get(dayStr);
          const isOverdraft  = runningBal !== undefined && runningBal < 0;
          const hasProjection = runningBal !== undefined;

          const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
          const isPast = monthOffset === 0 && day < todayMidnight;

          return (
            <div
              key={dayStr}
              onClick={() => setSelectedDay(selectedDay === dayStr ? null : dayStr)}
              style={{
                minHeight: 78,
                background: isSelected
                  ? "var(--accent-dim)"
                  : isToday
                  ? "var(--bg-elevated)"
                  : isOverdraft
                  ? "rgba(239,68,68,0.06)"
                  : isPast
                  ? "var(--bg-base)"
                  : "var(--bg-subtle)",
                border: isSelected
                  ? "1.5px solid var(--accent)"
                  : isToday
                  ? "1px solid var(--accent)"
                  : isOverdraft
                  ? "1px solid rgba(239,68,68,0.35)"
                  : "1px solid var(--border-subtle)",
                borderRadius: 9, padding: "7px 6px",
                display: "flex", flexDirection: "column", gap: 4,
                position: "relative", cursor: "pointer",
                opacity: isPast ? 0.45 : 1,
                transition: "all 0.12s",
              }}
              onMouseOver={e => { if (!isSelected && !isPast) e.currentTarget.style.borderColor = "var(--accent-border)"; }}
              onMouseOut={e => {
                if (!isSelected && !isToday && !isOverdraft && !isPast) e.currentTarget.style.borderColor = "var(--border-subtle)";
                if (!isSelected && isOverdraft) e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                if (!isSelected && isToday) e.currentTarget.style.borderColor = "var(--accent)";
              }}
            >
              {isOverdraft && (
                <div style={{
                  position: "absolute", top: -4, right: -4, width: 10, height: 10,
                  borderRadius: "50%", background: "var(--expense-color)",
                  border: "2px solid var(--bg-base)", zIndex: 1,
                }} title="Rischio scoperto!" />
              )}

              {/* Day number */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: 12, fontWeight: isToday ? 800 : 500,
                  color: isSelected ? "var(--accent)" : isToday ? "var(--accent)" : "var(--text-primary)",
                }}>
                  {day.getDate()}
                </span>
                {hasEvents && (
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: netAmount >= 0 ? "var(--income-color)" : "var(--expense-color)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {netAmount > 0 ? "+" : ""}{Math.round(netAmount)}â‚¬
                  </span>
                )}
              </div>

              {/* Transaction chips */}
              {hasEvents && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {expectedTxs.slice(0, 2).map((t, i) => (
                    <div key={i} style={{
                      fontSize: 8, fontWeight: 600, padding: "1px 3px", borderRadius: 3,
                      background: t.type === "income" ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)",
                      color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left",
                    }}>
                      {t.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim()}
                    </div>
                  ))}
                  {expectedTxs.length > 2 && (
                    <div style={{ fontSize: 8, color: "var(--text-muted)" }}>+{expectedTxs.length - 2}</div>
                  )}
                </div>
              )}

              {/* Running balance */}
              {hasProjection && (
                <div style={{
                  marginTop: "auto", fontSize: 8, fontWeight: 600, textAlign: "right",
                  color: isOverdraft ? "var(--expense-color)" : "var(--text-muted)",
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  ~{fmt(runningBal!)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* â”€â”€ Day Detail Panel â”€â”€ */}
      {selectedDay && selectedDayDate && (
        <div style={{
          marginTop: 4, padding: "20px 22px", borderRadius: 12,
          background: "var(--bg-elevated)", border: "1px solid var(--accent-border)",
          display: "flex", flexDirection: "column", gap: 14,
          animation: "fadeUp 0.15s ease both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, textTransform: "capitalize" }}>
                {format(selectedDayDate, "EEEE d MMMM", { locale: it })}
              </span>
              {selectedDayBalance !== undefined && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  Saldo stimato:{" "}
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: selectedDayBalance < 0 ? "var(--expense-color)" : "var(--income-color)" }}>
                    {fmt(selectedDayBalance)}
                  </span>
                  {selectedDayBalance < 0 && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--expense-color)", fontWeight: 600 }}>âš ï¸ Scoperto!</span>}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onDayClick?.(selectedDay!)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "var(--accent)", color: "white", fontSize: 12, fontWeight: 700,
                }}
              >
                <Plus size={13} /> Nuova Transazione
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, cursor: "pointer", padding: "7px 10px", color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {selectedDayTxs.length === 0 ? (
            <div style={{ padding: "16px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Nessuna ricorrenza prevista.{" "}
              <span style={{ fontSize: 12 }}>Usa "Nuova Transazione" per aggiungerne una.</span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedDayTxs.map((t, i) => {
                  const cleanDesc = t.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim();
                  const txTags = t.description.match(/#[\w\u00C0-\u017F]+/g) || [];
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px", borderRadius: 10,
                      background: t.type === "income" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                      border: t.type === "income" ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(239,68,68,0.18)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: t.type === "income" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {t.type === "income"
                            ? <TrendingUp size={13} color="var(--income-color)" />
                            : <TrendingDown size={13} color="var(--expense-color)" />
                          }
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{cleanDesc || t.description}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                              ðŸ” {t.interval === "monthly" ? "mensile" : t.interval === "weekly" ? "settimanale" : t.interval === "yearly" ? "annuale" : "giornaliero"}
                            </span>
                            {t.category && (
                              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: `${t.category.color}18`, color: t.category.color, fontWeight: 600 }}>
                                {t.category.name}
                              </span>
                            )}
                            {txTags.map(tag => (
                              <span key={tag} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: "rgba(139,92,246,0.12)", color: "#a78bfa", fontWeight: 600 }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                        color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                        whiteSpace: "nowrap",
                      }}>
                        {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Day summary breakdown */}
              {(() => {
                const inc = selectedDayTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
                const exp = selectedDayTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                return (
                  <div style={{
                    display: "flex", gap: 16, paddingTop: 10,
                    borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap"
                  }}>
                    {inc > 0 && <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--income-color)" }}>Entrate +{fmt(inc)}</span>}
                    {exp > 0 && <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--expense-color)" }}>Uscite -{fmt(exp)}</span>}
                    <span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: inc - exp >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>
                      Netto {inc - exp >= 0 ? "+" : ""}{fmt(inc - exp)}
                    </span>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 4, borderTop: "1px solid var(--border-subtle)" }}>
        {[
          { dot: "var(--income-color)", label: "Entrata ricorrente" },
          { dot: "var(--expense-color)", label: "Uscita ricorrente" },
          { dot: "var(--accent)", label: "Oggi" },
        ].map(({ dot, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: dot, display: "inline-block" }} />{label}
          </span>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>Clicca un giorno per i dettagli</span>
      </div>
    </div>
  );
}

