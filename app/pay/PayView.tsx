"use client";

import { createMemoInstruction } from "@solana/spl-memo";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import TiltCard from "@/components/TiltCard";


const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

type PaymentMode = "selection" | "sol" | "naira";



type LedgerEntry = {
  signature: string;
  matric: string;
  blockTime: number | null;
  isNaira?: boolean;
};

function timeAgo(blockTime: number): string {
  const nowSecs = Math.floor(Date.now() / 1000);
  const diffSecs = nowSecs - blockTime;
  if (diffSecs < 0 || diffSecs < 60) return "Just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return diffMins + "m ago";
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return diffHours + "h ago";
  return new Date(blockTime * 1000).toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const initiatePajPayment = async () => {
  return {
    accountNumber: "0123456789",
    bankName: "GTBank",
    accountName: "PAJ Cash Ltd",
    reference:
      "VAULTX-" +
      Math.random().toString(36).substr(2, 9).toUpperCase(),
  };
};

export default function PayView() {
  const searchParams = useSearchParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const to = searchParams.get("to") ?? "";
  const amt = searchParams.get("amt") ?? "";
  const name = searchParams.get("name") ?? "";

  const destinationKey = useMemo(() => {
    if (!to) return null;
    try {
      return new PublicKey(to.trim());
    } catch {
      return null;
    }
  }, [to]);

  const paramsValid = destinationKey && !!amt && !!name;

  const amountSol = useMemo(() => {
    const n = parseFloat(amt);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [amt]);

  const [rateLoading, setRateLoading] = useState(false);
  const [ngnValue, setNgnValue] = useState<number | null>(null);
  const [matric, setMatric] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paidTxDetails, setPaidTxDetails] = useState<{
    signature: string;
    matric: string;
    amount: string;
    timestamp: number;
  } | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [ledgerError, setLedgerError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("selection");
  const [bankDetails, setBankDetails] = useState<{
    accountNumber: string;
    bankName: string;
    accountName: string;
    reference: string;
  } | null>(null);
  const [confirmStage, setConfirmStage] = useState<"idle" | "confirming" | "verified" | "failed">("idle");
  const [countdown] = useState(0);
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);


  const fetchNgnRate = useCallback(async (solAmount: number) => {
    setRateLoading(true);
    try {
      const cgRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        {
          cache: "no-store",
          headers: { "Accept": "application/json" }
        }
      );
      if (!cgRes.ok) throw new Error("CoinGecko fetch failed");
      const cgData = await cgRes.json();
      const solInUsd: number = cgData?.solana?.usd ?? 0;
      if (solInUsd === 0) throw new Error("SOL price returned 0");

      const fxRes = await fetch("https://open.er-api.com/v6/latest/USD", {
        cache: "no-store",
      });
      if (!fxRes.ok) throw new Error("FX fetch failed");
      const fxData = await fxRes.json()
      const usdToNgn: number = fxData?.rates?.NGN ?? 0;
      if (usdToNgn === 0) throw new Error("NGN rate returned 0");

      setNgnValue(solAmount * solInUsd * usdToNgn);
    } catch (err) {
      console.error("NGN rate fetch failed:", err);
      setNgnValue(null);
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => {
    const parsed = parseFloat(amt ?? "0");
    if (!isNaN(parsed) && parsed > 0) {
      fetchNgnRate(parsed);
    } else {
      setNgnValue(null);
    }
   }, [amt, fetchNgnRate]);

   const handleFetchBankDetails = useCallback(async () => {
    if (!matric.trim()) {
      setPayError("Please enter your matriculation number");
      return;
    }
    try {
      const result = await initiatePajPayment();
      setBankDetails({
        accountNumber: result.accountNumber,
        bankName: result.bankName,
        accountName: result.accountName,
        reference: result.reference,
      });
     } catch {
       setPaymentMode("selection");
       setPayError("Could not fetch bank details. Try again.");
     }
   }, [matric]);

  const fetchLedger = useCallback(async () => {
    if (!to || !name) return;
    setLedgerLoading(true);
    try {
      setLedgerError(false);
      const pubkey = new PublicKey(to);

      const sigs = await connection.getSignaturesForAddress(pubkey, {
        limit: 20,
      });

      if (sigs.length === 0) {
        setLedger(prev => prev.filter(e => e.isNaira));
        return;
      }

      const entries: LedgerEntry[] = [];

      // Fetch all transactions in parallel
      const txResults = await Promise.allSettled(
        sigs.map(sig =>
          connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
            commitment: "confirmed",
          })
        )
      );

      for (let i = 0; i < sigs.length; i++) {
        const sig = sigs[i];
        const result = txResults[i];

        // Fast path — use memo field on signature if available
        if (sig.memo) {
          const clean = sig.memo.replace(/^"|"$/g, "").trim();
          const memos = clean.split(" ; ").map(m => m.trim());
          const vaultxMemo = memos.find(m => m.startsWith("VaultX"));
          if (vaultxMemo) {
            const parts = vaultxMemo.split("|");
            if (
              parts.length >= 3 &&
              parts[0].trim() === "VaultX" &&
              parts[1].trim() === name.trim()
            ) {
              entries.push({
                signature: sig.signature,
                matric: parts[2].trim(),
                blockTime: sig.blockTime ?? null,
              });
              continue;
            }
          }
        }

        // Slow path — parse full transaction
        if (result.status === "rejected" || !result.value) continue;
        const tx = result.value;
        const hits: string[] = [];

        const tryIx = (ix: any) => {
          if (
            "program" in ix &&
            ix.program === "spl-memo" &&
            ix.parsed &&
            typeof ix.parsed === "object"
          ) {
            const p = ix.parsed as {
              type?: string;
              info?: { memo?: string };
            };
            if (
              p.type === "memo" &&
              typeof p.info?.memo === "string"
            ) {
              hits.push(p.info.memo);
            }
          }
        };

        for (const ix of tx.transaction.message.instructions) {
          tryIx(ix);
        }
        for (const group of tx.meta?.innerInstructions ?? []) {
          for (const ix of group.instructions) {
            tryIx(ix);
          }
        }
        for (const line of tx.meta?.logMessages ?? []) {
          const memoQuoted = line.match(/Memo \(len \d+\): "(.*)"/);
          if (memoQuoted?.[1]) hits.push(memoQuoted[1]);
          if (line.includes("Program log: ")) {
            const after = line.split("Program log: ").pop();
            if (after?.startsWith("VaultX")) hits.push(after);
          }
        }

        const memo = hits.find(m => m.startsWith("VaultX")) ?? null;
        if (!memo) continue;

        const parts = memo.split("|");
        if (parts.length < 3) continue;
        if (parts[0].trim() !== "VaultX") continue;
        if (parts[1].trim() !== name.trim()) continue;

        entries.push({
          signature: sig.signature,
          matric: parts[2].trim(),
          blockTime: sig.blockTime ?? null,
        });
      }

      setLedger(prev => {
        if (entries.length === 0) return prev;
        const nairaEntries = prev.filter(e => e.isNaira);
        const sigSet = new Set(entries.map(e => e.signature));
        const uniqueNaira = nairaEntries.filter(
          e => !sigSet.has(e.signature)
        );
        const seen = new Set<string>();
        return [...entries, ...uniqueNaira].filter(e => {
          if (seen.has(e.signature)) return false;
          seen.add(e.signature);
          return true;
        });
      });

    } catch (err) {
      console.error("Ledger fetch error:", err);
      setLedgerError(true);
    } finally {
      setLedgerLoading(false);
    }
  }, [to, name, connection]);

  useEffect(() => {
    fetchLedger();
    const interval = setInterval(fetchLedger, 10000);
    return () => clearInterval(interval);
  }, [fetchLedger]);

  useEffect(() => {
    if (!destinationKey) return
    connection.getBalance(destinationKey).then(lamports => {
      setVaultBalance(lamports / LAMPORTS_PER_SOL)
    }).catch(() => setVaultBalance(null))
  }, [destinationKey, connection]);

  async function handlePay() {
    if (!publicKey) {
      setPayError("Please connect your wallet to pay.");
      return;
    }
    if (!destinationKey) {
      setPayError("Invalid payment destination.");
      return;
    }
    if (!amountSol) {
      setPayError("Invalid payment amount.");
      return;
    }
    if (!matric.trim()) {
      setPayError("Please enter your matriculation number");
      return;
    }
    setPaying(true);
    setPayError(null);
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destinationKey,
          lamports: Math.round(amountSol * LAMPORTS_PER_SOL),
        }),
        createMemoInstruction("VaultX|" + name + "|" + matric, [publicKey])
      );
      const sig = await sendTransaction(tx, connection);
      setHasPaid(true);
      setPaidTxDetails({
        signature: sig,
        matric,
        amount: amountSol + " SOL",
        timestamp: Math.floor(Date.now() / 1000),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err: unknown) {
      console.error("Payment error:", err);
      setPayError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
     } finally {
       setPaying(false);
     }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 relative overflow-hidden">

      {/* Background glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute top-[-10%] right-[-5%]
            w-[350px] h-[350px] rounded-full
            bg-[#FF6B35]/[0.04] blur-[100px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: -1, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-5%]
            w-[250px] h-[250px] rounded-full
            bg-[#FF6B35]/[0.03] blur-[80px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>

      {/* Success toast */}
      {showSuccess && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#FF6B35]/20 bg-[#FF6B35]/[0.08] backdrop-blur-xl shadow-[0_0_30px_rgba(255,107,53,0.15)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="text-white text-sm font-medium tracking-wide">
            Transaction Successful
          </span>
        </motion.div>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col gap-6 relative z-10">

        {/* Navbar */}
        <motion.nav
          className="w-full sticky top-0 z-40 bg-white/[0.04]
            backdrop-blur-2xl border-b border-white/[0.08]
            hover:bg-white/[0.06] transition-all duration-300"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="group">
              <span className="text-white font-semibold tracking-tight
                text-lg group-hover:text-white/90 transition-colors duration-200">
                Vault<span className="text-[#FF6B35] group-hover:text-[#FF6B35]/80">X</span>
              </span>
            </Link>
            <div className="flex gap-4">
              <Link href="/admin" className="text-xs text-white/40
                hover:text-[#FF6B35] hover:bg-[#FF6B35]/10
                px-3 py-1.5 rounded-lg transition-all duration-200
                hover:shadow-[0_0_10px_rgba(255,107,53,0.2)]">
                Admin
              </Link>
              <Link href="/" className="text-xs text-white/40
                hover:text-[#FF6B35] hover:bg-[#FF6B35]/10
                px-3 py-1.5 rounded-lg transition-all duration-200
                hover:shadow-[0_0_10px_rgba(255,107,53,0.2)]">
                Home
              </Link>
            </div>
          </div>
        </motion.nav>

        {!paramsValid && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 text-white/60 text-sm">
            This page needs valid query parameters:{" "}
            <code className="text-white">to, amt, name</code>. Use the{" "}
            <Link href="/admin" className="underline text-white/80">
              admin dashboard
            </Link>{" "}
            to generate a link.
          </div>
        )}

        {paramsValid && (
          <>
            {/* Main Glass Card */}
            <TiltCard className="w-full">
              <motion.div
                className="glow-border glass-edge glass-depth rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 flex flex-col gap-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              >
              {/* Inner sheen */}
              <div className="pointer-events-none absolute inset-0
                bg-gradient-to-br from-[#FF6B35]/[0.04]
                via-transparent to-transparent rounded-2xl" />

              {/* Payment info */}
              <div className="relative z-10">
                <p className="text-sm font-semibold tracking-tight mb-1">
                  Payment
                </p>
                <p className="text-white text-xl sm:text-2xl font-semibold tracking-tight"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
                  {name}
                </p>
                <p className="text-white text-3xl sm:text-4xl font-bold mt-1"
                  style={{ textShadow: '0 0 20px rgba(255,255,255,0.15)' }}>
                  {amountSol} SOL
                </p>
                {rateLoading && (
                  <p className="text-white/30 text-xs animate-pulse mt-1">
                    Fetching live rate...
                  </p>
                )}
                {!rateLoading && ngnValue !== null && (
                  <p className="text-[#FF6B35]/70 text-sm sm:text-base mt-1">
                    ≈ ₦{ngnValue.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
                  </p>
                )}
                {!rateLoading && ngnValue === null && (
                  <p className="text-red-400/50 text-xs mt-1">
                    Live rate unavailable
                  </p>
                )}
                <p className="text-white/25 font-mono text-sm mt-2 break-all">
                  To {destinationKey?.toBase58()}
                </p>
                <p className="text-[#FF6B35]/30 text-xs mt-1
                  tracking-widest uppercase">
                  Don&apos;t trust — verify
                </p>
              </div>

              {/* Payment form or success */}
              <div className="relative z-10">
                {hasPaid ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center gap-5 py-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full border border-green-400/30 bg-green-400/10 flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.15),inset_0_1px_0_rgba(74,222,128,0.2)]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-semibold text-lg">Payment Successful</p>
                      <p className="text-white/40 text-sm">Thank you, your payment has been recorded.</p>
                    </div>
                    {paidTxDetails && (
                      <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 space-y-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-white/40 text-xs">Matric</span>
                          <span className="text-white font-mono text-xs">{paidTxDetails.matric}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-white/40 text-xs">Amount</span>
                          <span className="text-white text-xs font-medium">{paidTxDetails.amount}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-white/40 text-xs">Time</span>
                          <span className="text-white text-xs">
                            {new Date(paidTxDetails.timestamp * 1000).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}
                          </span>
                        </div>
                        {!paidTxDetails.signature.startsWith("naira-") && (
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-white/40 text-xs">Tx</span>

                              <Link
                                href={"https://explorer.solana.com/tx/" + paidTxDetails.signature + "?cluster=devnet"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/50 hover:text-white text-xs font-mono underline underline-offset-2 transition-colors"
                              >
                                {paidTxDetails.signature.slice(0, 8)}…
                                <span className="ml-1 text-white/30">↗</span>
                              </Link>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-white/20 text-xs">This window can now be closed.</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3">

                    {/* SELECTION */}
                    {paymentMode === "selection" && (
                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          onClick={() => { setPaymentMode("sol"); setConfirmStage("idle"); setHasAddedEntry(false); }}
                          className="btn-shimmer w-full py-3 sm:py-4 rounded-xl
                            bg-[#FF6B35]/10 border border-[#FF6B35]/30
                            text-[#FF6B35] text-sm sm:text-base font-semibold
                            hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50
                            hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
                            transition-all duration-200"
                        >
                          Pay with SOL
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          onClick={() => { setPaymentMode("naira"); setConfirmStage("idle"); setHasAddedEntry(false); }}
                          className="btn-shimmer w-full py-3 sm:py-4 rounded-xl
                            bg-white/[0.06] border border-white/[0.10]
                            text-white/60 text-sm sm:text-base font-medium
                            hover:bg-white/[0.10] hover:text-white hover:border-white/20
                            transition-all duration-200"
                        >
                          Pay with Naira (Bank Transfer)
                        </motion.button>
                      </div>
                    )}

                    {/* SOL MODE */}
                    {paymentMode === "sol" && (
                      <div className="flex flex-col gap-3">
                        <label className="text-white/40 text-xs uppercase tracking-wider">
                          Matriculation Number
                        </label>
                        <input
                          required
                          value={matric}
                          onChange={(e) => setMatric(e.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-sm
                            outline-none border border-white/[0.08]
                            bg-white/[0.04] text-white
                            placeholder:text-white/25
                            focus:border-[#FF6B35]/40
                            focus:shadow-[0_0_0_3px_rgba(255,107,53,0.08)]
                            transition-all duration-200"
                          placeholder="Enter your matriculation number"
                        />
                        {payError && (
                          <p className="text-red-400 text-xs">{payError}</p>
                        )}
                        <div className="flex justify-center">
                          <WalletMultiButton />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          type="button"
                          disabled={paying}
                          onClick={() => void handlePay()}
                          className="btn-shimmer w-full py-3 sm:py-4 rounded-xl
                            bg-[#FF6B35]/10 border border-[#FF6B35]/30
                            text-[#FF6B35] text-sm sm:text-base font-semibold
                            hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50
                            hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
                            transition-all duration-200
                            shadow-[0_0_20px_rgba(255,107,53,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {paying ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing…
                            </span>
                          ) : (
                            "Pay with VaultX"
                          )}
                        </motion.button>
                        <button
                          onClick={() => { setPaymentMode("selection"); setConfirmStage("idle"); setHasAddedEntry(false); }}
                          className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors mt-3 w-full text-center py-2"
                        >
                          ← Back
                        </button>
                      </div>
                    )}

                    {/* NAIRA MODE */}
                    {paymentMode === "naira" && (
                      <div className="flex flex-col gap-3">
                        {bankDetails === null ? (
                          <div className="animate-fade-in flex flex-col gap-3">
                            <label className="text-white/40 text-xs uppercase tracking-wider">
                              Matriculation Number
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your matriculation number"
                              value={matric}
                              onChange={(e) => setMatric(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors duration-200"
                            />
                            {payError && (
                              <p className="text-red-400 text-xs">{payError}</p>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              onClick={handleFetchBankDetails}
                              disabled={!matric.trim()}
                              className="w-full py-3 rounded-xl font-semibold
                                transition-all duration-200
                                bg-[#FF6B35]/10 border border-[#FF6B35]/30
                                text-[#FF6B35] hover:bg-[#FF6B35]/20
                                hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
                                disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Continue to Bank Transfer
                            </motion.button>
                          </div>
                        ) : (
                          <div className="animate-fade-in flex flex-col gap-3">
                            <p className="text-white/40 text-xs text-center">
                              Transfer the exact amount below to complete your payment
                            </p>
                            <div className="rounded-xl border border-[#FF6B35]/10
                              bg-[#FF6B35]/[0.03] backdrop-blur-xl p-4 space-y-3
                              shadow-[inset_0_1px_0_rgba(255,107,53,0.05)]">
                              <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                                <span className="text-white/40 text-xs sm:text-sm shrink-0">Bank</span>
                                <span className="text-white text-xs sm:text-sm font-medium text-right break-all">{bankDetails.bankName}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                                <span className="text-white/40 text-xs sm:text-sm shrink-0">Account Number</span>
                                <span className="text-white font-mono text-xs sm:text-sm font-medium text-right break-all">{bankDetails.accountNumber}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                                <span className="text-white/40 text-xs sm:text-sm shrink-0">Account Name</span>
                                <span className="text-white text-xs sm:text-sm font-medium text-right break-all">{bankDetails.accountName}</span>
                              </div>
                              <div className="flex justify-between items-center py-3 gap-4">
                                <span className="text-white/40 text-xs sm:text-sm shrink-0">Reference</span>
                                <span className="text-white font-mono text-xs sm:text-sm break-all text-right">{bankDetails.reference}</span>
                              </div>
                            </div>
                            <p className="text-white/20 text-xs text-center">
                              Naira to SOL conversion handled by Paj.cash. Rates may vary.
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              onClick={() => {
                                setConfirmStage("verified");
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 4000);
                                setHasPaid(true);
                                setPaidTxDetails({
                                  signature: "naira-" + Date.now(),
                                  matric,
                                  amount: ngnValue
                                    ? "₦" + ngnValue.toLocaleString("en-NG", { maximumFractionDigits: 2 })
                                    : amt ?? "0",
                                  timestamp: Math.floor(Date.now() / 1000),
                                });
                                const localEntry: LedgerEntry = {
                                  signature: "naira-" + Date.now(),
                                  matric,
                                  blockTime: Math.floor(Date.now() / 1000),
                                  isNaira: true,
                                };
                                setLedger((prev) => [localEntry, ...prev]);
                                setHasAddedEntry(true);
                              }}
                              className="btn-shimmer w-full py-3 rounded-xl font-semibold
                                transition-all duration-200 border border-[#FF6B35]/30
                                bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20
                                hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]"
                            >
                              I&apos;ve Paid
                            </motion.button>
                          </div>
                        )}

                        <button
                          onClick={() => { setPaymentMode("selection"); setBankDetails(null); setConfirmStage("idle"); setHasAddedEntry(false); setMatric(""); setPayError(null); }}
                          className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors mt-2 w-full text-center py-2"
                        >
                          ← Back to payment options
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </motion.div>
            </TiltCard>

            {/* Glass Pocket */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="glow-border glass-edge glass-depth w-full rounded-2xl border border-white/[0.08]
                bg-white/[0.04] backdrop-blur-2xl saturate-150
                overflow-hidden relative"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-50 rounded-2xl" />
              <div className="relative z-10">
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white/60 text-xs uppercase tracking-wider">
                      Glass Pocket
                    </h3>
                    <span className="text-[#FF6B35]/50 text-xs font-mono">
                      {ledger.filter(e => !e.isNaira).length} verified{" "}
                      {ledger.filter(e => !e.isNaira).length === 1 ? "payment" : "payments"}
                    </span>
                  </div>
                </div>

                {ledger.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px] text-sm">
                      <tbody>
                        {ledger.map((entry, index) => (
                          <motion.tr
                            key={entry.signature}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={
                              "border-b border-white/5 transition-colors duration-150 " +
                              (index === 0 ? "new-entry" : "hover:bg-white/5")
                            }
                          >
                            <td className="px-4 py-3 text-white/80 font-mono text-xs sm:text-sm">
                              {entry.matric}
                              {entry.isNaira && (
                                <span className="text-white/30 text-xs ml-1">₦</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {entry.isNaira ? (
                                <span className="text-white/20 text-xs font-mono">pending</span>
                              ) : (
                                <Link
                                  href={"https://explorer.solana.com/tx/" + entry.signature + "?cluster=devnet"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#FF6B35]/50 hover:text-[#FF6B35]
                                    text-xs font-mono underline underline-offset-2
                                    transition-colors duration-150"
                                >
                                  <span className="hidden sm:inline">{entry.signature.slice(0, 8)}…</span>
                                  <span className="sm:hidden">{entry.signature.slice(0, 6)}…</span>
                                </Link>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Vault Balance */}
            {vaultBalance !== null && (
              <motion.div
                className="flex items-center justify-between rounded-xl
                  border border-[#FF6B35]/15 bg-[#FF6B35]/[0.04]
                  backdrop-blur-xl px-4 py-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
              >
                <span className="text-[#FF6B35]/50 text-xs uppercase tracking-wider">Vault Balance</span>
                <span className="text-[#FF6B35] font-mono text-sm font-bold">
                  {vaultBalance.toFixed(4)} SOL
                </span>
              </motion.div>
            )}

            {/* Footer */}
            <p className="text-[#FF6B35]/20 text-xs text-center pb-4">
              Powered by Solana · Built at Federal University Lokoja
            </p>
          </>
        )}
      </div>
    </div>
  );
}