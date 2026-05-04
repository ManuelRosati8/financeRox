"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, ExternalLink, BarChart3, ReceiptText, Target, PieChart
} from "lucide-react";
import { useTransactions, useSavingsGoals, useProfile } from "@/lib/supabase/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SpendingDonut } from "@/components/charts/SpendingDonut";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { MoneyValue } from "@/components/ui/MoneyValue";
import { AdjustBalanceDialog } from "@/components/dashboard/AdjustBalanceDialog";
import { ScenarioBetaWidget } from "@/components/dashboard/ScenarioBetaWidget";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

function KpiCard({
  label, value, subtitle, icon: Icon, color, trend, delay = 0, href, hint, onValueClick, isPercent
}: {
  label: string; value: number; subtitle: string;
  icon: React.ElementType; color: string; trend?: "up" | "down" | "neutral";
  delay?: number; href?: string; hint?: string; onValueClick?: () => void; isPercent?: boolean;
}) {
  const { t } = useI18n();
  const isPercentDisplay = !!isPercent;
  const content = (
    <div
      className="fade-up"
      style={{
        height: "100%",
        minHeight: 184,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        animationDelay: `${delay}s`,
        cursor: href ? "pointer" : "default",
        textDecoration: "none",
        color: "inherit",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 16,
        boxShadow: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {label}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
            {subtitle}
          </span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={color} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
          {t("dashboard.currentValue")}
        </span>
        {isPercentDisplay ? (
          <div className="money" style={{ fontSize: 26, fontWeight: 700, color: trend === "up" ? "var(--income-color)" : "var(--text-primary)" }}>
            {value}%
          </div>
        ) : (
          <div 
            onClick={(e) => { 
              if (onValueClick) { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onValueClick(); 
              }
            }}
            style={{ 
              display: "inline-block", 
              cursor: onValueClick ? "pointer" : "default",
              transition: "transform 0.1s",
            }}
            onMouseOver={e => onValueClick && (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={e => onValueClick && (e.currentTarget.style.transform = "scale(1)")}
            title={onValueClick ? t("dashboard.clickToEdit") : ""}
          >
            <MoneyValue amount={value} size="2xl"
              color={trend === "down" ? "var(--expense-color)" : trend === "up" ? "var(--income-color)" : "var(--text-primary)"}
            />
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: hint ? "1fr 1fr" : "1fr", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {t("dashboard.period")}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
            {subtitle}
          </span>
        </div>

        {hint && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {t("dashboard.action")}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color, fontWeight: 600 }}>
              <ExternalLink size={12} />
              {hint}
            </span>
          </div>
        )}
      </div>
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>{content}</Link> : content;
}

function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div style={{ padding: 36, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 320, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon size={24} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.65 }}>{description}</div>
        {href && cta && (
          <Link
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 18,
              padding: "9px 16px",
              borderRadius: 10,
              background: "var(--accent)",
              color: "white",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: goals = [] } = useSavingsGoals();
  const { data: profile } = useProfile();
  const { t, numberLocale } = useI18n();

  const [adjustState, setAdjustState] = useState<{ open: boolean; type: "balance" | "income"; currentValue: number; label: string }>({
    open: false, type: "balance", currentValue: 0, label: ""
  });

  // Tax rate from settings (localStorage)
  const [taxRate] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = window.localStorage.getItem("financerox_tax_rate");
    return stored ? parseFloat(stored) || 0 : 0;
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear  = now.getFullYear();

  const stats = useMemo(() => {
    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const income   = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    // ── Balance calculations ──
    // Only confirmed transactions affect the current balance
    const balance = transactions
      .filter(t => t.status === 'confirmed')
      .reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);

    // Safe to spend: current balance minus upcoming planned expenses for this month
    const today = new Date();
    const eom = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Get unique recurring expenses
    const recurringMap = new Map<string, typeof transactions[0]>();
    transactions.filter(t => t.is_recurring && t.type === "expense").forEach(t => {
      if (!recurringMap.has(t.description)) recurringMap.set(t.description, t);
    });

    let upcomingExpenses = 0;
    Array.from(recurringMap.values()).forEach(t => {
      const txDate = new Date(t.date);
      // If it's a monthly expense, does it fall between tomorrow and EOM?
      if (t.interval === "monthly") {
        const txDay = txDate.getDate();
        if (txDay > today.getDate() && txDay <= eom.getDate()) {
          upcomingExpenses += t.amount;
        }
      }
    });

    const safeToSpend = balance - upcomingExpenses;

    // Tax accrual: subtract the estimated tax portion of this month's income
    const taxAccrual = taxRate > 0 ? income * (taxRate / 100) : 0;
    const safeToSpendNetTax = safeToSpend - taxAccrual;

    return { income, expenses, balance, savingsRate, safeToSpend: safeToSpendNetTax, upcomingExpenses, taxAccrual };
  }, [transactions, currentMonth, currentYear, taxRate]);

  const recent = useMemo(() => transactions.slice(0, 6), [transactions]);

  const categorySpending = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string }> = {};
    transactions
      .filter((t) => t.type === "expense" && t.category)
      .forEach((t) => {
        const cat = t.category!;
        if (!map[cat.id]) map[cat.id] = { name: cat.name, value: 0, color: cat.color };
        map[cat.id].value += t.amount;
      });
    return Object.values(map).sort((a, b) => b.value - a.value).slice(0, 7);
  }, [transactions]);

  const recurringSummary = useMemo(() => {
    const recurringIncomeCount = transactions.filter((transaction) => transaction.is_recurring && transaction.type === "income").length;
    const recurringExpenseCount = transactions.filter((transaction) => transaction.is_recurring && transaction.type === "expense").length;
    return { recurringIncomeCount, recurringExpenseCount };
  }, [transactions]);

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <div style={{ color: "var(--text-muted)" }}>{t("common.loading")}</div>
    </div>
  );

  const hour = new Date().getHours();
  const greetingKey: TranslationKey =
    hour >= 6 && hour < 12 ? "dashboard.greetingMorning" :
    hour >= 12 && hour < 17 ? "dashboard.greetingAfternoon" :
    hour >= 17 && hour < 22 ? "dashboard.greetingEvening" :
    "dashboard.greetingNight";
  const greeting = t(greetingKey);
  const guestLabel = t("dashboard.guest");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="fade-up dashboard-page-header">
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
          {greeting}, {profile?.full_name ? (profile.full_name.split(" ")[0].charAt(0).toUpperCase() + profile.full_name.split(" ")[0].slice(1).toLowerCase()) : guestLabel} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 13 }}>
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* ── Action guide banner ── */}
      <div className="fade-up dashboard-guide-banner" style={{
        display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        padding: "16px 20px", borderRadius: 12,
        background: "var(--accent-dim)",
        border: "1px solid rgba(124,111,247,0.2)",
        animationDelay: "0.05s",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7, flex: 1 }}>
          <strong style={{ color: "var(--text-primary)" }}>Ti ritrovi con la calcolatrice?</strong>
          {" "}financeRox ti aiuta gia a leggere saldo attuale, entrate del mese, obiettivi e ricorrenze fisse senza rifare i conti a mano.
          <br />
          <strong style={{ color: "var(--text-primary)" }}>{t("dashboard.whereEdit")}</strong>
          {" — "}
          {t("dashboard.whereEditIncome")}{" "}
          <Link href="/transactions" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>{t("dashboard.whereEditSep1")}</Link>
          {" · "}
          {t("dashboard.whereEditGoals")}{" "}
          <Link href="/goals" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>{t("dashboard.whereEditSep2")}</Link>
          {" · "}
          {t("dashboard.whereEditOr")}{" "}
          <strong style={{ color: "var(--accent)" }}>{t("dashboard.whereEditFab")}</strong>.
        </div>
        <Link href="/transactions"
          style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: "var(--accent)", color: "white", textDecoration: "none",
            flexShrink: 0, whiteSpace: "nowrap",
          }}
        >
          {t("common.newTransaction")}
        </Link>
      </div>

      {/* ── Safe to Spend Banner ── */}
      <div className="fade-up dashboard-safe-banner" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
        padding: "18px 22px", borderRadius: 12,
        background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
        border: "1px solid rgba(16,185,129,0.2)",
        animationDelay: "0.1s",
        width: "100%"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--income-color)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,0.2)" }}>
            <PiggyBank size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t("dashboard.safeToSpend")}
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              {new Intl.NumberFormat(numberLocale,{style:"currency",currency:"EUR"}).format(stats.upcomingExpenses)}{" "}{t("dashboard.safeToSpendSuffix")}
              {stats.taxAccrual > 0 && (
                <> — e <strong style={{ color: "var(--accent)" }}>
                  {new Intl.NumberFormat(numberLocale,{style:"currency",currency:"EUR"}).format(stats.taxAccrual)}
                </strong>{" "}{t("dashboard.taxSetAside")} ({taxRate}%)
                </>
              )}
            </p>
          </div>
        </div>
        <div className="dashboard-safe-banner-value" style={{ textAlign: "right" }}>
          <MoneyValue amount={stats.safeToSpend} size="2xl" color="var(--income-color)" />
        </div>
      </div>

      {/* KPI grid — 4-col desktop, 2-col tablet/mobile */}
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiCard
          label={t("dashboard.totalBalance")}
          value={stats.balance}
          subtitle={t("dashboard.currentAvailability")}
          icon={Wallet}
          color="var(--accent)"
          delay={0.15}
          href="/transactions"
          hint={t("dashboard.goToTransactions")}
          onValueClick={() => setAdjustState({ open: true, type: "balance", currentValue: stats.balance, label: t("dashboard.totalBalance") })}
        />
        <KpiCard
          label={t("dashboard.monthlyIncome")}
          value={stats.income}
          trend="up"
          subtitle={t("dashboard.currentMonth")}
          icon={TrendingUp}
          color="var(--income-color)"
          delay={0.2}
          href="/transactions"
          hint={t("dashboard.addEditIncome")}
          onValueClick={() => setAdjustState({ open: true, type: "income", currentValue: stats.income, label: t("dashboard.monthlyIncome") })}
        />
        <KpiCard
          label={t("dashboard.monthlyExpenses")} value={stats.expenses} subtitle={t("dashboard.thisMonth")}
          icon={TrendingDown} color="#f43f5e" trend="down" delay={0.12}
          href="/transactions" hint={t("dashboard.addEditExpenses")}
        />
        <KpiCard
          label={t("dashboard.savingsRate")} value={stats.savingsRate} subtitle={t("dashboard.ofMonthlyIncome")}
          icon={PiggyBank} color="#f59e0b" trend="up" delay={0.18}
          href="/goals" hint={t("dashboard.manageGoals")} isPercent
        />
      </div>

      {/* Main grid — 2-col desktop, 1-col mobile */}
      <div className="dashboard-main-grid" style={{ display: "grid", gap: 18 }}>

        {/* Left column: bar chart + recent transactions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Monthly bar chart */}
          <div className="glass fade-up dashboard-panel" style={{ padding: 22, animationDelay: "0.1s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t("dashboard.incomeVsExpenses")}</h2>
                <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981" }} /> {t("dashboard.incomeLabel")}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "#f43f5e" }} /> {t("dashboard.expenseLabel")}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("dashboard.last6Months")}</span>
            </div>
            {transactions.length === 0 ? (
              <DashboardEmptyState
                icon={BarChart3}
                title={t("dashboard.emptyChartTitle")}
                description={t("dashboard.emptyChartDescription")}
                href="/transactions"
                cta={t("common.newTransaction")}
              />
            ) : (
              <MonthlyBarChart transactions={transactions} />
            )}
          </div>

          {/* Recent transactions */}
          <div className="glass fade-up dashboard-panel" style={{ padding: 22, animationDelay: "0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t("dashboard.recentTransactions")}</h2>
              <Link href="/transactions" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
                {t("dashboard.viewAll")}
              </Link>
            </div>
            {recent.length === 0 ? (
              <DashboardEmptyState
                icon={ReceiptText}
                title={t("dashboard.emptyRecentTitle")}
                description={t("dashboard.emptyRecentDescription")}
                href="/transactions"
                cta={t("common.newTransaction")}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recent.map((tx, i) => (
                  <div
                    key={tx.id}
                    className="fade-up"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 12px", borderRadius: 10,
                      background: i % 2 === 0 ? "var(--bg-subtle)" : "transparent",
                      animationDelay: `${0.2 + i * 0.04}s`,
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: `${tx.category?.color ?? "#64748b"}22`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                      }}>
                        {tx.type === "income" ? "↑" : "↓"}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{tx.description}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span>{formatDate(tx.date)}</span>
                          {tx.category && <span style={{ color: tx.category.color }}>• {tx.category.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {tx.type === "income"
                        ? <ArrowUpRight size={13} color="var(--income-color)" />
                        : <ArrowDownRight size={13} color="var(--expense-color)" />
                      }
                      <MoneyValue
                        amount={tx.amount}
                        color={tx.type === "income" ? "var(--income-color)" : "var(--expense-color)"}
                        prefix={tx.type === "income" ? "+" : "-"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: donut + goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="glass fade-up dashboard-panel" style={{ padding: 22, animationDelay: "0.1s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t("dashboard.spendingByCategory")}</h2>
              <Link href="/transactions" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                {t("dashboard.details")}
              </Link>
            </div>
            {categorySpending.length > 0 && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
                {t("dashboard.totalLabel")} <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR" }).format(
                    categorySpending.reduce((s, c) => s + c.value, 0)
                  )}
                </span> — {t("dashboard.topCategories", { n: categorySpending.length })}
              </div>
            )}
            {categorySpending.length === 0 ? (
              <DashboardEmptyState
                icon={PieChart}
                title={t("dashboard.emptySpendingTitle")}
                description={t("dashboard.emptySpendingDescription")}
                href="/transactions"
                cta={t("common.newTransaction")}
              />
            ) : (
              <SpendingDonut data={categorySpending} />
            )}
          </div>

          <ScenarioBetaWidget
            currentBalance={stats.balance}
            monthlyIncome={stats.income}
            activeGoals={goals.length}
            recurringIncomeCount={recurringSummary.recurringIncomeCount}
            recurringExpenseCount={recurringSummary.recurringExpenseCount}
          />

          <div className="glass fade-up dashboard-panel" style={{ padding: 22, animationDelay: "0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t("dashboard.goalsTitle")}</h2>
              <Link href="/goals" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
                {t("dashboard.editGoals")}
              </Link>
            </div>
            {goals.length === 0 ? (
              <DashboardEmptyState
                icon={Target}
                title={t("dashboard.emptyGoalsTitle")}
                description={t("dashboard.emptyGoalsDescription")}
                href="/goals"
                cta={t("goals.addNew")}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {goals.slice(0, 3).map((g) => {
                  const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                  return (
                    <div key={g.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                        <span style={{ fontWeight: 500 }}>{g.name}</span>
                        <span style={{ color: g.color, fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: "var(--bg-subtle)" }}>
                        <div style={{
                          height: "100%", width: `${pct}%`, borderRadius: 99,
                          background: `linear-gradient(90deg, ${g.color}, ${g.color}bb)`,
                          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11, color: "var(--text-muted)" }}>
                        <span className="money">{formatCurrency(g.current_amount)}</span>
                        <span className="money">{formatCurrency(g.target_amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Balance Adjustment Dialog */}
      <AdjustBalanceDialog
        open={adjustState.open}
        onClose={() => setAdjustState(prev => ({ ...prev, open: false }))}
        currentValue={adjustState.currentValue}
        label={adjustState.label}
        type={adjustState.type}
      />
    </div>
  );
}
