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
import { useI18n } from "@/lib/i18n/context";

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
  const { t, locale, setLocale } = useI18n();

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
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("settings.title")}</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 13 }}>
          {t("settings.subtitle")}
        </p>
      </div>

      {/* ── Account ── */}
      <Section title={t("settings.account")}>
        <SettingRow icon={User} label={t("settings.fullName")}>
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

        <SettingRow icon={Mail} label={t("settings.email")} description={t("settings.emailNote")}>
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
              {t("common.verified")}
            </span>
          </div>
        </SettingRow>

        <SettingRow icon={Globe} label={t("settings.currency")} description={t("settings.currencyNote")}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: 8, fontSize: 13,
              background: "var(--bg-subtle)", border: "1px solid var(--border)",
              color: "var(--text-primary)", outline: "none", cursor: "pointer",
            }}
          >
            <option value="EUR">{t("settings.currencyEUR")}</option>
            <option value="USD">{t("settings.currencyUSD")}</option>
            <option value="GBP">{t("settings.currencyGBP")}</option>
            <option value="CHF">{t("settings.currencyCHF")}</option>
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
            {saved ? t("common.saved") : t("common.save")}
          </button>
        </div>
      </Section>

      {/* ── Finanza ── */}
      <Section title={t("settings.finance")}>
        <SettingRow
          icon={Percent}
          label={t("settings.taxRate")}
          description={t("settings.taxRateNote")}
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

      <Section title={t("settings.appearance")}>
        <SettingRow
          icon={theme === "dark" ? Sun : Moon}
          label={t("settings.interfaceTheme")}
          description={theme === "dark" ? t("settings.darkModeActive") : t("settings.lightModeActive")}
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
            {theme === "dark" ? <><Sun size={14} /> {t("common.switchToLight")}</> : <><Moon size={14} /> {t("common.switchToDark")}</>}
          </button>
        </SettingRow>
      </Section>

      {/* ── Lingua ── */}
      <Section title={t("settings.language")}>
        <SettingRow
          icon={Globe}
          label={t("settings.language")}
          description={t("settings.languageNote")}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {(["it", "en"] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                style={{
                  padding: "7px 14px", borderRadius: 8,
                  border: `1px solid ${locale === loc ? "var(--accent)" : "var(--border)"}`,
                  background: locale === loc ? "var(--accent-dim)" : "var(--bg-subtle)",
                  color: locale === loc ? "var(--accent)" : "var(--text-secondary)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {loc === "it" ? "🇮🇹 Italiano" : "🇬🇧 English"}
              </button>
            ))}
          </div>
        </SettingRow>
      </Section>

      <Section title={t("settings.security")}>
        <SettingRow
          icon={Shield}
          label={t("settings.changePassword")}
          description={t("settings.changePasswordNote")}
        >
          <button
            onClick={() => { alert(t("settings.resetStub")); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text-secondary)",
              fontSize: 13, cursor: "pointer",
            }}
          >
            {t("settings.sendReset")}
            <ChevronRight size={13} />
          </button>
        </SettingRow>

        <SettingRow
          icon={CreditCard}
          label={t("settings.plan")}
          description={t("settings.planNote")}
        >
          <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "var(--accent-purple-dim)", color: "var(--accent-purple)", fontWeight: 600 }}>
            Demo
          </span>
        </SettingRow>
      </Section>

      <Section title={t("settings.session")}>
        {/* Demo note */}
        <div style={{
          padding: "12px 14px", borderRadius: 10, marginBottom: 4,
          background: "rgba(124,111,247,0.06)", border: "1px solid rgba(124,111,247,0.15)",
          fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7,
        }}>
          🔐 <strong style={{ color: "var(--accent-purple)" }}>{t("settings.authNoteBold")}</strong>{" "}
          {t("settings.authNote")}{" "}
          {t("settings.authWalkthrough")}.
        </div>

        <SettingRow
          icon={LogIn}
          label={t("settings.loginRegister")}
          description={t("settings.loginRegisterNote")}
        >
          <button
            onClick={() => { alert("Pagine auth in arrivo"); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              color: "white", border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t("settings.loginRegisterBtn")}
          </button>
        </SettingRow>

        <SettingRow
          icon={LogOut}
          label={t("settings.logoutLabel")}
          description={t("settings.logoutNote")}
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
            {t("settings.logoutBtn")}
          </button>
        </SettingRow>

        <SettingRow
          icon={Trash2}
          label={t("settings.deleteAccount")}
          description={t("settings.deleteAccountNote")}
          danger
        >
          <button
            onClick={() => {
              if (confirm(t("settings.deleteConfirm"))) {
                alert(t("settings.deleteStub"));
              }
            }}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid rgba(244,63,94,0.3)",
              background: "transparent", color: "var(--expense-color)",
              fontSize: 13, cursor: "pointer",
            }}
          >
            {t("settings.deleteAccountBtn")}
          </button>
        </SettingRow>
      </Section>

      {/* Version */}
      <div style={{ textAlign: "center", padding: "8px 0 24px", fontSize: 11, color: "var(--text-muted)" }}>
        {t("settings.version")}
      </div>
    </div>
  );
}
