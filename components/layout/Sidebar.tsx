"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, Target, TrendingUp,
  Sparkles, Settings, Sun, Moon, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/transactions", label: "Transazioni",  icon: ArrowLeftRight  },
  { href: "/goals",        label: "Obiettivi",    icon: Target          },
  { href: "/future-self",  label: "Future Self",  icon: TrendingUp      },
];

export function Sidebar() {
  const pathname  = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useProfile();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const formatName = (name?: string) => {
    if (!name) return "Utente";
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div className="gradient-text" style={{ fontWeight: 700, fontSize: 15 }}>financeRox</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Personal Finance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
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
              {label}
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
          {theme === "dark" ? "Modalità chiara" : "Modalità scura"}
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
          Impostazioni
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
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Free Plan</div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
            title="Esci"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
