"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateSavingsGoal, useUpdateSavingsGoal, useCreateTransaction } from "@/lib/supabase/hooks";
import { SavingsGoal } from "@/lib/types";

const COLORS = ["#6366f1","#f97316","#10b981","#ea6c0a","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#ec4899","#22c55e"];
const ICONS  = ["🎯","🛡️","✈️","💻","🏡","🚗","📚","💊","🎮","🎸"];

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: SavingsGoal | null;
}

export function GoalDialog({ open, onClose, initialData }: Props) {
  const createGoal = useCreateSavingsGoal();
  const updateGoal = useUpdateSavingsGoal();
  const createTx   = useCreateTransaction();

  const [name,          setName]    = useState("");
  const [target,        setTarget]  = useState("");
  const [current,       setCurrent] = useState("0");
  const [deadline,      setDeadline]= useState("");
  const [notes,         setNotes]   = useState("");
  const [color,         setColor]   = useState(COLORS[0]);
  const [icon,          setIcon]    = useState(ICONS[0]);
  const [loading,       setLoading] = useState(false);
  // "manual" = only update goal metadata, "from_balance" = also create expense/income transaction
  const [balanceMode,   setBalanceMode] = useState<"manual" | "from_balance">("manual");

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTarget(String(initialData.target_amount));
      setCurrent(String(initialData.current_amount));
      setDeadline(initialData.deadline ?? "");
      setNotes(initialData.notes ?? "");
      setColor(initialData.color);
      setIcon(initialData.icon ?? ICONS[0]); // FIX: restore saved icon
    } else {
      setName(""); setTarget(""); setCurrent("");
      setDeadline(""); setNotes(""); setColor(COLORS[0]); setIcon(ICONS[0]);
    }
    setBalanceMode("manual");
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentNum = parseFloat(current) || 0;
    const targetNum  = parseFloat(target)  || 0;
    // Prevent saving more than target
    if (targetNum > 0 && currentNum > targetNum) return;
    setLoading(true);
    const payload = {
      name,
      target_amount: targetNum,
      current_amount: currentNum,
      deadline: deadline || null,
      notes: notes || null,
      color,
      icon,
    };
    try {
      if (isEdit && initialData) {
        await updateGoal.mutateAsync({ id: initialData.id, ...payload });
        // If user wants to sync with balance, create a transaction for the difference
        if (balanceMode === "from_balance") {
          const diff = currentNum - initialData.current_amount;
          if (diff !== 0) {
            await createTx.mutateAsync({
              type: diff > 0 ? "expense" : "income",
              amount: Math.abs(diff),
              description: diff > 0
                ? `Versamento ${icon || "🎯"} ${name} #risparmio`
                : `Prelievo da ${icon || "🎯"} ${name} #risparmio`,
              date: new Date().toISOString().split("T")[0],
              category_id: null, is_recurring: false, interval: null,
              status: "confirmed", recurring_end: null,
            });
          }
        }
      } else {
        await createGoal.mutateAsync(payload);
        // For new goals: if balanceMode from_balance, deduct current from balance
        if (balanceMode === "from_balance" && currentNum > 0) {
          await createTx.mutateAsync({
            type: "expense",
            amount: currentNum,
            description: `Risparmio iniziale ${icon || "🎯"} ${name} #risparmio`,
            date: new Date().toISOString().split("T")[0],
            category_id: null, is_recurring: false, interval: null,
            status: "confirmed", recurring_end: null,
          });
        }
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 12px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass" style={{ width: 460, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px 16px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            {isEdit ? "Modifica Obiettivo" : "Nuovo Obiettivo"}
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "20px 28px 28px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Icon picker */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Icona</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ICONS.map((ic) => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  style={{ fontSize: 20, width: 40, height: 40, borderRadius: 10, border: `2px solid ${icon === ic ? color : "var(--border-subtle)"}`, background: icon === ic ? `${color}22` : "var(--bg-subtle)", cursor: "pointer", transition: "all 0.15s" }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Colore</div>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${color === c ? "white" : "transparent"}`, background: c, cursor: "pointer", transition: "border 0.15s" }}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <label>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Nome obiettivo</div>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="es. Fondo Emergenza"
              style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14, outline: "none" }}
            />
          </label>

          {/* Target + Current */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Target (€)</div>
              <input type="number" step="0.01" min="1" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="10000"
                style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14, fontFamily: "JetBrains Mono, monospace", outline: "none" }}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Attuale (€)</div>
              <input
                type="number" step="0.01" min="0"
                value={current}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  // Strip leading zeros (e.g. "0500" → "500"), keep empty
                  setCurrent(raw === '' ? '' : String(parseFloat(raw) || 0));
                }}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg-subtle)",
                  border: `1px solid ${(() => { const c = parseFloat(current)||0; const t = parseFloat(target)||0; return t > 0 && c > t ? "var(--expense-color)" : "var(--border-subtle)"; })()}`,
                  borderRadius: 8, color: "var(--text-primary)", fontSize: 14, fontFamily: "JetBrains Mono, monospace", outline: "none"
                }}
              />
            </label>
          </div>

          {/* Over-target warning */}
          {(() => { const c = parseFloat(current)||0; const t = parseFloat(target)||0; return t > 0 && c > t; })() && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.22)", fontSize: 12, color: "var(--expense-color)" }}>
              ⚠️ L&apos;importo attuale supera il target. Riduci l&apos;importo attuale o aumenta il target.
            </div>
          )}

          {/* Balance mode — only when current > 0 */}
          {(parseFloat(current) || 0) > 0 && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
                Come aggiorni il saldo dell&apos;obiettivo?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([
                  {
                    value: "manual" as const,
                    label: "Solo registra (non tocca il saldo)",
                    desc: "L'importo è già tracciato — aggiorna solo la percentuale dell'obiettivo.",
                  },
                  {
                    value: "from_balance" as const,
                    label: isEdit ? "Sincronizza con il saldo" : "Preleva dal saldo",
                    desc: isEdit
                      ? "Crea una transazione per la differenza rispetto al valore precedente."
                      : "Crea una uscita nel registro per riflettere il denaro già accantonato.",
                  },
                ] as const).map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                      border: `1px solid ${balanceMode === opt.value ? "var(--accent-border)" : "var(--border-subtle)"}`,
                      background: balanceMode === opt.value ? "var(--accent-dim)" : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name="balanceMode"
                      value={opt.value}
                      checked={balanceMode === opt.value}
                      onChange={() => setBalanceMode(opt.value)}
                      style={{ marginTop: 2, accentColor: "var(--accent)", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Deadline + Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Scadenza (opz.)</div>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, colorScheme: "dark", outline: "none" }}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Note (opz.)</div>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="breve nota..."
                style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none" }}
              />
            </label>
          </div>

          <button type="submit"
            disabled={loading || (() => { const c = parseFloat(current)||0; const t = parseFloat(target)||0; return t > 0 && c > t; })()}
            style={{ marginTop: 4, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${color}, ${color}bb)`, color: "white", fontSize: 15, fontWeight: 600, opacity: loading || (() => { const c = parseFloat(current)||0; const t = parseFloat(target)||0; return t > 0 && c > t; })() ? 0.45 : 1 }}
          >
            {loading ? "Salvataggio..." : isEdit ? "Salva Modifiche" : "Crea Obiettivo"}
          </button>
        </form>
        </div>{/* end scrollable body */}
      </div>
    </div>
  );
}
