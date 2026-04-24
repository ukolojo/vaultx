"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll);
    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: progress + "%",
        height: "2px",
        background:
          "linear-gradient(90deg, #FF6B35, #ffaa80)",
        boxShadow: "0 0 8px rgba(255,107,53,0.6)",
        zIndex: 99997,
        transition: "width 0.1s ease",
        pointerEvents: "none",
      }}
    />
  );
}