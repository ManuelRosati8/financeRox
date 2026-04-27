"use client";

import type { CSSProperties } from "react";

interface BrandWordmarkProps {
  size?: number;
}

export function BrandWordmark({ size = 32 }: BrandWordmarkProps) {
  const brandStyle = {
    display: "inline-flex",
    alignItems: "baseline",
    fontSize: size,
    "--brand-size": `${size}px`,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
  } as CSSProperties & { "--brand-size": string };

  return (
    <span
      className="brand-wordmark"
      aria-label="financeRox"
      style={brandStyle}
      role="img"
    >
      <span className="brand-wordmark-finance">finance</span>
      <span className="brand-wordmark-rox">
        <span className="brand-wordmark-r">R</span>
        <span className="brand-wordmark-ox">ox</span>
        <span className="brand-wordmark-ox">.</span>

      </span>
    </span>
  );
}