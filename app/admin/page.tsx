"use client";

import { useSolPrice } from "@/hooks/useSolPrice";
import { Copy, Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const { getNairaEquivalent } = useSolPrice();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [onrampRecipient, setOnrampRecipient] = useState("");
  const [generatedPath, setGeneratedPath] = useState("");
  const [fullShareUrl, setFullShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vaultx-onramp-recipient");
    if (saved) setOnrampRecipient(saved);
  }, []);

  const adminNgn = useMemo(() => {
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) return null;
    return getNairaEquivalent(n);
  }, [amount, getNairaEquivalent]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const path = `/pay?to=${encodeURIComponent(destination.trim())}&amt=${encodeURIComponent(amount.trim())}&name=${encodeURIComponent(title.trim())}`;
    setGeneratedPath(path);
    setFullShareUrl(
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path
    );
    setCopied(false);
  }

  function saveOnrampRecipient() {
    localStorage.setItem("vaultx-onramp-recipient", onrampRecipient.trim());
    alert("Onramp recipient saved!");
  }

  async function copyUrl() {
    if (!fullShareUrl) return;
    const full = fullShareUrl;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="min-h-screen text-vaultx-white px-4 py-12"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%,
            rgba(255,255,255,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%,
            rgba(255,255,255,0.02) 0%, transparent 50%),
          #000000
        `
      }}
    >
      <div className="mx-auto max-w-lg space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            VaultX
          </p>
          <h1 className="text-2xl font-medium tracking-tight">Admin</h1>
          <p className="text-sm text-white/60">
            Build a shareable payment link. Configuration lives only in the URL.
          </p>
        </header>

        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-white/80 text-sm uppercase tracking-[0.3em] font-medium">
            Admin Dashboard
          </h1>
          <p className="text-white/20 text-xs mt-1">
            Generate payment links for your collection
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="vaultx-glass vaultx-transition rounded-2xl p-6 space-y-5 shadow-none animate-fade-in-up"
        >
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50">
              Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-200"
              placeholder="e.g. Spring semester fee"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50">
              SOL amount
            </span>
            <input
              required
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-200"
              placeholder="0.1"
            />
            {adminNgn != null && (
              <p className="text-white/50 text-sm">
                ≈ ₦{Math.round(adminNgn).toLocaleString("en-NG")}
              </p>
            )}
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50">
              Destination wallet
            </span>
            <input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-mono text-xs outline-none border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-200"
              placeholder="Solana address (devnet)"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50">
              Onramp Recipient Wallet
            </span>
            <input
              value={onrampRecipient}
              onChange={(e) => setOnrampRecipient(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-mono text-xs outline-none border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-200"
              placeholder="Solana address for onramp SOL"
            />
            <button
              type="button"
              onClick={saveOnrampRecipient}
              className="vaultx-btn-primary vaultx-transition mt-2 w-full rounded-xl border border-white/15 bg-white/[0.08] py-2 text-sm font-medium text-white hover:bg-white/[0.12]"
            >
              Save Onramp Recipient
            </button>
          </label>
          <button
            type="submit"
            className="vaultx-btn-primary vaultx-transition w-full rounded-xl border border-white/15 bg-white/[0.08] py-3 text-sm font-medium text-white hover:bg-white/[0.12]"
          >
            Generate link
          </button>
        </form>

        {generatedPath && (
          <div className="vaultx-glass vaultx-transition rounded-2xl p-6 space-y-3 animate-pulse-glow">
            <div className="flex items-center gap-2 text-white/50">
              <Link2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Shareable URL
              </span>
            </div>
            <p className="break-all font-mono text-xs text-white/90">
              {fullShareUrl || generatedPath}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyUrl}
                className="vaultx-btn-primary vaultx-transition inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2 text-sm hover:bg-white/[0.12]"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            </div>
            <p className="text-[11px] text-white/40">
              Path format:{" "}
              <code className="text-white/60">
                /pay?to=[WALLET]&amp;amt=[AMOUNT]&amp;name=[TITLE]
              </code>
            </p>
          </div>
        )}

        <p className="text-center text-xs text-white/35">
          <Link
            href="/"
            className="vaultx-transition hover:text-white/60"
          >
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
