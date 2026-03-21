"use client";

import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Target, CalendarClock } from "lucide-react";
import { useSavingsGoals, useDeleteSavingsGoal } from "@/lib/supabase/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MoneyValue } from "@/components/ui/MoneyValue";
import { GoalDialog } from "@/components/goals/GoalDialog";
import { SavingsGoal } from "@/lib/types";
import { differenceInDays, parseISO } from "date-fns";
import { useI18n } from "@/lib/i18n/context";

function GoalCard({
  goal, onEdit, onDelete,
}: {
  goal: SavingsGoal;
  onEdit: (g: SavingsGoal) => void;
  onDelete: (id: string) => void;
}) {
  const { t, numberLocale } = useI18n();
  const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const daysLeft  = goal.deadline
    ? differenceInDays(parseISO(goal.deadline), new Date())
    : null;

  // Smart advice: monthly savings needed to hit the goal by the deadline
  const monthlyNeeded = (daysLeft !== null && daysLeft > 0 && remaining > 0)
    ? remaining / (daysLeft / 30.44)
    : null;

  return (
    <div
      className="glass fade-up"
      onClick={() => onEdit(goal)}
      style={{ 
        padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16,
        height: "100%", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s",
        border: `1px solid ${goal.color}22`,
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = `${goal.color}55`; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${goal.color}22`; }}
    >
      {/* Icon + Name + Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${goal.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>
            {goal.icon || "🎯"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{goal.name}</div>
            {goal.notes && (
              <div style={{ 
                fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.4,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {goal.notes}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
            style={{ 
              background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", cursor: "pointer", 
              color: "var(--expense-color)", padding: 6, borderRadius: 8, transition: "all 0.2s", zIndex: 2
            }}
            title={t("common.delete")}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(244,63,94,0.2)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(244,63,94,0.1)"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <MoneyValue amount={goal.current_amount} size="xl" color={goal.color} />
          <span style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "flex-end" }}>
            di {formatCurrency(goal.target_amount)}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: "var(--bg-subtle)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${goal.color}, ${goal.color}aa)`,
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>{t("goals.achieved", { pct })}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {t("goals.missing", { amount: formatCurrency(remaining) })}
          </span>
        </div>
      </div>

      {/* Smart advice: monthly savings needed */}
      {monthlyNeeded !== null && remaining > 0 && (
        <div style={{
          padding: "10px 14px", borderRadius: 8,
          background: monthlyNeeded > 1000 ? "rgba(244,63,94,0.06)" : "rgba(249,115,22,0.06)",
          border: `1px solid ${monthlyNeeded > 1000 ? "rgba(244,63,94,0.2)" : "rgba(249,115,22,0.18)"}`,
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>
            {t("goals.smartAdvice")}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: monthlyNeeded > 1000 ? "var(--expense-color)" : "var(--accent)" }}>
            {new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(monthlyNeeded)}{" "}
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}>{t("goals.perMonth")}</span>
          </div>
        </div>
      )}

      {/* Deadline */}
      {daysLeft !== null && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
          borderRadius: 8, background: daysLeft < 30 ? "rgba(244,63,94,0.1)" : "var(--bg-subtle)",
          border: `1px solid ${daysLeft < 30 ? "rgba(244,63,94,0.2)" : "var(--border-subtle)"}`,
          marginTop: "auto"
        }}>
          <CalendarClock size={13} color={daysLeft < 30 ? "var(--expense-color)" : "var(--text-muted)"} />
          <span style={{ fontSize: 12, color: daysLeft < 30 ? "var(--expense-color)" : "var(--text-secondary)" }}>
            {daysLeft > 0 ? t("goals.daysLeft", { n: daysLeft }) : t("goals.expired")} · {formatDate(goal.deadline!)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const { data: goals = [], isLoading } = useSavingsGoals();
  const deleteGoal = useDeleteSavingsGoal();
  const { t } = useI18n();

  const [dialogOpen, setDialog] = useState(false);
  const [editing, setEditing]   = useState<SavingsGoal | null>(null);

  const totalTargeted  = useMemo(() => goals.reduce((s, g) => s + g.target_amount, 0), [goals]);
  const totalSaved     = useMemo(() => goals.reduce((s, g) => s + g.current_amount, 0), [goals]);
  const overallPct     = totalTargeted > 0 ? Math.round((totalSaved / totalTargeted) * 100) : 0;

  const handleDelete = async (id: string) => {
    if (!confirm(t("goals.deleteConfirm"))) return;
    await deleteGoal.mutateAsync(id);
  };

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <div style={{ color: "var(--text-muted)" }}>{t("common.loadingGoals")}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>{t("goals.title")}</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {t("goals.subtitle", { count: goals.length, pct: overallPct })}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setDialog(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white", fontSize: 14, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
          }}
        >
          <Plus size={16} />
          {t("goals.addNew")}
        </button>
      </div>

      {/* Summary banner */}
      <div className="glass" style={{
        padding: "20px 24px",
        background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(124,111,247,0.08))",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 48 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("goals.totalSaved")}</div>
            <MoneyValue amount={totalSaved} size="2xl" color="var(--income-color)" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("goals.totalTarget")}</div>
            <MoneyValue amount={totalTargeted} size="2xl" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("goals.remaining")}</div>
            <MoneyValue amount={totalTargeted - totalSaved} size="2xl" color="var(--expense-color)" />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="gradient-text money" style={{ fontSize: 40, fontWeight: 800 }}>
            {overallPct}%
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("goals.completedPct", { pct: overallPct })}</div>
        </div>
      </div>

      {/* Goals grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {goals.map((g, i) => (
          <div key={g.id} style={{ animationDelay: `${i * 0.07}s` }}>
            <GoalCard goal={g} onEdit={(g) => { setEditing(g); setDialog(true); }} onDelete={handleDelete} />
          </div>
        ))}
        {goals.length === 0 && (
          <div className="glass" style={{ gridColumn: "span 2", padding: 60, textAlign: "center" }}>
            <Target size={36} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
            <div style={{ color: "var(--text-muted)" }}>{t("goals.empty")}</div>
          </div>
        )}
      </div>

      <GoalDialog
        open={dialogOpen}
        onClose={() => { setDialog(false); setEditing(null); }}
        initialData={editing}
      />
    </div>
  );
}
