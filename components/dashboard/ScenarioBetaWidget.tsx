"use client";

import { Calculator, TrendingUp, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ScenarioBetaWidgetProps {
  currentBalance: number;
  monthlyIncome: number;
  activeGoals: number;
  recurringIncomeCount: number;
  recurringExpenseCount: number;
}

export function ScenarioBetaWidget({
  currentBalance,
  monthlyIncome,
  activeGoals,
  recurringIncomeCount,
  recurringExpenseCount,
}: ScenarioBetaWidgetProps) {
  const { locale, numberLocale, t } = useI18n();
  const currency = (value: number) =>
    new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const title = t("scenario.title");
  const badge = t("scenario.badge");
  const lead = t("scenario.lead");
  const description = t("scenario.description");
  const emptyState = t("scenario.emptyState");
  const footer = t("scenario.footer");

  const stats = [
    {
      label: locale === "en" ? "Current balance" : "Saldo attuale",
      value: currency(currentBalance),
    },
    {
      label: locale === "en" ? "Monthly income" : "Entrate del mese",
      value: currency(monthlyIncome),
    },
    {
      label: locale === "en" ? "Recurring flow" : "Ricorrenze attive",
      value: `${recurringIncomeCount} in · ${recurringExpenseCount} out`,
    },
    {
      label: locale === "en" ? "Goals tracked" : "Obiettivi tracciati",
      value: String(activeGoals),
    },
  ];

  return (
    <div className="glass fade-up dashboard-panel" style={{ padding: 22, animationDelay: "0.18s", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Calculator size={18} color="var(--accent)" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h2>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent)", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 999, padding: "2px 8px" }}>
                {badge}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 5, lineHeight: 1.7 }}>{lead}</p>
          </div>
        </div>
        <Sparkles size={16} color="var(--accent)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {stats.map((item) => (
          <div key={item.label} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 14, border: "1px dashed var(--accent-border)", background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp size={24} color="var(--accent)" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>{emptyState}</div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 540, margin: "0 auto" }}>{description}</p>
      </div>

      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{footer}</div>
    </div>
  );
}