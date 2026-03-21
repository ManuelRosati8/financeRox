"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

interface MonthBucket {
  label: string;   // "Nov 2025"
  income: number;
  varExpenses: number;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getLabelFromKey(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("it-IT", { month: "short", year: "numeric" });
}

export function LifestyleInflationWidget({ transactions }: Props) {
  const buckets = useMemo<MonthBucket[]>(() => {
    // Build last 6 complete months (excluding current month in progress)
    const now = new Date();
    const monthKeys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
      monthKeys.push(getMonthKey(d));
    }

    const map = new Map<string, MonthBucket>();
    monthKeys.forEach((k) =>
      map.set(k, { label: getLabelFromKey(k), income: 0, varExpenses: 0 })
    );

    transactions
      .filter((t) => t.status === "confirmed")
      .forEach((t) => {
        const key = t.date.slice(0, 7);
        if (!map.has(key)) return;
        const bucket = map.get(key)!;
        if (t.type === "income") {
          bucket.income += t.amount;
        } else if (!t.is_recurring) {
          // Only variable (non-recurring) expenses
          bucket.varExpenses += t.amount;
        }
      });

    return monthKeys.map((k) => map.get(k)!);
  }, [transactions]);

  // Growth rates: compare last 3m average vs first 3m average
  const { incomeGrowth, expenseGrowth, status } = useMemo(() => {
    if (buckets.length < 6)
      return { incomeGrowth: 0, expenseGrowth: 0, status: "neutral" as const };

    const first3Income = buckets.slice(0, 3).reduce((s, b) => s + b.income, 0) / 3;
    const last3Income = buckets.slice(3).reduce((s, b) => s + b.income, 0) / 3;
    const first3Exp = buckets.slice(0, 3).reduce((s, b) => s + b.varExpenses, 0) / 3;
    const last3Exp = buckets.slice(3).reduce((s, b) => s + b.varExpenses, 0) / 3;

    const incGrowth =
      first3Income > 0 ? ((last3Income - first3Income) / first3Income) * 100 : 0;
    const expGrowth =
      first3Exp > 0 ? ((last3Exp - first3Exp) / first3Exp) * 100 : 0;

    let st: "ok" | "warning" | "danger" | "neutral" = "neutral";
    if (expGrowth > incGrowth + 10) st = "danger";
    else if (expGrowth > incGrowth) st = "warning";
    else st = "ok";

    return { incomeGrowth: incGrowth, expenseGrowth: expGrowth, status: st };
  }, [buckets]);

  const maxValue = useMemo(
    () => Math.max(...buckets.map((b) => Math.max(b.income, b.varExpenses)), 1),
    [buckets]
  );

  const statusConfig = {
    ok: {
      color: "var(--income-color)",
      label: "Spese sotto controllo",
      Icon: TrendingDown,
    },
    warning: {
      color: "#f59e0b",
      label: "Leggero incremento spese",
      Icon: TrendingUp,
    },
    danger: {
      color: "var(--expense-color)",
      label: "Lifestyle inflation rilevata",
      Icon: AlertTriangle,
    },
    neutral: {
      color: "var(--text-muted)",
      label: "Dati insufficienti",
      Icon: Minus,
    },
  };

  const cfg = statusConfig[status];

  return (
    <div
      className="glass"
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Lifestyle Inflation
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <cfg.Icon size={15} color={cfg.color} />
            <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Rate pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <div
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 99,
              fontWeight: 600,
              background: "rgba(34,197,94,0.1)",
              color: "var(--income-color)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ↑ Entrate {incomeGrowth >= 0 ? "+" : ""}
            {incomeGrowth.toFixed(1)}%
          </div>
          <div
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 99,
              fontWeight: 600,
              background:
                status === "danger"
                  ? "rgba(239,68,68,0.12)"
                  : status === "warning"
                  ? "rgba(245,158,11,0.12)"
                  : "rgba(239,68,68,0.08)",
              color:
                status === "danger"
                  ? "var(--expense-color)"
                  : status === "warning"
                  ? "#f59e0b"
                  : "var(--text-muted)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ↑ Uscite var. {expenseGrowth >= 0 ? "+" : ""}
            {expenseGrowth.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Mini bar chart — last 6 months */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "flex-end",
          height: 56,
        }}
      >
        {buckets.map((b) => (
          <div
            key={b.label}
            title={`${b.label}\nEntrate: ${formatCurrency(b.income)}\nUscite var: ${formatCurrency(b.varExpenses)}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "stretch",
            }}
          >
            {/* Income bar */}
            <div
              style={{
                height: `${Math.max((b.income / maxValue) * 44, 1)}px`,
                borderRadius: "3px 3px 0 0",
                background: "rgba(34,197,94,0.5)",
                minHeight: 2,
              }}
            />
            {/* Variable expense bar */}
            <div
              style={{
                height: `${Math.max((b.varExpenses / maxValue) * 44, 1)}px`,
                borderRadius: "3px 3px 0 0",
                background: "rgba(239,68,68,0.45)",
                minHeight: 2,
              }}
            />
          </div>
        ))}
      </div>

      {/* Legend + month labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "rgba(34,197,94,0.5)",
                display: "inline-block",
              }}
            />
            Entrate
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "rgba(239,68,68,0.45)",
                display: "inline-block",
              }}
            />
            Uscite variabili
          </span>
        </div>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          Ultimi 6 mesi
        </span>
      </div>
    </div>
  );
}
