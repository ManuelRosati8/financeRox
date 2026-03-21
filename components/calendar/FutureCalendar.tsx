import { useMemo, useState } from "react";
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, parseISO, isSameDay
} from "date-fns";
import { it } from "date-fns/locale";
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
  onDayClick?: (dateString: string) => void;
  currentBalance?: number;
}

export function FutureCalendar({ transactions, onDayClick, currentBalance = 0 }: Props) {
  const currentMonthDate = new Date();
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Selected day for detail panel
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // 1. Get unique active recurring transactions
  const activeRecurring = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.filter(t => t.is_recurring).forEach(t => {
      if (!map.has(t.description)) {
        map.set(t.description, t);
      }
    });
    return Array.from(map.values());
  }, [transactions]);

  // 2. Map day -> expected transactions
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
          const txDayOffset = txDate.getDate();
          const currentMonthLastDay = monthEnd.getDate();
          const targetDay = Math.min(txDayOffset, currentMonthLastDay);
          matches = day.getDate() === targetDay;
        } else if (t.interval === "yearly") {
          matches = day.getMonth() === txDate.getMonth() && day.getDate() === txDate.getDate();
        }

        if (matches) {
          expected.push(t);
        }
      });

      if (expected.length > 0) {
        map.set(dayStr, expected);
      }
    });
    
    return map;
  }, [activeRecurring, daysInMonth, monthEnd]);

  // Calendar Grid padding — Monday first (Italian locale)
  const startDay = getDay(monthStart); // 0=Sun … 6=Sat
  const emptyPrefixDays = startDay === 0 ? 6 : startDay - 1;

  const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Compute Running Balance
  const runningBalances = useMemo(() => {
    let bal = currentBalance;
    const map = new Map<string, number>();
    // Hoist todayMidnight outside the loop to avoid setHours mutation side effects
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    
    daysInMonth.forEach(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      if (day < todayMidnight) return;
      
      const expectedTxs = dayMap.get(dayStr) || [];
      const netAmount = expectedTxs.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
      
      bal += netAmount;
      map.set(dayStr, bal);
    });
    return map;
  }, [daysInMonth, dayMap, currentBalance]);

  // Detail panel data
  const selectedDayTxs = selectedDay ? (dayMap.get(selectedDay) || []) : [];
  const selectedDayBalance = selectedDay ? runningBalances.get(selectedDay) : undefined;
  const selectedDayDate = selectedDay ? new Date(selectedDay + "T12:00:00") : null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Calendario Mensile</h2>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--accent)", textTransform: "capitalize" }}>
          {format(currentMonthDate, "MMMM yyyy", { locale: it })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center" }}>
        {WEEKDAYS.map(wd => (
          <div key={wd} style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", paddingBottom: 4 }}>
            {wd}
          </div>
        ))}

        {Array.from({ length: emptyPrefixDays }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map(day => {
          const dayStr = format(day, "yyyy-MM-dd");
          const expectedTxs = dayMap.get(dayStr) || [];
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDay === dayStr;
          const netAmount = expectedTxs.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
          const hasEvents = expectedTxs.length > 0;
          const runningBal = runningBalances.get(dayStr);
          const isOverdraft = runningBal !== undefined && runningBal < 0;
          const isFuture = runningBal !== undefined;
          
          return (
            <div 
              key={dayStr}
              onClick={() => setSelectedDay(selectedDay === dayStr ? null : dayStr)}
              style={{
                minHeight: 80,
                background: isSelected
                  ? "var(--accent-dim)"
                  : isToday
                  ? "var(--bg-elevated)"
                  : isOverdraft
                  ? "rgba(239,68,68,0.06)"
                  : "var(--bg-subtle)",
                border: isSelected
                  ? "1.5px solid var(--accent)"
                  : isToday
                  ? "1px solid var(--accent)"
                  : isOverdraft
                  ? "1px solid rgba(239,68,68,0.35)"
                  : "1px solid var(--border-subtle)",
                borderRadius: 9, padding: "7px 6px",
                display: "flex", flexDirection: "column", gap: 5,
                position: "relative", cursor: "pointer",
                transition: "all 0.12s",
              }}
              onMouseOver={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--accent-border)"; }}
              onMouseOut={e => {
                if (!isSelected && !isToday && !isOverdraft) e.currentTarget.style.borderColor = "var(--border-subtle)";
                if (!isSelected && isOverdraft) e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                if (!isSelected && isToday) e.currentTarget.style.borderColor = "var(--accent)";
              }}
            >
              {isOverdraft && (
                <div style={{
                  position: "absolute", top: -4, right: -4, width: 11, height: 11,
                  borderRadius: "50%", background: "var(--expense-color)",
                  border: "2px solid var(--bg-base)", zIndex: 1,
                }} title="Rischio Scoperto!" />
              )}
              
              {/* Day number + net badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: 13, fontWeight: isToday ? 800 : 500,
                  color: isSelected ? "var(--accent)" : isToday ? "var(--accent)" : "var(--text-primary)",
                }}>
                  {day.getDate()}
                </span>
                {hasEvents && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: netAmount >= 0 ? "var(--income-color)" : "var(--expense-color)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {netAmount > 0 ? "+" : ""}{Math.round(netAmount)}€
                  </span>
                )}
              </div>

              {/* Transaction chips (max 2, then +N) */}
              {hasEvents && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {expectedTxs.slice(0, 2).map((t, i) => (
                    <div key={i} style={{
                      fontSize: 9, fontWeight: 600, padding: "2px 4px", borderRadius: 3,
                      background: t.type === "income" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                      color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left",
                    }}>
                      {t.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim()}
                    </div>
                  ))}
                  {expectedTxs.length > 2 && (
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "left" }}>
                      +{expectedTxs.length - 2} altri
                    </div>
                  )}
                </div>
              )}

              {/* Running balance */}
              {isFuture && (
                <div style={{
                  marginTop: "auto", fontSize: 9, fontWeight: 600, textAlign: "right",
                  color: isOverdraft ? "var(--expense-color)" : "var(--text-muted)",
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  ~{fmt(runningBal)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Day Detail Panel ── */}
      {selectedDay && selectedDayDate && (
        <div style={{
          marginTop: 4,
          padding: "20px 22px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--accent-border)",
          display: "flex", flexDirection: "column", gap: 14,
          animation: "fadeUp 0.15s ease both",
        }}>
          {/* Panel header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", textTransform: "capitalize" }}>
                {format(selectedDayDate, "EEEE d MMMM", { locale: it })}
              </span>
              {selectedDayBalance !== undefined && (
                <div style={{ fontSize: 12, color: selectedDayBalance < 0 ? "var(--expense-color)" : "var(--text-muted)", marginTop: 2 }}>
                  Saldo stimato:{" "}
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: selectedDayBalance < 0 ? "var(--expense-color)" : "var(--income-color)" }}>
                    {fmt(selectedDayBalance)}
                  </span>
                  {selectedDayBalance < 0 && (
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--expense-color)", fontWeight: 600 }}>
                      ⚠️ Scoperto!
                    </span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onDayClick?.(selectedDay)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "var(--accent)", color: "white",
                  fontSize: 12, fontWeight: 700,
                }}
              >
                <Plus size={13} />
                Nuova Transazione
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, cursor: "pointer", padding: "7px 10px", color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Transaction list or empty state */}
          {selectedDayTxs.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Nessuna transazione ricorrente prevista per questo giorno.
              <br />
              <span style={{ fontSize: 12 }}>Usa il bottone "Nuova Transazione" per aggiungerne una.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedDayTxs.map((t, i) => {
                const cleanDesc = t.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim();
                const tags = t.description.match(/#[\w\u00C0-\u017F]+/g) || [];
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 10,
                    background: t.type === "income" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                    border: t.type === "income" ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(239,68,68,0.18)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: t.type === "income" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {t.type === "income"
                          ? <TrendingUp size={14} color="var(--income-color)" />
                          : <TrendingDown size={14} color="var(--expense-color)" />
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                          {cleanDesc || t.description}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            🔁 Ricorrente · {t.interval === "monthly" ? "mensile" : t.interval === "weekly" ? "settimanale" : t.interval === "yearly" ? "annuale" : "giornaliero"}
                          </span>
                          {t.category && (
                            <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 99, background: `${t.category.color}18`, color: t.category.color, fontWeight: 600 }}>
                              {t.category.name}
                            </span>
                          )}
                          {tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: "rgba(139,92,246,0.12)", color: "#a78bfa", fontWeight: 600 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: 15, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                      color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                    }}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Day summary */}
          {selectedDayTxs.length > 0 && (() => {
            const inc = selectedDayTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
            const exp = selectedDayTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
            return (
              <div style={{ display: "flex", gap: 12, paddingTop: 4, borderTop: "1px solid var(--border-subtle)" }}>
                {inc > 0 && (
                  <div style={{ fontSize: 12, color: "var(--income-color)", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                    Entrate: +{fmt(inc)}
                  </div>
                )}
                {exp > 0 && (
                  <div style={{ fontSize: 12, color: "var(--expense-color)", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                    Uscite: -{fmt(exp)}
                  </div>
                )}
                <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                  Netto: <span style={{ color: inc - exp >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>{inc - exp >= 0 ? "+" : ""}{fmt(inc - exp)}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, paddingTop: 4, borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
        {[
          { dot: "var(--income-color)", label: "Entrata ricorrente" },
          { dot: "var(--expense-color)", label: "Uscita ricorrente" },
          { dot: "var(--accent)", label: "Oggi" },
        ].map(({ dot, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: dot, display: "inline-block" }} />{label}
          </span>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
          Clicca un giorno per i dettagli
        </span>
      </div>
    </div>
  );
}
