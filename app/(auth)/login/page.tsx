"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { getPasswordResetRedirectUrl } from "@/lib/utils";

const authInfoLinks = {
  privacy: "/privacy?returnTo=%2Flogin",
  terms: "/terms?returnTo=%2Flogin",
  contact: "/contact?returnTo=%2Flogin",
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [email, setEmail] = useState("");
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
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

  const handlePasswordReset = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError(t("login.resetNeedEmail"));
      setInfo(null);
      return;
    }

    setResetLoading(true);
    setError(null);
    setInfo(null);

    const redirectTo = getPasswordResetRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setInfo(t("login.resetSent"));
    }

    setResetLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <BrandWordmark size={30} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{t("login.welcome")}</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{t("login.subtitle")}</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.7 }}>
          {t("login.authInfo")} <Link href={authInfoLinks.privacy} style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>, <Link href={authInfoLinks.terms} style={{ color: "var(--accent)", textDecoration: "none" }}>Termini</Link> e <Link href={authInfoLinks.contact} style={{ color: "var(--accent)", textDecoration: "none" }}>Contatti</Link>.
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
          {info && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: "rgba(34,197,94,0.12)", color: "var(--income-color)", fontSize: 13 }}>
              <AlertCircle size={16} />
              {info}
            </div>
          )}
          <div>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                name="email" type="email" required placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                name="password" type="password" required placeholder={t("login.passwordPlaceholder")}
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
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none", background: "transparent", border: "none", cursor: resetLoading ? "default" : "pointer", opacity: resetLoading ? 0.7 : 1 }}
            >
              {resetLoading ? t("login.resetSending") : t("login.forgotPassword")}
            </button>
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
            {loading ? t("login.submitting") : t("login.submit")}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
        {t("login.noAccount")}{" "}
        <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          {t("login.registerLink")}
        </Link>
      </div>
    </div>
  );
}
