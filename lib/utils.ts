import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function getPasswordResetRedirectUrl() {
  return `${getAppBaseUrl()}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
}

export function formatCurrency(
  amount: number,
  currency = "EUR",
  locale = "it-IT"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string, locale = "it-IT"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatShortDate(dateStr: string, locale = "it-IT"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
}
