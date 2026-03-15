import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateTransaction } from "@/lib/supabase/hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  currentValue: number;
  label: string;
  type: "balance" | "income";
}

export function AdjustBalanceDialog({ open, onClose, currentValue, label, type }: Props) {
  const [newValue, setNewValue] = useState("");
  const addTx = useCreateTransaction();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNewValue(currentValue.toString());
    }
  }, [open, currentValue]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newValue);
    if (isNaN(target)) return;
    
    const diff = target - currentValue;
    if (diff === 0) {
      onClose();
      return;
    }

    setLoading(true);

    try {
      const txType = type === "income" 
        ? "income" 
        : (diff > 0 ? "income" : "expense");
        
      await addTx.mutateAsync({
        date: new Date().toISOString(),
        description: `Aggiustamento manuale (${label})`,
        amount: Math.abs(diff),
        type: txType,
        category_id: null,
        status: 'confirmed',
        is_recurring: false,
        interval: "monthly",
        recurring_end: null,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "var(--overlay)", backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
      <div 
        className="glass"
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 999, width: "90%", maxWidth: 360, padding: 24, borderRadius: 16,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Modifica {label}</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
          Inserisci il nuovo valore attuale. Verrà creata una transazione di aggiustamento per calcolare la differenza in automatico.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Nuovo Importo (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={newValue}
              onChange={(e) => {
                let val = e.target.value;
                if (/^0[0-9]/.test(val)) {
                  val = val.replace(/^0+/, "");
                }
                setNewValue(val);
              }}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)", fontSize: 16, fontFamily: "JetBrains Mono, monospace",
                fontWeight: 600, outline: "none",
              }}
              autoFocus
            />
            {newValue && parseFloat(newValue) !== currentValue && (
              <div style={{ fontSize: 12, marginTop: 8, color: parseFloat(newValue) > currentValue ? "var(--income-color)" : "var(--expense-color)" }}>
                Differenza: {parseFloat(newValue) > currentValue ? "+" : ""}{(parseFloat(newValue) - currentValue).toFixed(2)} €
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 16px", background: "transparent", border: "none", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 16px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Salvataggio..." : "Conferma"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
