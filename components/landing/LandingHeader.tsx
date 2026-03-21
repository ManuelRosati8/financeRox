"use client";

import Image from "next/image";
import Link from "next/link";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const NAV_LINKS = [
  { label: "Feature",        href: "#features"    },
  { label: "Future Self",    href: "#futureself"  },
  { label: "FAQ",            href: "#faq"         },
  { label: "Bug & Feedback", href: "#bug-report"  },
];

export function LandingHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
            <Image
              src={isDark ? "/financeRox_logoBlack.jpg" : "/financeRox_logo.jpg"}
              alt="financeRox"
              width={160}
              height={42}
              style={{ objectFit: "contain", height: 38, width: "auto" }}
              priority
            />
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

        {/* Right: theme toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)", transition: "all 0.15s",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseOut={e  => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
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
                Accedi
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
                Inizia Ora <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── FLOATING THEME TOGGLE (bottom-left) ─── */}
      <button
        onClick={toggleTheme}
        title={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
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
