"use client";
import { useRef } from "react";

export default function RippleButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleClick(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    if (disabled) return;
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.();
  }

  return (
    <button
      ref={ref}
      type={type}
      className={"ripple-btn " + (className ?? "")}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}