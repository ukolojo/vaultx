"use client";

import { useSolPrice } from "@/hooks/useSolPrice";
import { Copy, Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { brand } from "@/lib/brand";

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
            <span className={`${brand.typography.heading4} ${brand.colors.textPrimary}`}>
              VaultX
            </span>
            <Link
              href="/"
              className={`text-xs ${brand.colors.primaryText} hover:${brand.colors.primaryTextHover} transition-colors duration-200`}
            >
              Home →
            </Link>
          </div>
        </nav>

        <form
          onSubmit={handleSubmit}
          className={`w-full ${brand.components.cardSecondary} ${brand.spacing.cardPadding} flex flex-col ${brand.spacing.stackGap}`}
        >
          <label className={`block ${brand.spacing.inlineGapSmall}`}>
            <span className={`${brand.typography.label} ${brand.colors.textSecondary}`}>
              Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={brand.components.inputSecondary}
              placeholder="e.g. Spring semester fee"
            />
          </label>
          <label className={`block ${brand.spacing.inlineGapSmall}`}>
            <span className={`${brand.typography.label} ${brand.colors.textSecondary}`}>
              SOL amount
            </span>
            <input
              required
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={brand.components.inputSecondary}
              placeholder="0.1"
            />
            {adminNgn != null && (
              <p className={`${brand.colors.textSecondary} ${brand.typography.caption}`}>
                ≈ ₦{Math.round(adminNgn).toLocaleString("en-NG")}
              </p>
            )}
          </label>
          <label className={`block ${brand.spacing.inlineGapSmall}`}>
            <span className={`${brand.typography.label} ${brand.colors.textSecondary}`}>
              Destination wallet
            </span>
            <input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`${brand.components.inputSecondary} font-mono text-xs focus:shadow-[0_0_20px_rgba(255,107,53,0.1)]`}
              placeholder="Solana address (devnet)"
            />
          </label>
          <label className={`block ${brand.spacing.inlineGapSmall}`}>
            <span className={`${brand.typography.label} ${brand.colors.textSecondary}`}>
              Onramp Recipient Wallet
            </span>
            <input
              value={onrampRecipient}
              onChange={(e) => setOnrampRecipient(e.target.value)}
              className={`${brand.components.inputSecondary} font-mono text-xs focus:shadow-[0_0_20px_rgba(255,107,53,0.1)]`}
              placeholder="Solana address for onramp SOL"
            />
            <button
              type="button"
              onClick={saveOnrampRecipient}
              className={`${brand.components.buttonPrimary} mt-2`}
            >
              Save Onramp Recipient
            </button>
          </label>
          <button
            type="submit"
            className={brand.components.buttonPrimary}
          >
            Generate link
          </button>
        </form>

        {generatedPath && (
          <div className={`w-full ${brand.components.cardSecondary} ${brand.spacing.cardPaddingSmall} ${brand.spacing.inlineGapSmall}`}>
            <div className={`flex items-center ${brand.spacing.inlineGapSmall} ${brand.colors.textSecondary}`}>
              <Link2 className="h-4 w-4" />
              <span className={brand.typography.label}>
                Shareable URL
              </span>
            </div>
            <p className={`break-all font-mono ${brand.typography.caption} ${brand.colors.textPrimary}`}>
              {fullShareUrl || generatedPath}
            </p>
            <div className={`flex flex-wrap ${brand.spacing.inlineGapSmall}`}>
              <button
                type="button"
                onClick={copyUrl}
                className={`${brand.components.buttonPrimary} inline-flex items-center ${brand.spacing.inlineGapSmall} px-4 py-2 text-sm`}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            </div>
            <p className={`${brand.typography.caption} ${brand.colors.textCaption}`}>
              Path format:{" "}
              <code className={`${brand.colors.textMuted} ${brand.typography.caption}`}>
                /pay?to=[WALLET]&amp;amt=[AMOUNT]&amp;name=[TITLE]
              </code>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="w-full border-t border-orange-500/10 px-6 py-8">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`${brand.colors.textCaption} ${brand.typography.caption}`}>
              VaultX · Academic Session 2024/2025
            </p>
            <p className={`${brand.colors.textCaption} ${brand.typography.caption}`}>
              Federal University Lokoja · Dept. of Computer Science
            </p>
            <p className={`${brand.colors.primaryTextHover} ${brand.typography.caption} italic`}>
              Don&apos;t trust — verify
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
