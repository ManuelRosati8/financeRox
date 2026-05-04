"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Globe, LogOut, LogIn, Sun, Moon,
  ChevronRight, Shield, CreditCard, Trash2, Save, Info,
} from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { useTheme } from "@/lib/theme-context";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { getPasswordResetRedirectUrl } from "@/lib/utils";

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
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useProfile();
  const supabase = createClient();
  const { t, locale, setLocale } = useI18n();

  // Local form state
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("utente@example.com");
  const [currency, setCurrency]   = useState("EUR");
  const [saved, setSaved]         = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [dialogState, setDialogState] = useState<null | {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string | null;
    intent?: "default" | "danger";
    onConfirm?: () => Promise<void> | void;
  }>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      if (profile.currency) setCurrency(profile.currency);
    }
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data?.user));
      if (data?.user?.email) setEmail(data.user.email);
    });
  }, [profile, supabase]);

  const handleSave = async () => {
    if (profile?.id) {
      await supabase.from('profiles').update({ full_name: fullName, currency }).eq('id', profile.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setDialogState({
        title: t("settings.changePassword"),
        description: "Nessuna email disponibile per questo account.",
        confirmLabel: t("common.close"),
      });
      return;
    }

    const redirectTo = getPasswordResetRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setDialogState({
      title: t("settings.changePassword"),
      description: error
        ? error.message
        : "Ti abbiamo inviato un'email con il link per reimpostare la password.",
      confirmLabel: t("common.close"),
    });
  };

  const closeDialog = () => {
    if (!dialogLoading) setDialogState(null);
  };

  const handleDialogConfirm = async () => {
    if (!dialogState) return;
    if (!dialogState.onConfirm) {
      closeDialog();
      return;
    }

    setDialogLoading(true);
    try {
      await dialogState.onConfirm();
      setDialogState(null);
    } finally {
      setDialogLoading(false);
    }
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

      <div
        className="glass fade-up"
        style={{
          padding: 18,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          border: "1px solid rgba(245, 158, 11, 0.24)",
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02))",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(245, 158, 11, 0.14)",
            color: "var(--accent-amber)",
          }}
        >
          <Info size={17} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            {t("settings.previewNoticeTitle")}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.65, color: "var(--text-secondary)" }}>
            {t("settings.previewNoticeBody")}
          </div>
        </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              style={{
                padding: "7px 12px", borderRadius: 8, fontSize: 13,
                background: "var(--bg-subtle)", border: "1px solid var(--border)",
                color: "var(--text-primary)", outline: "none", width: 200, maxWidth: "100%", flex: "1 1 220px", minWidth: 0,
              }}
            />
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.12)", color: "var(--income-color)", fontWeight: 600, flexShrink: 0 }}>
              {t("common.verified")}
            </span>
          </div>
        </SettingRow>

        <SettingRow icon={Globe} label={t("settings.currency")} description={t("settings.currencyNote")}>
          <AppSelect
            options={[
              { value: "EUR", label: t("settings.currencyEUR") },
              { value: "USD", label: t("settings.currencyUSD") },
              { value: "GBP", label: t("settings.currencyGBP") },
              { value: "CHF", label: t("settings.currencyCHF") },
            ]}
            value={currency}
            onChange={setCurrency}
            wrapperStyle={{ width: 220 }}
            selectStyle={{ minHeight: 36, padding: "7px 36px 7px 12px" }}
          />
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
            onClick={handlePasswordReset}
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
        {isAuthenticated === false && (
          <SettingRow
            icon={LogIn}
            label={t("settings.loginRegister")}
            description={t("settings.loginRegisterNote")}
          >
            <button
              onClick={() => router.push("/login")}
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
        )}

        {isAuthenticated && (
          <>
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
                  setDialogState({
                    title: t("settings.deleteAccount"),
                    description: t("settings.deleteConfirm"),
                    confirmLabel: t("common.delete"),
                    cancelLabel: t("common.cancel"),
                    intent: "danger",
                    onConfirm: () => {
                      setDialogState({
                        title: t("settings.deleteAccount"),
                        description: t("settings.deleteStub"),
                        confirmLabel: t("common.close"),
                        intent: "danger",
                      });
                    },
                  });
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
          </>
        )}
      </Section>

      {/* Version */}
      <div style={{ textAlign: "center", padding: "8px 0 24px", fontSize: 11, color: "var(--text-muted)" }}>
        {t("settings.version")}
      </div>

      <ConfirmDialog
        open={dialogState !== null}
        title={dialogState?.title || ""}
        description={dialogState?.description}
        confirmLabel={dialogState?.confirmLabel || t("common.confirm")}
        cancelLabel={dialogState?.cancelLabel}
        intent={dialogState?.intent || "default"}
        loading={dialogLoading}
        onClose={closeDialog}
        onConfirm={handleDialogConfirm}
      />
    </div>
  );
}
