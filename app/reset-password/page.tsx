"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const invalidLink = error === t("reset.invalidLink");

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) {
        return;
      }

      if (!data.session) {
        setError(t("reset.invalidLink"));
      }

      setReady(true);
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setError(t("reset.passwordMin"));
      setSuccess(null);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("reset.passwordMismatch"));
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(t("reset.success"));
    setLoading(false);
    window.setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at top right, rgba(245,158,11,0.08), transparent 40%), var(--bg-base)",
      padding: "max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))",
    }}>
      <div className="glass" style={{ width: "100%", maxWidth: 420, padding: "40px 32px", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "var(--accent)", filter: "blur(60px)", opacity: 0.15, borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <BrandWordmark size={30} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{t("reset.title")}</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {t("reset.subtitle")}
            </p>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: "rgba(244,63,94,0.1)", color: "var(--expense-color)", fontSize: 13 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: "rgba(34,197,94,0.12)", color: "var(--income-color)", fontSize: 13 }}>
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, opacity: ready ? 1 : 0.65 }}>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                required
                minLength={8}
                placeholder={t("reset.newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!ready || !!success}
                style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)", background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none" }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                required
                minLength={8}
                placeholder={t("reset.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!ready || !!success}
                style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid var(--border-subtle)", background: "var(--bg-subtle)", color: "var(--text-primary)", fontSize: 14, outline: "none" }}
              />
            </div>

            <button
              type="submit"
              disabled={!ready || loading || !!success || invalidLink}
              style={{ width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", opacity: !ready || loading || !!success ? 0.7 : 1, transition: "all 0.2s", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}
            >
              {loading ? t("reset.submitting") : t("reset.submit")}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              {t("reset.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}