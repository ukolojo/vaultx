"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function BlockCounter() {
  const { connection } = useConnection();
  const [slot, setSlot] = useState<number | null>(null);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSlot() {
      try {
        const s = await connection.getSlot();
        if (!mounted) return;
        setPrev(p => p ?? s);
        setSlot(s);
      } catch {}
    }

    fetchSlot();
    const interval = setInterval(fetchSlot, 400);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [connection]);

  const isNew = slot !== prev;

  return (
    <div className="inline-flex items-center gap-3
      px-4 py-2.5 rounded-xl
      border border-white/[0.06] bg-white/[0.03]
      backdrop-blur-xl">
      <div className="flex flex-col items-start">
        <span className="text-[10px] text-white/25
          uppercase tracking-[0.2em]">
          Solana Block
        </span>
        <span
          className="text-sm font-mono font-bold
            text-[#FF6B35] tabular-nums"
          style={{
            transition: isNew
              ? 'color 0.1s ease'
              : 'none',
          }}
        >
          {slot !== null
            ? slot.toLocaleString()
            : "—"}
        </span>
      </div>
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#FF6B35',
          boxShadow: '0 0 8px rgba(255,107,53,0.8)',
          animation: 'orange-pulse 0.4s ease-out',
        }}
      />
    </div>
  );
}