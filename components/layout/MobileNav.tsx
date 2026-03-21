"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function MobileNav() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();

  const navItems = [
    { href: "/dashboard",    labelKey: "nav.home" as const,         icon: LayoutDashboard },
    { href: "/transactions", labelKey: "nav.transactions" as const,  icon: ArrowLeftRight  },
    { href: "/goals",        labelKey: "nav.goals" as const,         icon: Target          },
    { href: "/future-self",  labelKey: "nav.future" as const,        icon: TrendingUp      },
  ];

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
      {navItems.map(({ href, labelKey, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href} href={href}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 4px", textDecoration: "none", gap: 3,
              color: active ? "var(--accent)" : "var(--text-muted)",
              fontSize: 10, fontWeight: active ? 600 : 400,
              background: active ? "var(--accent-dim)" : "transparent",
              borderTop: active ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <Icon size={20} />
            {t(labelKey)}
          </Link>
        );
      })}
      {/* Language toggle */}
      <button
        onClick={() => setLocale(locale === "it" ? "en" : "it")}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          padding: "10px 4px", gap: 3,
          color: "var(--text-muted)", fontSize: 10,
          borderTop: "2px solid transparent",
        }}
      >
        <Globe size={20} />
        {locale.toUpperCase()}
      </button>
    </nav>
  );
}
