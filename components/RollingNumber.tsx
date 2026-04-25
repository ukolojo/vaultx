"use client";
import { useEffect, useRef, useState } from "react";

export default function RollingNumber({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number | null;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (value === null) return;
    const start = prevRef.current;
    const end = value;
    const duration = 800;
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = setTimeout(update, 16);
      } else {
        prevRef.current = end;
      }
    }

    clearTimeout(rafRef.current);
    update();
    return () => clearTimeout(rafRef.current);
  }, [value]);

  if (value === null) return null;

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("en-NG", {
        maximumFractionDigits: 2,
      })}
      {suffix}
    </span>
  );
}