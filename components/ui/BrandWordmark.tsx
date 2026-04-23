"use client";

interface BrandWordmarkProps {
  size?: number;
}

export function BrandWordmark({ size = 32 }: BrandWordmarkProps) {
  return (
    <span
      className="brand-wordmark"
      aria-label="financeRox"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontSize: size,
        "--brand-size": `${size}px`,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: "-0.05em",
        fontFamily: "Inter, sans-serif",
        whiteSpace: "nowrap",
      }}
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