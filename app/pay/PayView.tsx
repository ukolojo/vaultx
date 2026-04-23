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
import dynamic from "next/dynamic";

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
    if (!to) return;
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
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start px-4 py-8 sm:py-12">
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white text-sm font-medium tracking-wide">
            Transaction Successful
          </span>
        </div>
      )}

      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Navbar */}
        <nav className="w-full sticky top-0 z-40 backdrop-blur-md border-b border-white/10 bg-white/5">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-white font-semibold tracking-tight text-lg">
              VaultX
            </span>
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="text-xs hover:opacity-70 text-white/40 transition-opacity"
              >
                Admin
              </Link>
              <Link
                href="/"
                className="text-xs hover:opacity-70 text-white/40 transition-opacity"
              >
                Home
              </Link>
            </div>
          </div>
        </nav>

        {!paramsValid && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white/60 text-sm">
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
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-5">
              {/* Payment info */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                  Payment
                </p>
                <p className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
                  {name}
                </p>
                <p className="text-white text-3xl sm:text-4xl font-bold mt-1">
                  {amountSol} SOL
                </p>
                {rateLoading && (
                  <p className="text-white/30 text-xs animate-pulse mt-1">
                    Fetching live rate...
                  </p>
                )}
                {!rateLoading && ngnValue !== null && (
                  <p className="text-white/40 text-sm sm:text-base mt-1">
                    ≈ ₦
                    {ngnValue.toLocaleString("en-NG", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
                {!rateLoading && ngnValue === null && (
                  <p className="text-red-400/50 text-xs mt-1">
                    Live rate unavailable
                  </p>
                )}
                <p className="text-white/30 text-xs mt-2 font-mono break-all">
                  To {destinationKey?.toBase58()}
                </p>
              </div>

              {/* Payment form or success */}
              {hasPaid ? (
                <div className="animate-fade-in flex flex-col items-center gap-5 py-4 text-center">
                  <div className="w-16 h-16 rounded-full border border-green-400/30 bg-green-400/10 flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.15)]">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(74,222,128,1)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-lg">
                      Payment Successful
                    </p>
                    <p className="text-white/40 text-sm">
                      Thank you, your payment has been recorded.
                    </p>
                  </div>
                  {paidTxDetails && (
                    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/40 text-xs">Matric</span>
                        <span className="text-white font-mono text-xs">
                          {paidTxDetails.matric}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/40 text-xs">Amount</span>
                        <span className="text-white text-xs font-medium">
                          {paidTxDetails.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/40 text-xs">Time</span>
                        <span className="text-white text-xs">
                          {new Date(
                            (paidTxDetails.timestamp + 3600) * 1000
                          ).toLocaleString("en-NG", {
                            timeZone: "Africa/Lagos",
                          })}
                        </span>
                      </div>
                      {!paidTxDetails.signature.startsWith("naira-") && (
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-white/40 text-xs">Tx</span>
                           <a
                             href={"https://explorer.solana.com/tx/" + paidTxDetails.signature + "?cluster=devnet"}
                             target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/50 hover:text-white text-xs font-mono underline underline-offset-2 transition-colors"
                          >
                            {paidTxDetails.signature.slice(0, 8)}…
                            <span className="ml-1 text-white/30">↗</span>
                          </a>
                        </div>
              )}
              </div>
                  )}
                  <p className="text-white/20 text-xs">
                    This window can now be closed.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* SELECTION */}
                  {paymentMode === "selection" && (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setPaymentMode("sol");
                          setConfirmStage("idle");
                        }}
                        className="w-full py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm sm:text-base font-medium hover:bg-white/15 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                      >
                        Pay with SOL
                      </button>
                      <button
                        onClick={() => {
                          setPaymentMode("naira");
                          setConfirmStage("idle");
                        }}
                        className="w-full py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm sm:text-base font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
                      >
                        Pay with Naira (Bank Transfer)
                      </button>
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
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 border border-white/10 bg-white/5 text-white placeholder:text-white/30 transition-colors"
                        placeholder="Enter your matriculation number"
                      />
                      {payError && (
                        <p className="text-red-400 text-xs">{payError}</p>
                      )}
                      <div className="flex justify-center">
                        <WalletMultiButton />
                      </div>
                      <button
                        type="button"
                        disabled={paying}
                        onClick={() => void handlePay()}
                        className="w-full py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm sm:text-base font-medium hover:bg-white/15 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {paying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing…
                          </span>
                        ) : (
                          "Pay with VaultX"
                        )}
                      </button>
                       <button
                          onClick={() => {
                            setPaymentMode("selection");
                            setConfirmStage("idle");
                          }}
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
                          <button
                            onClick={handleFetchBankDetails}
                            disabled={!matric.trim()}
                            className="w-full py-3 rounded-xl font-medium transition-all duration-200 border border-white/20 bg-white/10 text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Continue to Bank Transfer
                          </button>
                        </div>
                      ) : (
                        <div className="animate-fade-in flex flex-col gap-3">
                          <p className="text-white/40 text-xs text-center">
                            Transfer the exact amount below to complete your
                            payment
                          </p>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                              <span className="text-white/40 text-xs sm:text-sm shrink-0">Bank</span>
                              <span className="text-white text-xs sm:text-sm font-medium text-right break-all">
                                {bankDetails.bankName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                              <span className="text-white/40 text-xs sm:text-sm shrink-0">
                                Account Number
                              </span>
                              <span className="text-white font-mono text-xs sm:text-sm font-medium text-right break-all">
                                {bankDetails.accountNumber}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-3 gap-4">
                              <span className="text-white/40 text-xs sm:text-sm shrink-0">
                                Account Name
                              </span>
                              <span className="text-white text-xs sm:text-sm font-medium text-right break-all">
                                {bankDetails.accountName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 gap-4">
                              <span className="text-white/40 text-xs sm:text-sm shrink-0">
                                Reference
                              </span>
                              <span className="text-white font-mono text-xs sm:text-sm break-all text-right">
                                {bankDetails.reference}
                              </span>
                            </div>
                          </div>
                          <p className="text-white/20 text-xs text-center">
                            Naira to SOL conversion handled by Paj.cash. Rates
                            may vary.
                          </p>
                          <button
                            onClick={() => {
                              setConfirmStage("verified");
                              setShowSuccess(true);
                              setTimeout(() => setShowSuccess(false), 4000);
                              setHasPaid(true);
                              setPaidTxDetails({
                                signature: "naira-" + Date.now(),
                                matric,
                                amount: ngnValue
                                  ? "₦" +
                                    ngnValue.toLocaleString("en-NG", {
                                      maximumFractionDigits: 2,
                                    })
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

                            }}
                            className="w-full py-3 rounded-xl font-medium transition-all duration-200 border border-white/10 bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10"
                          >
                            I&apos;ve Paid
                          </button>
                        </div>
                      )}

                      {confirmStage === "confirming" && (
                        <div className="animate-fade-in mt-4 text-center space-y-3 px-2">
                          <div className="text-3xl sm:text-4xl font-mono text-white/80">{countdown}</div>
                          <p className="text-sm sm:text-base text-white/40">Checking for payment...</p>
                          <div className="w-full bg-white/5 rounded-full h-1 mt-2"></div>
                        </div>
                      )}
                      {confirmStage === "failed" && (
                        <div className="text-center flex flex-col gap-2">
                          <p className="text-red-400 text-sm">
                            Payment not detected in time.
                          </p>
                          <button
                            onClick={() => {
                              setConfirmStage("idle");
                            }}
                            className="text-xs hover:opacity-70 transition-colors underline underline-offset-2 text-white/40"
                          >
                            Try again
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setPaymentMode("selection");
                          setBankDetails(null);
                          setConfirmStage("idle");
                          setMatric("");
                          setPayError(null);
                        }}
                         className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors mt-3 w-full text-center py-2"
                       >
                         ← Back to payment options
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Glass Pocket */}
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-white/60 text-xs uppercase tracking-wider">
                  Glass Pocket — Live Ledger
                </h3>
              </div>

              {ledgerLoading && ledger.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-white/30 text-xs animate-pulse">
                    Loading transactions...
                  </p>
                </div>
              )}

              {!ledgerLoading && ledgerError && (
                <div className="px-4 py-6 text-center">
                  <p className="text-red-400/50 text-xs">
                    Could not load ledger. Retrying...
                  </p>
                </div>
              )}

              {!ledgerLoading && !ledgerError && ledger.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-white/20 text-xs">No transactions yet.</p>
                </div>
              )}

              {ledger.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-white/40 text-xs uppercase tracking-wider text-left px-4 py-3">
                          Matric
                        </th>
                        <th className="text-white/40 text-xs uppercase tracking-wider text-left px-4 py-3">
                          Time
                        </th>
                        <th className="text-white/40 text-xs uppercase tracking-wider text-left px-4 py-3">
                          Tx
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((entry) => (
                        <tr
                          key={entry.signature}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 text-white/80 font-mono text-xs sm:text-sm">
                            {entry.matric}
                            {entry.isNaira && (
                              <span className="text-white/30 text-xs ml-1">
                                ₦
                              </span>
                            )}
                          </td>
                          <td
                            className="px-4 py-3 text-white/50 text-xs sm:text-sm"
                            title={
                              entry.blockTime
                                ? new Date(entry.blockTime * 1000).toLocaleString("en-NG", {
                                    timeZone: "Africa/Lagos",
                                  })
                                : ""
                            }
                          >
                            {entry.blockTime ? timeAgo(entry.blockTime) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {entry.isNaira ? (
                              <span className="text-white/20 text-xs font-mono">
                                pending
                              </span>
                            ) : (
                               <a
                                 href={"https://explorer.solana.com/tx/" + entry.signature + "?cluster=devnet"}
                                 target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/40 hover:text-white text-xs font-mono underline underline-offset-2 transition-colors duration-150"
                              >
                                <span className="hidden sm:inline">
                                  {entry.signature.slice(0, 8)}…
                                </span>
                                <span className="sm:hidden">
                                  {entry.signature.slice(0, 6)}…
                                </span>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <h3 className="text-white/60 text-xs uppercase tracking-wider mb-4 text-center">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-1">Generate Link</h4>
                  <p className="text-white/60 text-xs">
                    Admins create parameterized payment links or QR codes for specific collections.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-1">Connect & Pay</h4>
                  <p className="text-white/60 text-xs">
                    Students follow the link, connect a Solana wallet, and approve the pre-filled transaction.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-1">On-Chain Logging</h4>
                  <p className="text-white/60 text-xs">
                    Payments are recorded on Solana, tagged with a memo containing the matriculation number and purpose.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-1">Verify Transparency</h4>
                  <p className="text-white/60 text-xs">
                    Anyone can view the real-time vault balance and transaction history without a login.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="w-full max-w-md mx-auto mt-8 text-center">
          <div className="space-y-2 text-white/40 text-xs">
            <p>
              <strong>Non-Custodial:</strong> VaultX is a stateless gateway; we do not store private keys or bank details.
            </p>
            <p>
              <strong>Blockchain Finality:</strong> All transactions are immutable and cannot be reversed or deleted once confirmed.
            </p>
            <p>
              <strong>No Central Authority:</strong> The Solana blockchain serves as the sole, tamper-proof source of truth.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-md mx-auto mt-4 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
            <p className="text-white text-sm font-medium mb-1">
              VaultX v2 | A Glass Box for Campus Financials
            </p>
            <p className="text-white/60 text-xs">
              Academic Session 2024 / 2025 · Federal University Lokoja
            </p>
            <p className="text-white/40 text-xs italic mt-2">
              'Don't Trust, Verify.'
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}