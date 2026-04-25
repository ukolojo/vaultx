"use client";
import { useEffect, useRef } from "react";

export default function BackgroundOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!orbRef.current) return;
      const y = window.scrollY;
      orbRef.current.style.transform =
        `translate(-50%, calc(-50% + ${y * 0.15}px))`;
    }
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="orb-container"
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <div
        ref={orbRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          height: "min(600px, 90vw)",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%,
            rgba(40,40,40,1) 0%,
            rgba(15,15,15,1) 40%,
            rgba(0,0,0,1) 70%,
            rgba(0,0,0,1) 100%
          )`,
          boxShadow: `
            inset -20px -20px 60px rgba(255,107,53,0.04),
            inset 10px 10px 40px rgba(255,255,255,0.02),
            0 0 80px rgba(0,0,0,0.8)
          `,
          animation: "orb-rotate 20s linear infinite",
          opacity: 0.6,
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.4' fill='rgba(255,255,255,0.06)'/%3E%3C/svg%3E")`,
          backgroundSize: "4px 4px",
          animation: "orb-rotate-reverse 30s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: `repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.015) 18px, rgba(255,255,255,0.015) 19px)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: `repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.015) 18px, rgba(255,255,255,0.015) 19px)`,
          animation: "orb-rotate 25s linear infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "10%", left: "15%",
          width: "30%", height: "25%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%", right: "10%",
          width: "40%", height: "35%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 70%)`,
        }} />
      </div>
    </div>
  );
}