"use client";
import { useRef } from "react";

export default function MagneticButton({
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

  function handleMouseMove(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    const btn = ref.current;
    if (!btn || disabled) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform =
      `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }

  function handleMouseLeave() {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "translate(0,0)";
  }

  return (
    <button
      ref={ref}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.3s ease" }}
    >
      {children}
    </button>
  );
}