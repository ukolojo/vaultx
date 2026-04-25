"use client";
import { useState } from "react";

export default function WalletAddress({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const short =
    address.slice(0, 4) +
    "••••••••••••••••••••••••••••••••••••••" +
    address.slice(-4);

  async function handleClick() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span
      className={className}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: "11px",
        transition: "color 0.2s ease",
        color: revealed
          ? "rgba(255,107,53,0.8)"
          : "rgba(255,255,255,0.3)",
      }}
      title="Click to copy"
    >
      {copied
        ? "Copied!"
        : revealed
        ? address
        : short}
    </span>
  );
}