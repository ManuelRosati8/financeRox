"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const navItems = [
  { href: "/dashboard",    label: "Home",          icon: LayoutDashboard },
  { href: "/transactions", label: "Transazioni",   icon: ArrowLeftRight  },
  { href: "/goals",        label: "Obiettivi",     icon: Target          },
  { href: "/future-self",  label: "Futuro",        icon: TrendingUp      },
];

export function MobileNav() {
  const pathname  = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="mobile-nav"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        flexDirection: "row", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href} href={href}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 4px", textDecoration: "none", gap: 3,
              color: active ? "var(--accent-purple)" : "var(--text-muted)",
              fontSize: 10, fontWeight: active ? 600 : 400,
              background: active ? "var(--accent-purple-dim)" : "transparent",
              borderTop: active ? "2px solid var(--accent-purple)" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
      {/* Theme toggle as last icon */}
      <button
        onClick={toggleTheme}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          padding: "10px 4px", gap: 3,
          color: "var(--text-muted)", fontSize: 10,
          borderTop: "2px solid transparent",
        }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        Tema
      </button>
    </nav>
  );
}
