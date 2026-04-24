"use client";
import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let rafId: number;

    function draw() {
      ctx!.clearRect(0, 0, 32, 32);

      // Background
      ctx!.fillStyle = "#000000";
      ctx!.beginPath();
      ctx!.roundRect(0, 0, 32, 32, 6);
      ctx!.fill();

      // Pulsing orange dot
      const pulse = 0.7 + Math.sin(frame * 0.08) * 0.3;
      const radius = 4 * pulse;

      ctx!.beginPath();
      ctx!.arc(24, 8, radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,107,53,${pulse})`;
      ctx!.fill();

      // V letter
      ctx!.fillStyle = "#ffffff";
      ctx!.font = "bold 18px sans-serif";
      ctx!.fillText("V", 6, 23);

      // X in orange
      ctx!.fillStyle = "#FF6B35";
      ctx!.font = "bold 14px sans-serif";
      ctx!.fillText("X", 18, 26);

      const link =
        document.querySelector<HTMLLinkElement>(
          "link[rel~='icon']"
        ) ||
        (() => {
          const l = document.createElement("link");
          l.rel = "icon";
          document.head.appendChild(l);
          return l;
        })();

      link.href = canvas.toDataURL("image/png");
      frame++;
      rafId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}