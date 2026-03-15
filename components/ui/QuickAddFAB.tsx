"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Aggiungi transazione"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 200,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 28px rgba(124,111,247,0.45)",
          transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 8px 36px rgba(124,111,247,0.6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(124,111,247,0.45)";
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      <TransactionDialog
        open={open}
        onClose={() => setOpen(false)}
        initialData={null}
      />
    </>
  );
}
