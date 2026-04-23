"use client";

import type { CSSProperties, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface AppSelectOption {
  value: string;
  label: string;
}

interface AppSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "onChange"> {
  options: AppSelectOption[];
  onChange: (value: string) => void;
  wrapperStyle?: CSSProperties;
  selectStyle?: CSSProperties;
}

export function AppSelect({
  options,
  value,
  onChange,
  wrapperStyle,
  selectStyle,
  className,
  ...props
}: AppSelectProps) {
  return (
    <div className="rox-select-shell" style={wrapperStyle}>
      <select
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={className ? `rox-select-field ${className}` : "rox-select-field"}
        style={selectStyle}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="rox-select-icon" />
    </div>
  );
}