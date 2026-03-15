import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
