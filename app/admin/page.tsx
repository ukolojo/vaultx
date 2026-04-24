"use client";

import { useSolPrice } from "@/hooks/useSolPrice";
import { Copy, Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const inputClass = "w-full rounded-xl px-4 py-3 text-sm " +
  "outline-none border border-white/10 bg-white/5 " +
  "text-white placeholder:text-white/25 " +
  "focus:border-white/20 focus:ring-1 focus:ring-white/10 " +
  "transition-all duration-200";

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
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path
    );
    setCopied(false);
  }

  function saveOnrampRecipient() {
    localStorage.setItem(
      "vaultx-onramp-recipient",
      onrampRecipient.trim()
    );
    alert("Onramp recipient saved!");
  }

  async function copyUrl() {
    if (!fullShareUrl) return;
    await navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">

        {/* Navbar */}
        <nav className="w-full sticky top-0 z-40 backdrop-blur-xl 
          border-b border-white/8 bg-black/80">
          <div className="max-w-md mx-auto px-4 py-4 flex 
            items-center justify-between">
            <span className="text-white font-semibold 
              tracking-tight text-lg">
              VaultX
            </span>
            <Link href="/"
              className="text-xs text-white/40 hover:text-white 
              transition-colors duration-200">
              Home →
            </Link>
          </div>
        </nav>

        {/* Admin title */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] 
            text-white/25">
            Admin Dashboard
          </p>
          <p className="text-white/20 text-xs mt-1">
            Generate payment links for your collection
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/10 
            bg-white/5 backdrop-blur-xl p-6 sm:p-8 
            flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40 
              uppercase tracking-wider">
              Payment Title
            </label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. CSC 300 Level Manual Fee"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40 
              uppercase tracking-wider">
              SOL Amount
            </label>
            <input
              required
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className={inputClass}
              placeholder="0.002"
            />
            {adminNgn != null && (
              <p className="text-white/40 text-xs">
                ≈ ₦{Math.round(adminNgn).toLocaleString("en-NG")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40 
              uppercase tracking-wider">
              Destination Wallet
            </label>
            <input
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className={inputClass + " font-mono"}
              placeholder="Solana address (devnet)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40 
              uppercase tracking-wider">
              Onramp Recipient Wallet
            </label>
            <input
              value={onrampRecipient}
              onChange={e => setOnrampRecipient(e.target.value)}
              className={inputClass + " font-mono"}
              placeholder="Solana address for onramp SOL"
            />
            <button
              type="button"
              onClick={saveOnrampRecipient}
              className="w-full py-2.5 rounded-xl text-xs 
                font-medium border border-white/8 
                text-white/40 hover:border-white/15 
                hover:text-white transition-all duration-200 mt-1"
            >
              Save Onramp Recipient
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm 
              font-medium bg-white/10 border border-white/20 
              text-white hover:bg-white/15 
              transition-all duration-200 mt-2"
          >
            Generate Link
          </button>
        </form>

        {/* Generated URL */}
        {generatedPath && (
          <div className="w-full rounded-2xl border border-white/10 
            bg-white/5 backdrop-blur-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 text-white/40" />
              <span className="text-xs text-white/40 uppercase 
                tracking-wider">
                Shareable URL
              </span>
            </div>
            <p className="break-all font-mono text-xs 
              text-white/80 leading-relaxed">
              {fullShareUrl || generatedPath}
            </p>
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-2 
                w-full justify-center py-3 rounded-xl text-sm 
                font-medium bg-white/10 border border-white/20 
                text-white hover:bg-white/15 
                transition-all duration-200"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <p className="text-xs text-white/20">
              Format:{" "}
              <code className="text-white/40 text-xs">
                /pay?to=[WALLET]&amp;amt=[AMOUNT]&amp;name=[TITLE]
              </code>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-white/5 px-2 py-6">
          <div className="flex flex-col sm:flex-row items-center 
            justify-between gap-3">
            <p className="text-white/20 text-xs">
              VaultX · 2024/2025
            </p>
            <p className="text-white/20 text-xs">
              Federal University Lokoja
            </p>
            <p className="text-white/10 text-xs italic">
              Don&apos;t trust — verify
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}