"use client";
import { useState } from "react";

export default function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          position: "absolute",
          left: "16px",
          top: active ? "6px" : "50%",
          transform: active
            ? "translateY(0) scale(0.75)"
            : "translateY(-50%) scale(1)",
          transformOrigin: "left center",
          color: active
            ? "rgba(255,107,53,0.7)"
            : "rgba(255,255,255,0.25)",
          fontSize: "13px",
          transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
          zIndex: 1,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        inputMode={inputMode}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className={className}
        style={{
          paddingTop: active ? "20px" : "12px",
          paddingBottom: active ? "4px" : "12px",
        }}
      />
    </div>
  );
}