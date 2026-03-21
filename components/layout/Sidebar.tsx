"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, Target, TrendingUp,
  Settings, Sun, Moon, LogOut, Globe,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

const navItems: { href: string; labelKey: TranslationKey; icon: React.ElementType }[] = [
  { href: "/dashboard",    labelKey: "nav.dashboard",   icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions", icon: ArrowLeftRight  },
  { href: "/goals",        labelKey: "nav.goals",        icon: Target          },
  { href: "/future-self",  labelKey: "nav.futureSelf",   icon: TrendingUp      },
];

export function Sidebar() {
  const pathname  = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const { data: profile } = useProfile();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const formatName = (name?: string) => {
    if (!name) return t("common.user");
    return name.split(" ").map(capitalize).join(" ");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: 230,
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        flexDirection: "column",
        padding: "22px 14px",
        gap: 6,
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "4px 10px 22px" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", display: "block" }}>
          <Image
            src={theme === "dark" ? "/financeRox_logoBlack.jpg" : "/financeRox_logo.jpg"}
            alt="financeRox"
            width={250}
            height={68}
            style={{ objectFit: "contain", maxHeight: 68, width: "auto" }}
            priority
          />
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                fontWeight: active ? 600 : 400, fontSize: 13,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--accent-dim)" : "transparent",
                border: active ? "1px solid rgba(124,111,247,0.2)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={17} style={{ stroke: active ? "var(--accent)" : "var(--text-muted)" }} />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "var(--text-secondary)", fontSize: 13,
            transition: "background 0.15s",
            width: "100%", textAlign: "left",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
        >
          {theme === "dark"
            ? <Sun size={16} style={{ stroke: "var(--accent-amber)" }} />
            : <Moon size={16} style={{ stroke: "var(--accent)" }} />
          }
          {theme === "dark" ? t("common.lightMode") : t("common.darkMode")}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "it" ? "en" : "it")}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "var(--text-secondary)", fontSize: 13,
            width: "100%", textAlign: "left",
            transition: "background 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
        >
          <Globe size={16} style={{ stroke: "var(--text-muted)" }} />
          {locale === "it" ? "Italiano" : "English"}
        </button>

        <Link
          href="/settings"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, textDecoration: "none",
            color: "var(--text-muted)", fontSize: 13,
          }}
        >
          <Settings size={15} />
          {t("nav.settings")}
        </Link>

        {/* User avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 10px 0" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "white", textTransform: "uppercase"
          }}>
            {getInitials(profile?.full_name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {formatName(profile?.full_name)}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{t("common.freePlan")}</div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
            title={t("common.logout")}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
