"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { createClient } from "@/lib/supabase/client";

const authInfoLinks = {
  privacy: "/privacy?returnTo=%2Fregister",
  terms: "/terms?returnTo=%2Fregister",
  contact: "/contact?returnTo=%2Fregister",
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const supabase = createClient();

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedLegal) {
      setError("Devi accettare Privacy Policy e Termini prima di continuare.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const rawNome = formData.get("nome") as string;
    const rawCognome = formData.get("cognome") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const capitalize = (str: string) => str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : "";
    const full_name = `${capitalize(rawNome)} ${capitalize(rawCognome)}`.trim();

    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name }
      }
    });

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
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Crea Account</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Inizia il tuo percorso verso la libertà finanziaria.</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.7 }}>
          I dati di registrazione e di utilizzo dell&apos;app sono gestiti tramite Supabase. Prima di continuare puoi leggere <Link href={authInfoLinks.privacy} style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link> e <Link href={authInfoLinks.terms} style={{ color: "var(--accent)", textDecoration: "none" }}>Termini</Link>.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <form onSubmit={handleEmailRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: "rgba(244,63,94,0.1)", color: "var(--expense-color)", fontSize: 13 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                name="nome" type="text" required placeholder="Nome"
                style={{
                  width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                name="cognome" type="text" required placeholder="Cognome"
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
                name="password" type="password" required placeholder="La tua password" minLength={8}
                style={{
                  width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", marginTop: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", color: "white", 
              fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", 
              opacity: loading ? 0.7 : 1, transition: "all 0.2s", boxShadow: "0 4px 14px rgba(245,158,11,0.3)"
            }}
          >
            {loading ? "Creazione in corso..." : "Registrati Ora"}
          </button>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>
              Acconsento al trattamento dei dati necessari per creare e gestire il mio account su financeRox. Ho letto la <Link href={authInfoLinks.privacy} style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link> e accetto i <Link href={authInfoLinks.terms} style={{ color: "var(--accent)", textDecoration: "none" }}>Termini di utilizzo</Link>.
            </span>
          </label>
        </form>
      </div>

      <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
        Hai già un account?{" "}
        <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          Effettua il Login
        </Link>
        <div style={{ marginTop: 10, fontSize: 12 }}>
          <Link href={authInfoLinks.contact} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Supporto e richieste dati</Link>
        </div>
      </div>
    </div>
  );
}
