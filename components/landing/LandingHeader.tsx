"use client";

import Link from "next/link";
import { Globe, Sun, Moon, ArrowRight } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useTheme } from "@/lib/theme-context";
import { useI18n } from "@/lib/i18n/context";

const NAV_LINKS = [
  { label: "Feature",        href: "#features"    },
  { label: "Future Self",    href: "#futureself"  },
  { label: "FAQ",            href: "#faq"         },
  { label: "Bug & Feedback", href: "#bug-report"  },
];

export function LandingHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { locale, setLocale } = useI18n();

  return (
    <>
      {/* ─── STICKY HEADER ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <BrandWordmark size={30} />
          </Link>
        </div>

        {/* Nav — hidden on mobile */}
        <nav
          className="landing-nav"
          style={{ display: "flex", alignItems: "center", gap: 28 }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseOut={e  => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: language toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "it" ? "en" : "it")}
            title={locale === "it" ? "Switch to English" : "Passa all'Italiano"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 36, padding: "0 12px", borderRadius: 10,
              background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseOut={e  => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          >
            <Globe size={14} />
            {locale.toUpperCase()}
          </button>

          {/* Auth CTA */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--accent)", color: "white",
                padding: "9px 22px", borderRadius: 99,
                fontSize: 13, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              }}
            >
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: "var(--text-secondary)", textDecoration: "none", padding: "8px 14px",
                }}
              >
                {locale === "it" ? "Accedi" : "Sign In"}
              </Link>
              <Link
                href="/register"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--accent)", color: "white",
                  padding: "9px 22px", borderRadius: 99,
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                }}
              >
                {locale === "it" ? "Inizia Ora" : "Get Started"} <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── FLOATING THEME TOGGLE (bottom-left) ─── */}
      <button
        onClick={toggleTheme}
        title={isDark ? (locale === "it" ? "Passa al tema chiaro" : "Switch to light mode") : (locale === "it" ? "Passa al tema scuro" : "Switch to dark mode")}
        style={{
          position: "fixed", bottom: 28, left: 28, zIndex: 200,
          width: 46, height: 46, borderRadius: 14,
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--border-subtle)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow)",
          color: "var(--text-secondary)",
          transition: "all 0.2s",
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.color = "var(--accent)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-dim)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.boxShadow = "var(--shadow)";
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </>
  );
}
