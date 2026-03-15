"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { ProjectionPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: ProjectionPoint[];
  showWhatIf: boolean;
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "12px 16px", minWidth: 190,
      boxShadow: "var(--shadow)",
    }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, fontWeight: 500 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 5, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {p.dataKey === "balance" ? "Baseline" : "What-If"}
            </span>
          </span>
          <span style={{
            fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 600,
            color: p.value >= 0 ? "var(--income-color)" : "var(--expense-color)",
          }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ProjectionChart({ data, showWhatIf }: Props) {
  const milestoneMonths = [5, 11, 23];
  const milestones = milestoneMonths.map((i) => data[i]?.month).filter(Boolean);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradWhatIf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.2}  />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tickFormatter={(v) =>
            v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`
          }
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {value === "balance" ? "Proiezione baseline" : "Proiezione What‑If"}
            </span>
          )}
        />

        {/* Milestone vertical lines at 6, 12, 24 months */}
        {milestones.map((m, i) => (
          <ReferenceLine
            key={m} x={m}
            stroke="var(--border)"
            strokeDasharray="4 3"
            label={{
              value: ["6m", "12m", "24m"][i],
              position: "insideTopRight",
              fill: "var(--text-muted)",
              fontSize: 10,
            }}
          />
        ))}

        {/* Baseline area */}
        <Area
          type="monotone"
          dataKey="balance"
          name="balance"
          stroke="var(--accent)"
          strokeWidth={2.5}
          fill="url(#gradBaseline)"
          dot={false}
          activeDot={{ r: 5, fill: "var(--accent)", stroke: "var(--bg-base)", strokeWidth: 2 }}
        />

        {/* What-If area */}
        {showWhatIf && (
          <Area
            type="monotone"
            dataKey="whatIfBalance"
            name="whatIfBalance"
            stroke="#0ea5e9"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#gradWhatIf)"
            dot={false}
            activeDot={{ r: 4, fill: "#0ea5e9", stroke: "var(--bg-base)", strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
