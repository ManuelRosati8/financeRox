"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateSavingsGoal, useUpdateSavingsGoal } from "@/lib/supabase/hooks";
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

  const [name,          setName]    = useState("");
  const [target,        setTarget]  = useState("");
  const [current,       setCurrent] = useState("0");
  const [deadline,      setDeadline]= useState("");
  const [notes,         setNotes]   = useState("");
  const [color,         setColor]   = useState(COLORS[0]);
  const [icon,          setIcon]    = useState(ICONS[0]);
  const [loading,       setLoading] = useState(false);

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTarget(String(initialData.target_amount));
      setCurrent(String(initialData.current_amount));
      setDeadline(initialData.deadline ?? "");
      setNotes(initialData.notes ?? "");
      setColor(initialData.color);
    } else {
      setName(""); setTarget(""); setCurrent("0");
      setDeadline(""); setNotes(""); setColor(COLORS[0]); setIcon(ICONS[0]);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      target_amount: parseFloat(target),
      current_amount: parseFloat(current) || 0,
      deadline: deadline || null,
      notes: notes || null,
      color,
      icon,
    };
    try {
      if (isEdit && initialData) {
        await updateGoal.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createGoal.mutateAsync(payload);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass" style={{ width: 460, maxWidth: "95vw", padding: 28, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            {isEdit ? "Modifica Obiettivo" : "Nuovo Obiettivo"}
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

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
              <input type="number" step="0.01" min="0" value={current} onChange={(e) => setCurrent(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14, fontFamily: "JetBrains Mono, monospace", outline: "none" }}
              />
            </label>
          </div>

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

          <button type="submit" disabled={loading}
            style={{ marginTop: 4, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${color}, ${color}bb)`, color: "white", fontSize: 15, fontWeight: 600, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Salvataggio..." : isEdit ? "Salva Modifiche" : "Crea Obiettivo"}
          </button>
        </form>
      </div>
    </div>
  );
}
