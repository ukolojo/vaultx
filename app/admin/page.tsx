"use client";

// import { useSolPrice } from "../../hooks/useSolPrice";
import { Copy, Link2, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const inputClass = "w-full rounded-xl px-4 py-3 text-sm outline-none border border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus:border-[#FF6B35]/40 focus:shadow-[0_0_0_3px_rgba(255,107,53,0.08)] transition-all duration-200";

export default function AdminPage() {
  // const { getNairaEquivalent } = useSolPrice();
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

  // const adminNgn = useMemo(() => {
  //   const n = parseFloat(amount);
  //   if (!Number.isFinite(n) || n <= 0) return null;
  //   return getNairaEquivalent(n);
  // }, [amount, getNairaEquivalent]);

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
    <div className="min-h-screen bg-black/0 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">

        {/* Navbar */}
        <motion.nav
          className="w-full sticky top-0 z-40 bg-white/[0.04]
            backdrop-blur-2xl border-b border-white/[0.08]
            hover:bg-white/[0.06] transition-all duration-300"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="max-w-md mx-auto px-4 py-4 flex
            items-center justify-between">
            <Link href="/" className="group">
              <span className="text-white font-bold tracking-tight
                text-lg group-hover:text-white/90 transition-colors duration-200">
                Vault<span className="text-[#FF6B35] group-hover:text-[#FF6B35]/80">X</span>
              </span>
            </Link>
            <Link href="/"
              className="text-xs text-white/40 hover:text-[#FF6B35]
              hover:bg-[#FF6B35]/10 px-3 py-1.5 rounded-lg
              transition-all duration-200
              hover:shadow-[0_0_10px_rgba(255,107,53,0.2)]">
              Home →
            </Link>
          </div>
        </motion.nav>

        {/* Admin title */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium
            text-[#FF6B35]/50 mb-1">
            Admin Dashboard
          </p>
          <p className="text-white/25 text-xs">
            Generate payment links for your collection
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0
            bg-gradient-to-br from-[#FF6B35]/[0.03]
            via-transparent to-transparent rounded-2xl" />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-white/40
              uppercase tracking-[0.2em]">
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
            <label className="text-[10px] text-white/40
              uppercase tracking-[0.2em]">
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
            {/* {adminNgn != null && (
              <p className="text-white/40 text-xs">
                ≈ ₦{Math.round(adminNgn).toLocaleString("en-NG")}
              </p>
            )} */}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-white/40
              uppercase tracking-[0.2em]">
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
            <label className="text-[10px] text-white/40
              uppercase tracking-[0.2em]">
              Onramp Recipient Wallet
            </label>
            <input
              value={onrampRecipient}
              onChange={e => setOnrampRecipient(e.target.value)}
              className={inputClass + " font-mono"}
              placeholder="Solana address for onramp SOL"
            />
            <motion.button
              type="button"
              onClick={saveOnrampRecipient}
              className="w-full py-2.5 rounded-xl text-xs font-medium
                border border-white/[0.08] text-white/40
                hover:border-white/15 hover:text-white
                transition-all duration-200 mt-1"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Save Onramp Recipient
            </motion.button>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-semibold
              bg-[#FF6B35]/10 border border-[#FF6B35]/30
              text-[#FF6B35] hover:bg-[#FF6B35]/20
              hover:border-[#FF6B35]/50
              hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
              transition-all duration-200 mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Generate Link
          </motion.button>
        </form>

        {/* Generated URL */}
        {generatedPath && (
          <motion.div
            className="w-full rounded-2xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.03] backdrop-blur-2xl p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          >
            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 text-white/40" />
              <span className="text-xs text-white/40 uppercase
                tracking-wider">
                Shareable URL
              </span>
            </div>
            <p className="break-all font-mono text-xs text-[#FF6B35]/80
              leading-relaxed">
              {fullShareUrl || generatedPath}
            </p>
            <motion.button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-2
                w-full justify-center py-3 rounded-xl text-sm
                font-semibold bg-[#FF6B35]/10 border border-[#FF6B35]/30
                text-[#FF6B35] hover:bg-[#FF6B35]/20
                hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
                transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </motion.button>
            <p className="text-xs text-white/20">
              Format:{" "}
              <code className="text-white/40 text-xs">
                /pay?to=[WALLET]&amp;amt=[AMOUNT]&amp;name=[TITLE]
              </code>
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="border-t border-white/[0.05] px-2 py-6">
          <div className="flex flex-col sm:flex-row items-center
            justify-between gap-3">
            <span className="text-white font-bold text-sm">
              Vault<span className="text-[#FF6B35]">X</span>
            </span>
            <p className="text-white/20 text-xs">
              Federal University Lokoja · 2024/25
            </p>
            <p className="text-[#FF6B35]/30 text-xs italic">
              Don&apos;t trust — verify
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}