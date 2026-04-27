"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Sun, Moon, ArrowRight, Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ─── STICKY HEADER ─── */}
      <header
        className="landing-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 6%",
          display: "grid",
          gridTemplateColumns: "180px 1fr auto",
          alignItems: "center",
          columnGap: 24,
          height: 64,
        }}
      >
        {/* Logo */}
        <div className="landing-header-brand" style={{ display: "flex", alignItems: "center", width: 180, minWidth: 180 }}>
          <Link href="/" onClick={closeMenu} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <BrandWordmark size={30} />
          </Link>
        </div>

        {/* Nav — hidden on mobile */}
        <nav
          className="landing-nav"
          style={{ display: "flex", alignItems: "center", gap: 28, justifySelf: "center" }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
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
        <div className="landing-header-actions" style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "end", flexShrink: 0 }}>
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

        <button
          type="button"
          className="landing-menu-button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            cursor: "pointer",
            justifySelf: "end",
          }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div
          className="landing-mobile-panel"
          style={{
            position: "sticky",
            top: 64,
            zIndex: 95,
            padding: "14px 6% 18px",
            background: "color-mix(in srgb, var(--bg-base) 86%, transparent)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="glass"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderRadius: 18,
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  style={{
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "11px 12px",
                    borderRadius: 12,
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => setLocale(locale === "it" ? "en" : "it")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 44,
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Globe size={15} />
                {locale.toUpperCase()}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 44,
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-subtle)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {locale === "it" ? "Tema" : "Theme"}
              </button>
            </div>

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 46,
                  borderRadius: 14,
                  background: "var(--accent)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 800,
                  boxShadow: "0 6px 18px rgba(249,115,22,0.28)",
                }}
              >
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 44,
                    borderRadius: 12,
                    textDecoration: "none",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    background: "var(--bg-subtle)",
                    fontWeight: 700,
                  }}
                >
                  {locale === "it" ? "Accedi" : "Sign In"}
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minHeight: 44,
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "white",
                    background: "var(--accent)",
                    fontWeight: 800,
                    boxShadow: "0 6px 18px rgba(249,115,22,0.28)",
                  }}
                >
                  {locale === "it" ? "Registrati" : "Get Started"} <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FLOATING THEME TOGGLE (bottom-left) ─── */}
      <button
        className="landing-theme-fab"
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
