"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { createClient } from "@/lib/supabase/client";

const authInfoLinks = {
  privacy: "/privacy?returnTo=%2Flogin",
  terms: "/terms?returnTo=%2Flogin",
  contact: "/contact?returnTo=%2Flogin",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <BrandWordmark size={30} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Bentornato!</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Accedi a financeRox per gestire le tue finanze.</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.7 }}>
          L&apos;accesso usa autenticazione gestita su Supabase. Consulta <Link href={authInfoLinks.privacy} style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>, <Link href={authInfoLinks.terms} style={{ color: "var(--accent)", textDecoration: "none" }}>Termini</Link> e <Link href={authInfoLinks.contact} style={{ color: "var(--accent)", textDecoration: "none" }}>Contatti</Link> se hai richieste su account o dati.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: "rgba(244,63,94,0.1)", color: "var(--expense-color)", fontSize: 13 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                name="email" type="email" required placeholder="La tua email"
                style={{
                  width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                name="password" type="password" required placeholder="La tua password"
                style={{
                  width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/login" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Password dimenticata?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px 24px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", color: "white", 
              fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", 
              opacity: loading ? 0.7 : 1, transition: "all 0.2s", boxShadow: "0 4px 14px rgba(245,158,11,0.3)"
            }}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
        Non hai ancora un account?{" "}
        <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          Registrati qui
        </Link>
      </div>
    </div>
  );
}
