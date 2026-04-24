"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer1);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 80);

    const timer2 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 600);
    }, 1200);

    return () => {
      clearInterval(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            margin: 0,
          }}
        >
          Vault
          <span style={{ color: "#FF6B35" }}>X</span>
        </h1>
        <p
          style={{
            fontSize: "10px",
            color: "rgba(255,107,53,0.4)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "8px",
          }}
        >
          Don&apos;t trust — verify
        </p>
      </div>

      <div
        style={{
          width: "200px",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: Math.min(progress, 100) + "%",
            background:
              "linear-gradient(90deg, #FF6B35, #ffaa80)",
            borderRadius: "1px",
            transition: "width 0.08s ease",
            boxShadow: "0 0 8px rgba(255,107,53,0.6)",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Connecting to Solana
      </p>
    </div>
  );
}