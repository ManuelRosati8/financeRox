"use client";

import { useEffect } from "react";
import { AlertTriangle, Info, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string | null;
  intent?: "default" | "danger";
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = null,
  intent = "default",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose, open]);

  if (!open) return null;

  const isDanger = intent === "danger";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 12px",
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="glass scale-in"
        style={{
          width: 420,
          maxWidth: "100%",
          padding: 24,
          boxShadow: "var(--shadow-lg)",
          border: `1px solid ${isDanger ? "rgba(244,63,94,0.18)" : "var(--glass-border)"}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDanger ? "rgba(244,63,94,0.12)" : "var(--accent-dim)",
                color: isDanger ? "var(--expense-color)" : "var(--accent)",
              }}
            >
              {isDanger ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>

            <div>
              <h2 id="confirm-dialog-title" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                {title}
              </h2>
              {description && (
                <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: "transparent",
              border: "none",
              cursor: loading ? "default" : "pointer",
              color: "var(--text-muted)",
              opacity: loading ? 0.5 : 1,
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          {cancelLabel && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid var(--border-subtle)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: isDanger
                ? "linear-gradient(135deg, rgba(244,63,94,0.92), rgba(220,38,38,0.96))"
                : "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}