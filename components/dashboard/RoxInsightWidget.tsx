"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Transaction, Category } from "@/lib/types";
import { subMonths, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

interface Insight {
  type: "positive" | "warning" | "danger" | "info";
  icon: typeof TrendingUp;
  title: string;
  body: string;
}

function monthRange(date: Date) {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

function sumInRange(txs: Transaction[], start: Date, end: Date, type: "income" | "expense") {
  return txs
    .filter(t => t.type === type && t.status === "confirmed")
    .filter(t => isWithinInterval(parseISO(t.date), { start, end }))
    .reduce((s, t) => s + t.amount, 0);
}

const ICON: Record<Insight["type"], typeof TrendingUp> = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  danger: TrendingDown,
  info: Lightbulb,
};

const COLOR: Record<Insight["type"], string> = {
  positive: "var(--income-color)",
  warning: "#f59e0b",
  danger: "var(--expense-color)",
  info: "var(--accent)",
};

const BG: Record<Insight["type"], string> = {
  positive: "rgba(34,197,94,0.08)",
  warning: "rgba(245,158,11,0.08)",
  danger: "rgba(239,68,68,0.08)",
  info: "rgba(249,115,22,0.08)",
};

export function RoxInsightWidget({ transactions, categories }: Props) {
  const insights = useMemo<Insight[]>(() => {
    if (transactions.length === 0) return [];

    const now = new Date();
    const thisMonth = monthRange(now);
    const lastMonth = monthRange(subMonths(now, 1));
    const twoMonthsAgo = monthRange(subMonths(now, 2));

    const incomeThis = sumInRange(transactions, thisMonth.start, thisMonth.end, "income");
    const incomeLast = sumInRange(transactions, lastMonth.start, lastMonth.end, "income");
    const expenseThis = sumInRange(transactions, thisMonth.start, thisMonth.end, "expense");
    const expenseLast = sumInRange(transactions, lastMonth.start, lastMonth.end, "expense");

    const fmt = (n: number) =>
      n.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const result: Insight[] = [];

    // ── Insight 1: Expenses vs income this month ──
    if (expenseThis > 0 && incomeThis > 0) {
      const ratio = expenseThis / incomeThis;
      if (ratio > 0.9) {
        result.push({
          type: "danger",
          icon: TrendingDown,
          title: "Spese elevate questo mese",
          body: `Hai speso €${fmt(expenseThis)} su €${fmt(incomeThis)} di entrate (${Math.round(ratio * 100)}%). Considera di ridurre le uscite variabili.`,
        });
      } else if (ratio < 0.6) {
        result.push({
          type: "positive",
          icon: CheckCircle2,
          title: "Ottimo risparmio!",
          body: `Stai risparmiando il ${Math.round((1 - ratio) * 100)}% delle entrate. Stai costruendo solidità finanziaria.`,
        });
      }
    }

    // ── Insight 2: Biggest expense category this month ──
    const catSums = new Map<string, number>();
    transactions
      .filter(t => t.type === "expense" && t.status === "confirmed" && t.category_id)
      .filter(t => isWithinInterval(parseISO(t.date), { start: thisMonth.start, end: thisMonth.end }))
      .forEach(t => {
        catSums.set(t.category_id!, (catSums.get(t.category_id!) ?? 0) + t.amount);
      });

    if (catSums.size > 0) {
      const [topCatId, topAmt] = [...catSums.entries()].sort((a, b) => b[1] - a[1])[0];
      const topCat = categories.find(c => c.id === topCatId);
      if (topCat && expenseThis > 0) {
        const share = Math.round((topAmt / expenseThis) * 100);
        if (share >= 30) {
          result.push({
            type: "info",
            icon: Lightbulb,
            title: `"${topCat.name}" pesa il ${share}%`,
            body: `€${fmt(topAmt)} su €${fmt(expenseThis)} di spese totali. È normale? Se no, potrebbe essere il posto giusto dove tagliare.`,
          });
        }
      }
    }

    // ── Insight 3: Expense spike vs last month ──
    if (expenseThis > 0 && expenseLast > 0) {
      const change = ((expenseThis - expenseLast) / expenseLast) * 100;
      if (change > 20) {
        result.push({
          type: "warning",
          icon: AlertTriangle,
          title: `Spese +${Math.round(change)}% rispetto al mese scorso`,
          body: `Lo scorso mese hai speso €${fmt(expenseLast)}, questo mese già €${fmt(expenseThis)}. Controlla le uscite insolite.`,
        });
      } else if (change < -15) {
        result.push({
          type: "positive",
          icon: TrendingUp,
          title: `Spese in calo del ${Math.round(Math.abs(change))}%`,
          body: `Ottimo controllo! Rispetto allo scorso mese hai risparmiato €${fmt(expenseLast - expenseThis)} in più.`,
        });
      }
    }

    // ── Insight 4: Income trend ──
    const incomeTwoAgo = sumInRange(transactions, twoMonthsAgo.start, twoMonthsAgo.end, "income");
    if (incomeThis > 0 && incomeLast > 0 && incomeTwoAgo > 0) {
      const trend = ((incomeThis - incomeTwoAgo) / (incomeTwoAgo || 1)) * 100;
      if (trend > 10) {
        result.push({
          type: "positive",
          icon: TrendingUp,
          title: "Entrate in crescita",
          body: `Le tue entrate sono aumentate del ${Math.round(trend)}% negli ultimi 3 mesi. Continua così!`,
        });
      }
    }

    // ── Insight 5: No income this month ──
    if (incomeThis === 0 && expenseThis > 0) {
      result.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Nessuna entrata registrata",
        body: `Hai €${fmt(expenseThis)} di spese questo mese ma nessuna entrata. Hai dimenticato di registrare lo stipendio?`,
      });
    }

    // Return top 2 insights
    return result.slice(0, 2);
  }, [transactions, categories]);

  return (
    <div className="glass" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Lightbulb size={15} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            Rox Insight{" "}
            <span
              className="pro-shimmer"
              style={{
                fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                color: "white", verticalAlign: "middle", letterSpacing: "0.06em",
              }}
            >
              PRO
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Analisi automatica delle tue finanze</div>
        </div>
      </div>

      {/* Insights */}
      {insights.length === 0 ? (
        <div style={{
          padding: "18px 16px", borderRadius: 10,
          background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
          fontSize: 13, color: "var(--text-muted)", textAlign: "center",
        }}>
          Aggiungi più transazioni per sbloccare i suggerimenti personalizzati.
        </div>
      ) : (
        insights.map((ins, i) => {
          const InsIcon = ICON[ins.type];
          return (
            <div
              key={i}
              style={{
                padding: "14px 14px",
                borderRadius: 10,
                background: BG[ins.type],
                border: `1px solid ${COLOR[ins.type]}28`,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 7,
                background: `${COLOR[ins.type]}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <InsIcon size={14} color={COLOR[ins.type]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLOR[ins.type], marginBottom: 3 }}>
                  {ins.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {ins.body}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
