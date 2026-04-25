"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedStat({
  value,
  label,
  isText = false,
}: {
  value: string;
  label: string;
  isText?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [display, setDisplay] = useState(
    isText ? value : "0"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || isText) return;
    const numericValue = parseFloat(
      value.replace(/[^0-9.]/g, "")
    );
    if (isNaN(numericValue)) return;

    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + numericValue * eased;

      if (value.includes(",")) {
        setDisplay(
          Math.round(current).toLocaleString()
        );
      } else {
        setDisplay(
          value.replace(
            numericValue.toString(),
            current.toFixed(0)
          )
        );
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplay(value);
      }
    }
    requestAnimationFrame(update);
  }, [triggered]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/[0.06] 
        bg-white/[0.03] backdrop-blur-xl p-4 text-center
        hover:border-[#FF6B35]/20 hover:bg-[#FF6B35]/[0.03]
        transition-all duration-300 glass-depth glass-edge"
    >
      <p
        className="text-2xl font-bold tracking-tight 
          text-[#FF6B35]"
        style={{
          opacity: triggered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {triggered ? display : "0"}
      </p>
      <p className="text-[10px] text-white/25 mt-1 
        uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}