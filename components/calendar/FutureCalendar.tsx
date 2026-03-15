import { useMemo } from "react";
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, parseISO, isSameDay
} from "date-fns";
import { it } from "date-fns/locale";
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
          // If transaction was on the 31st and the month only has 30 days, we'd snap it to end of month, 
          // but for simplicity we match the exact date.getDate()
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

  // Calendar Grid padding for first day of week (0 = Sunday, 1 = Monday, etc.)
  // Let's use Monday as first day of week for Italy locale
  const startDay = getDay(monthStart); // 0 = Sun, 1 = Mon... 6 = Sat
  const emptyPrefixDays = startDay === 0 ? 6 : startDay - 1; // shift so Monday is 0

  const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Compute Running Balance
  const runningBalances = useMemo(() => {
    let bal = currentBalance;
    const map = new Map<string, number>();
    const today = new Date();
    
    // We only compute running balance starting from "today"
    daysInMonth.forEach(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      if (day >= startOfMonth(today) && day < today) {
        // past days in the month are ignored for running balance prediction
        return; 
      }
      
      const expectedTxs = dayMap.get(dayStr) || [];
      const netAmount = expectedTxs.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
      
      // We only add the netAmount if it's strictly > today, OR if it's today, we assume the transaction happens today.
      // For simplicity, let's just add it starting today.
      if (day >= new Date(today.setHours(0,0,0,0))) {
        bal += netAmount;
        map.set(dayStr, bal);
      }
    });
    return map;
  }, [daysInMonth, dayMap, currentBalance]);

  return (
    <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Calendario Mensile</h2>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--accent)", textTransform: "capitalize" }}>
          {format(currentMonthDate, "MMMM yyyy", { locale: it })}
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8,
        textAlign: "center"
      }}>
        {WEEKDAYS.map(wd => (
          <div key={wd} style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            {wd}
          </div>
        ))}

        {Array.from({ length: emptyPrefixDays }).map((_, i) => (
          <div key={`empty-${i}`} style={{ opacity: 0.2 }} />
        ))}

        {daysInMonth.map(day => {
          const dayStr = format(day, "yyyy-MM-dd");
          const expectedTxs = dayMap.get(dayStr) || [];
          const isToday = isSameDay(day, new Date());
          
          const netAmount = expectedTxs.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
          const hasEvents = expectedTxs.length > 0;
          const runningBal = runningBalances.get(dayStr);
          const isOverdraft = runningBal !== undefined && runningBal < 0;
          const isFuture = runningBal !== undefined;
          
          return (
            <div 
              key={dayStr}
              onClick={() => onDayClick?.(dayStr)}
              style={{
                minHeight: 100, // allows vertical expansion, a bit taller for running balance
                background: isToday ? "var(--bg-elevated)" : (isOverdraft ? "rgba(244,63,94,0.05)" : "var(--bg-subtle)"),
                border: isToday 
                  ? "1px solid var(--accent)" 
                  : (isOverdraft ? "1px solid rgba(244,63,94,0.4)" : "1px solid var(--border-subtle)"),
                borderRadius: 10, padding: 8,
                display: "flex", flexDirection: "column", gap: 6,
                position: "relative",
                cursor: onDayClick ? "pointer" : "default",
                transition: "transform 0.1s",
              }}
              onMouseOver={(e) => { if (onDayClick) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseOut={(e) => { if (onDayClick) e.currentTarget.style.transform = "scale(1)"; }}
              title={expectedTxs.length === 0 ? "Clicca per aggiungere transazione" : undefined}
            >
              {isOverdraft && (
                <div style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, borderRadius: "50%", background: "var(--expense-color)", border: "2px solid var(--bg-primary)" }} title="Rischio Scoperto!" />
              )}
              {/* Day Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ 
                  fontSize: 13, fontWeight: isToday ? 800 : 500, 
                  color: isToday ? "var(--accent)" : "var(--text-primary)",
                  textAlign: "left"
                }}>
                  {day.getDate()}
                </div>
                
                {hasEvents && netAmount !== 0 && (
                  <div style={{
                    fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                    color: netAmount >= 0 ? "var(--income-color)" : "var(--expense-color)"
                  }}>
                    {netAmount > 0 ? "+" : ""}{Math.round(netAmount)}€
                  </div>
                )}
              </div>

              {/* Transaction List */}
              {hasEvents && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {expectedTxs.map((t, i) => (
                    <div key={i} style={{ 
                      fontSize: 10, fontWeight: 600, padding: "3px 5px", borderRadius: 4,
                      background: t.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
                      color: t.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      textAlign: "left"
                    }}>
                      {t.description}
                    </div>
                  ))}
                </div>
              )}

              {/* Running Balance Display */}
              {isFuture && (
                <div style={{ 
                  marginTop: "auto", fontSize: 10, fontWeight: 600, textAlign: "right",
                  color: isOverdraft ? "var(--expense-color)" : "var(--text-muted)",
                  fontFamily: "JetBrains Mono, monospace"
                }} title="Saldo stimato a fine giornata">
                  ~{new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(runningBal)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
