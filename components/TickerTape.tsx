"use client";
import { useEffect, useState } from "react";

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export default function TickerTape() {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<TickerItem[]>([
    { label: "SOL/USD", value: "Loading..." },
    { label: "SOL/NGN", value: "Loading..." },
    { label: "Network", value: "Devnet" },
    { label: "VaultX", value: "v2.0" },
    { label: "Status", value: "● Live" },
  ]);

  useEffect(() => {
    setShow(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const [solRes, fxRes] = await Promise.all([
          fetch(
            "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT",
            { cache: "no-store" }
          ),
          fetch(
            "https://open.er-api.com/v6/latest/USD",
            { cache: "no-store" }
          ),
        ]);
        const solData = await solRes.json();
        const fxData = await fxRes.json();
        const solUsd = parseFloat(solData?.price ?? "0");
        const usdNgn = fxData?.rates?.NGN ?? 0;
        const solNgn = solUsd * usdNgn;

        setItems([
          {
            label: "SOL/USD",
            value: "$" + solUsd.toFixed(2),
          },
          {
            label: "SOL/NGN",
            value:
              "₦" +
              Math.round(solNgn).toLocaleString("en-NG"),
          },
          { label: "Network", value: "Devnet" },
          { label: "TPS", value: "~4,000" },
          { label: "VaultX", value: "v2.0 ● Live" },
          { label: "FUL", value: "Kogi State, NG" },
        ]);
      } catch {}
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const repeated = [...items, ...items, ...items];

  if (!show) return null;

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,107,53,0.08)",
        borderBottom: "1px solid rgba(255,107,53,0.08)",
        background: "rgba(255,107,53,0.02)",
        padding: "6px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0",
          animation: "ticker-scroll 30s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 24px",
              fontSize: "10px",
              color: "rgba(255,255,255,0.4)",
              borderRight:
                "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                color: "rgba(255,107,53,0.5)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              {item.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}