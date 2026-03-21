"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw, Tag, Briefcase, TrendingUp, ShoppingBag, Lightbulb } from "lucide-react";
import { useCategories, useCreateTransaction, useUpdateTransaction } from "@/lib/supabase/hooks";
import { Transaction, TransactionType, RecurringInterval } from "@/lib/types";

// ── Income type quick-fill presets ───────────────────────────────────────────
const INCOME_PRESETS = [
  { label: "Stipendio",  icon: Briefcase,  tag: "#stipendio"  },
  { label: "Dividendi",  icon: TrendingUp, tag: "#dividendi"  },
  { label: "Vendite",    icon: ShoppingBag,tag: "#vendite"    },
  { label: "Altro",      icon: Lightbulb,  tag: "#entrata"    },
] as const;

// ── Tag helpers ─────────────────────────────────────────────────────────────
/** Extract #hashtag tokens from a description string */
function extractTags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u017F]+/g);
  return matches ? matches.map((t) => t.toLowerCase()) : [];
}
/** Strip #hashtag tokens from a description string */
function stripTags(text: string): string {
  return text.replace(/#[\w\u00C0-\u017F]+/g, "").replace(/\s{2,}/g, " ").trim();
}
/** Append tags array to a description string */
function appendTags(text: string, tags: string[]): string {
  const base = stripTags(text);
  return tags.length ? `${base} ${tags.join(" ")}` : base;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
  initialDate?: string;
}

const INTERVALS: { value: RecurringInterval; label: string }[] = [
  { value: "daily",   label: "Giornaliera" },
  { value: "weekly",  label: "Settimanale"  },
  { value: "monthly", label: "Mensile"      },
  { value: "yearly",  label: "Annuale"      },
];

export function TransactionDialog({ open, onClose, initialData, initialDate }: Props) {
  const { data: incomeCategories  = [] } = useCategories("income");
  const { data: expenseCategories = [] } = useCategories("expense");
  const createTx = useCreateTransaction();
  const updateTx = useUpdateTransaction();

  const [type,        setType]        = useState<TransactionType>("expense");
  const [amount,      setAmount]      = useState("");
  const [description, setDescription] = useState("");
  const [tags,        setTags]        = useState<string[]>([]);
  const [tagInput,    setTagInput]    = useState("");
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);
  const [categoryId,  setCategoryId]  = useState("");
  const [isRecurring, setRecurring]   = useState(false);
  const [interval,    setInterval]    = useState<RecurringInterval>("monthly");
  const [status,      setStatus]      = useState<'confirmed' | 'planned'>("confirmed");
  const [loading,     setLoading]     = useState(false);

  const isEdit = !!initialData;
  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(String(initialData.amount));
      setDescription(stripTags(initialData.description));
      setTags(extractTags(initialData.description));
      setTagInput("");
      setDate(initialData.date);
      setCategoryId(initialData.category_id ?? "");
      setRecurring(initialData.is_recurring);
      setInterval(initialData.interval ?? "monthly");
    } else {
      setType("expense"); setAmount(""); setDescription("");
      setTags([]); setTagInput("");
      setDate(initialDate || new Date().toISOString().split("T")[0]);
      setCategoryId(""); setRecurring(false); setInterval("monthly");
      setStatus("confirmed");
    }
  }, [initialData, initialDate, open]);

  // Auto-status based on date (only for new transactions)
  useEffect(() => {
    if (!isEdit && date) {
      const today = new Date().toISOString().split("T")[0];
      setStatus(date > today ? "planned" : "confirmed");
    }
  }, [date, isEdit]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    setLoading(true);
    const payload = {
      type,
      amount: parseFloat(amount),
      // Merge tags back into description as #hashtags
      description: appendTags(description, tags),
      date,
      category_id: categoryId || null,
      is_recurring: isRecurring,
      interval: isRecurring ? interval : null,
      status,
      recurring_end: null,
    };
    try {
      if (isEdit && initialData) {
        await updateTx.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createTx.mutateAsync(payload);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass"
        style={{ width: 480, maxWidth: "95vw", padding: 28, position: "relative", boxShadow: "var(--shadow-lg)" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            {isEdit ? "Modifica Transazione" : "Nuova Transazione"}
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Type toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t} type="button"
                onClick={() => { setType(t); setCategoryId(""); }}
                style={{
                  padding: "10px 0", borderRadius: 10, border: "1px solid",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                  borderColor: type === t ? (t === "income" ? "var(--income-color)" : "var(--expense-color)") : "var(--border-subtle)",
                  background: type === t
                    ? (t === "income" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)")
                    : "var(--bg-subtle)",
                  color: type === t
                    ? (t === "income" ? "var(--income-color)" : "var(--expense-color)")
                    : "var(--text-secondary)",
                }}
              >
                {t === "expense" ? "🔻 Uscita" : "🔼 Entrata"}
              </button>
            ))}
          </div>

          {/* Income type quick-fill (only for income) */}
          {type === "income" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                Tipo di entrata
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {INCOME_PRESETS.map(({ label, icon: Icon, tag }) => {
                  const isActive = tags.includes(tag);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        // Toggle tag and pre-fill description if empty
                        setTags(prev => isActive ? prev.filter(t => t !== tag) : [...prev.filter(t => !(INCOME_PRESETS.map(p => p.tag) as string[]).includes(t)), tag]);
                        if (!description) setDescription(label);
                      }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                        padding: "10px 6px", borderRadius: 10, border: "1px solid", cursor: "pointer",
                        fontSize: 11, fontWeight: 600, transition: "all 0.15s",
                        borderColor: isActive ? "var(--income-color)" : "var(--border-subtle)",
                        background: isActive ? "rgba(34,197,94,0.12)" : "var(--bg-subtle)",
                        color: isActive ? "var(--income-color)" : "var(--text-secondary)",
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amount */}
          <label>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Importo (€)</div>
            <input
              type="number" step="0.01" min="0" required
              value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                borderRadius: 8, color: "var(--text-primary)", fontSize: 18,
                fontFamily: "JetBrains Mono, monospace", outline: "none",
              }}
            />
          </label>

          {/* Description */}
          <label>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Descrizione</div>
            <input
              type="text" required
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="es. Supermercato Esselunga"
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                borderRadius: 8, color: "var(--text-primary)", fontSize: 14, outline: "none",
              }}
            />
          </label>

          {/* Smart Tags */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
              <Tag size={12} />
              Smart Tags
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>(es. #vacanze2024)</span>
            </div>
            <div
              style={{
                display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
                padding: "8px 12px", background: "var(--bg-subtle)",
                border: "1px solid var(--border-subtle)", borderRadius: 8, minHeight: 42,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                    background: "rgba(139,92,246,0.15)", color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.25)",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", lineHeight: 1, padding: 0, fontSize: 14 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === " " || e.key === "Enter") && tagInput.trim()) {
                    e.preventDefault();
                    const raw = tagInput.trim().replace(/^#*/, "");
                    if (raw) {
                      setTags((prev) =>
                        prev.includes(`#${raw}`) ? prev : [...prev, `#${raw}`]
                      );
                    }
                    setTagInput("");
                  } else if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags((prev) => prev.slice(0, -1));
                  }
                }}
                placeholder={tags.length ? "" : "Premi Spazio per aggiungere"}
                style={{
                  flex: 1, minWidth: 120, background: "none", border: "none",
                  outline: "none", fontSize: 12, color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Date + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Data</div>
              <input
                type="date" required
                value={date} onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                  borderRadius: 8, color: "var(--text-primary)", fontSize: 13,
                  colorScheme: "dark", outline: "none",
                }}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Categoria</div>
              <select
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                  borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none", cursor: "pointer",
                }}
              >
                <option value="">Nessuna</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Status Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["confirmed", "planned"] as const).map((s) => (
              <button
                key={s} type="button"
                onClick={() => setStatus(s)}
                style={{
                  padding: "10px 0", borderRadius: 10, border: "1px solid",
                  cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                  borderColor: status === s ? "var(--accent)" : "var(--border-subtle)",
                  background: status === s ? "rgba(245,158,11,0.15)" : "var(--bg-subtle)",
                  color: status === s ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {s === "confirmed" ? "✅ Confermato" : "⏳ Pianificato"}
              </button>
            ))}
          </div>

          {/* Recurring toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RefreshCw size={15} color={isRecurring ? "var(--accent-purple)" : "var(--text-muted)"} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Transazione ricorrente</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Si ripete automaticamente</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRecurring(!isRecurring)}
              style={{
                width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer",
                background: isRecurring ? "var(--accent-purple)" : "var(--bg-elevated)",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: isRecurring ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "white", transition: "left 0.2s",
              }} />
            </button>
          </div>

          {isRecurring && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Frequenza</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {INTERVALS.map(({ value, label }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setInterval(value)}
                    style={{
                      padding: "8px 0", borderRadius: 8, border: "1px solid",
                      cursor: "pointer", fontSize: 12,
                      borderColor: interval === value ? "var(--accent-purple)" : "var(--border-subtle)",
                      background: interval === value ? "rgba(124,111,247,0.15)" : "var(--bg-subtle)",
                      color: interval === value ? "var(--accent-purple)" : "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white", fontSize: 15, fontWeight: 600,
              opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
            }}
          >
            {loading ? "Salvataggio..." : isEdit ? "Salva Modifiche" : "Aggiungi Transazione"}
          </button>
        </form>
      </div>
    </div>
  );
}
