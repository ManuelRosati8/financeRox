"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { name: string; value: number; color: string }[];
}

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: { color } } = payload[0];
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{name}</span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color, fontWeight: 600 }}>
        {formatCurrency(value)}
      </div>
    </div>
  );
};

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const RADIAN = Math.PI / 180;

// Inline label showing percentage for slices > 8%
function renderLabel(props: any) {
  const { cx, cy, midAngle = 0, innerRadius, outerRadius, percent } = props;
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700} style={{ pointerEvents: "none" }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function SpendingDonut({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length) return (
    <div style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
      Nessuna spesa
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--text-primary)" }}>
            {formatCurrency(total)}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>totale</div>
        </div>
      </div>

      {/* Legend rows with progress bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0;
          return (
            <div key={d.name}>
              {/* Name + amount row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{d.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                    {pct.toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)", fontWeight: 600, minWidth: 72, textAlign: "right" }}>
                    {formatCurrency(d.value)}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 4, borderRadius: 99, background: "var(--bg-subtle)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 99,
                  background: d.color,
                  transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
