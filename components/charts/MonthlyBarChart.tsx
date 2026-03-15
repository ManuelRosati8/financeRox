"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { useMemo } from "react";
import { format, subMonths, parseISO } from "date-fns";
import { it } from "date-fns/locale";

interface Props {
  transactions: Transaction[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow)",
    }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 3, background: p.color }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {p.name === "income" ? "Entrate" : "Uscite"}
            </span>
          </span>
          <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: p.color }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyBarChart({ transactions }: Props) {
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      const key   = format(month, "yyyy-MM");
      const label = format(month, "MMM", { locale: it });

      const txMonth = transactions.filter((t) =>
        t.date.startsWith(key)
      );
      const income   = txMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expenses = txMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { label, income, expenses };
    });
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f43f5e" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={38}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-subtle)", radius: 6 }} />
        <Bar dataKey="income"   radius={[6, 6, 0, 0]} fill="url(#gradIncome)"  maxBarSize={28} />
        <Bar dataKey="expenses" radius={[6, 6, 0, 0]} fill="url(#gradExpense)" maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
