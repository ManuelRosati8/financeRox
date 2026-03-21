"use client";

import { useState } from "react";
import {
  User, Mail, Globe, Palette, Bell, LogOut, LogIn, Sun, Moon,
  ChevronRight, Shield, CreditCard, Trash2, Save, Percent,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { MoneyValue } from "@/components/ui/MoneyValue";
import { useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 0 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SettingRow({
  icon: Icon, label, description, children, danger,
}: {
  icon: React.ElementType; label: string; description?: string;
  children?: React.ReactNode; danger?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid var(--border-subtle)",
      gap: 16,
    }}
      className="setting-row"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: danger ? "rgba(244,63,94,0.12)" : "var(--bg-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} color={danger ? "var(--expense-color)" : "var(--accent-purple)"} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: danger ? "var(--expense-color)" : "var(--text-primary)" }}>
            {label}
          </div>
          {description && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{description}</div>
          )}
        </div>
      </div>
      {children && <div style={{ flexShrink: 0 }}>{children}</div>}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useProfile();
  const supabase = createClient();

  // Local form state
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("utente@example.com");
  const [currency, setCurrency]   = useState("EUR");
  const [taxRate, setTaxRate]     = useState("");
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      if (profile.currency) setCurrency(profile.currency);
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setEmail(data.user.email);
    });
    // Load tax rate from localStorage
    const stored = localStorage.getItem("financerox_tax_rate");
    if (stored) setTaxRate(stored);
  }, [profile, supabase]);

  const handleSave = async () => {
    if (profile?.id) {
      await supabase.from('profiles').update({ full_name: fullName, currency }).eq('id', profile.id);
    }
    // Persist tax rate in localStorage (no DB column required)
    localStorage.setItem("financerox_tax_rate", taxRate);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
      {/* Header */}
      <div className="fade-up">
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Impostazioni</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 13 }}>
          Gestisci account, preferenze e sicurezza
        </p>
      </div>

      {/* ── Account ── */}
      <Section title="Account">
        <SettingRow icon={User} label="Nome completo">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: 8, fontSize: 13,
              background: "var(--bg-subtle)", border: "1px solid var(--border)",
              color: "var(--text-primary)", outline: "none", width: 200,
            }}
          />
        </SettingRow>

        <SettingRow icon={Mail} label="Email" description="Usata per login e notifiche">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              style={{
                padding: "7px 12px", borderRadius: 8, fontSize: 13,
                background: "var(--bg-subtle)", border: "1px solid var(--border)",
                color: "var(--text-primary)", outline: "none", width: 200,
              }}
            />
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.12)", color: "var(--income-color)", fontWeight: 600 }}>
              ✓ verificata
            </span>
          </div>
        </SettingRow>

        <SettingRow icon={Globe} label="Valuta" description="Usata per tutti i valori monetari">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: 8, fontSize: 13,
              background: "var(--bg-subtle)", border: "1px solid var(--border)",
              color: "var(--text-primary)", outline: "none", cursor: "pointer",
            }}
          >
            <option value="EUR">€ Euro (EUR)</option>
            <option value="USD">$ Dollaro (USD)</option>
            <option value="GBP">£ Sterlina (GBP)</option>
            <option value="CHF">Fr. Franco (CHF)</option>
          </select>
        </SettingRow>

        {/* Save button */}
        <div style={{ paddingTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer",
              background: saved ? "var(--income-color)" : "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white", fontSize: 13, fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            <Save size={14} />
            {saved ? "Salvato!" : "Salva modifiche"}
          </button>
        </div>
      </Section>

      {/* ── Finanza ── */}
      <Section title="Finanza">
        <SettingRow
          icon={Percent}
          label="Aliquota fiscale prevista"
          description="La quota tasse verrà sottratta dal Safe to Spend su ogni entrata"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={taxRate}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v >= 0 && v <= 100) setTaxRate(e.target.value);
                else if (e.target.value === "") setTaxRate("");
              }}
              placeholder="es. 23"
              style={{
                padding: "7px 12px", borderRadius: 8, fontSize: 13,
                background: "var(--bg-subtle)", border: "1px solid var(--border)",
                color: "var(--text-primary)", outline: "none", width: 90,
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>%</span>
          </div>
        </SettingRow>
        {taxRate && parseFloat(taxRate) > 0 && (
          <div style={{
            marginTop: 4, padding: "10px 14px", borderRadius: 10,
            background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)",
            fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65,
          }}>
            💡 Con aliquota{" "}
            <strong style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              {taxRate}%
            </strong>
            , su uno stipendio di <strong style={{ fontFamily: "JetBrains Mono, monospace" }}>€ 2.000</strong>
            {" "}verranno accantonati{" "}
            <strong style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              € {(2000 * parseFloat(taxRate) / 100).toFixed(0)}
            </strong>
            {" "}di tasse — il Safe to Spend mostrerà solo le restanti{" "}
            <strong style={{ fontFamily: "JetBrains Mono, monospace" }}>
              € {(2000 * (1 - parseFloat(taxRate) / 100)).toFixed(0)}
            </strong>.
          </div>
        )}
      </Section>

      {/* ── Aspetto ── */}
      <Section title="Aspetto">
        <SettingRow
          icon={theme === "dark" ? Sun : Moon}
          label="Tema interfaccia"
          description={theme === "dark" ? "Modalità scura attiva" : "Modalità chiara attiva"}
        >
          <button
            onClick={toggleTheme}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg-subtle)", color: "var(--text-primary)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            {theme === "dark" ? <><Sun size={14} /> Passa al chiaro</> : <><Moon size={14} /> Passa al scuro</>}
          </button>
        </SettingRow>
      </Section>

      {/* ── Sicurezza ── */}
      <Section title="Sicurezza">
        <SettingRow
          icon={Shield}
          label="Cambia password"
          description="Ti invieremo un'email con il link di reset"
        >
          <button
            onClick={() => {
              // TODO: supabase.auth.resetPasswordForEmail(email)
              alert("Email di reset inviata! (stub — collegare a Supabase Auth)");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text-secondary)",
              fontSize: 13, cursor: "pointer",
            }}
          >
            Invia reset
            <ChevronRight size={13} />
          </button>
        </SettingRow>

        <SettingRow
          icon={CreditCard}
          label="Piano"
          description="financeRox — Demo gratuito"
        >
          <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "var(--accent-purple-dim)", color: "var(--accent-purple)", fontWeight: 600 }}>
            Demo
          </span>
        </SettingRow>
      </Section>

      {/* ── Sessione ── */}
      <Section title="Sessione">
        {/* Demo note */}
        <div style={{
          padding: "12px 14px", borderRadius: 10, marginBottom: 4,
          background: "rgba(124,111,247,0.06)", border: "1px solid rgba(124,111,247,0.15)",
          fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7,
        }}>
          🔐 <strong style={{ color: "var(--accent-purple)" }}>Auth non ancora configurata.</strong>{" "}
          La registrazione e il login verranno abilitati collegando Supabase Auth.{" "}
          Vedi la guida nel{" "}
          <a href="#" style={{ color: "var(--accent-purple)", textDecoration: "underline" }}>walkthrough</a>.
        </div>

        <SettingRow
          icon={LogIn}
          label="Accedi / Registrati"
          description="Crea un account o accedi con email e password"
        >
          <button
            onClick={() => {
              // TODO: router.push('/login') once auth pages are created
              alert("Pagine auth in arrivo — vedi implementation_plan.md");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white", border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Login / Registrati
          </button>
        </SettingRow>

        <SettingRow
          icon={LogOut}
          label="Esci dall'account"
          description="Termina la sessione corrente"
          danger
        >
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid rgba(244,63,94,0.3)",
              background: "rgba(244,63,94,0.08)", color: "var(--expense-color)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            <LogOut size={13} />
            Esci
          </button>
        </SettingRow>

        <SettingRow
          icon={Trash2}
          label="Elimina account"
          description="Azione irreversibile — tutti i dati verranno cancellati"
          danger
        >
          <button
            onClick={() => {
              if (confirm("Sei sicuro? Questa azione è irreversibile.")) {
                // TODO: supabase.rpc('delete_user')
                alert("Funzione non ancora disponibile in demo mode.");
              }
            }}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid rgba(244,63,94,0.3)",
              background: "transparent", color: "var(--expense-color)",
              fontSize: 13, cursor: "pointer",
            }}
          >
            Elimina account
          </button>
        </SettingRow>
      </Section>

      {/* Version */}
      <div style={{ textAlign: "center", padding: "8px 0 24px", fontSize: 11, color: "var(--text-muted)" }}>
        financeRox v0.1.0 · Supabase Connected
      </div>
    </div>
  );
}
