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
    <div className="min-h-screen bg-black px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <nav className="w-full sticky top-0 z-40 backdrop-blur-xl border-b border-orange-500/20 bg-black/90">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-base font-semibold text-white">
              VaultX
            </span>
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white/60 transition-colors duration-200"
            >
              Home →
            </Link>
          </div>
        </nav>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col gap-6"
        >
          <label className="block gap-4">
            <span className="text-sm font-medium text-white/50">
              Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border border-gray-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
              placeholder="e.g. Spring semester fee"
            />
          </label>
          <label className="block gap-4">
            <span className="text-sm font-medium text-white/50">
              SOL amount
            </span>
            <input
              required
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 border border-gray-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
              placeholder="0.1"
            />
            {adminNgn != null && (
              <p className="text-white/50 text-xs">
                ≈ ₦{Math.round(adminNgn).toLocaleString("en-NG")}
              </p>
            )}
          </label>
          <label className="block gap-4">
            <span className="text-sm font-medium text-white/50">
              Destination wallet
            </span>
            <input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-gray-700 border border-gray-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 font-mono text-xs focus:shadow-[0_0_20px_rgba(255,107,53,0.1)]"
              placeholder="Solana address (devnet)"
            />
          </label>
          <label className="block gap-4">
            <span className="text-sm font-medium text-white/50">
              Onramp Recipient Wallet
            </span>
            <input
              value={onrampRecipient}
              onChange={(e) => setOnrampRecipient(e.target.value)}
              className="bg-gray-700 border border-gray-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 font-mono text-xs focus:shadow-[0_0_20px_rgba(255,107,53,0.1)]"
              placeholder="Solana address for onramp SOL"
            />
            <button
              type="button"
              onClick={saveOnrampRecipient}
              className="px-6 py-3 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-200 mt-2"
            >
              Save Onramp Recipient
            </button>
          </label>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-200"
          >
            Generate link
          </button>
        </form>

        {generatedPath && (
          <div className="w-full rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-xl p-5 gap-4">
            <div className="flex items-center gap-4 text-white/50">
              <Link2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                Shareable URL
              </span>
            </div>
            <p className="break-all font-mono text-xs text-white">
              {fullShareUrl || generatedPath}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={copyUrl}
                className="px-6 py-3 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-200 inline-flex items-center gap-4 px-4 py-2 text-sm"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            </div>
            <p className="text-xs text-white/25">
              Path format:{" "}
              <code className="text-white/50 text-xs">
                /pay?to=[WALLET]&amp;amt=[AMOUNT]&amp;name=[TITLE]
              </code>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="w-full border-t border-orange-500/10 px-6 py-8">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs">
              VaultX · Academic Session 2024/2025
            </p>
            <p className="text-white/25 text-xs">
              Federal University Lokoja · Dept. of Computer Science
            </p>
            <p className="text-white/60 text-xs italic">
              Don&apos;t trust — verify
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
