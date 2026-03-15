"use client";

import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MoneyValueProps {
  amount: number;
  currency?: string;
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  color?: string;
  prefix?: string;
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm:   "12px",
  base: "14px",
  lg:   "16px",
  xl:   "20px",
  "2xl": "24px",
  "3xl": "32px",
};

export function MoneyValue({
  amount,
  currency = "EUR",
  size = "base",
  color,
  prefix,
  className,
}: MoneyValueProps) {
  const formatted = formatCurrency(amount, currency);
  return (
    <span
      className={cn("money", className)}
      style={{
        fontSize: sizeMap[size] ?? "14px",
        fontWeight: 600,
        color: color ?? "var(--text-primary)",
        display: "inline-flex",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      {prefix && (
        <span style={{ fontSize: "0.8em", fontWeight: 700, opacity: 0.8 }}>{prefix}</span>
      )}
      {formatted}
    </span>
  );
}
