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
import { brand } from "@/lib/brand";

// framer-motion added for glassmorphism micro-interactions

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full rounded-2xl border border-white/10
      bg-white/5 backdrop-blur-2xl saturate-150
      shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
      p-6 sm:p-8 flex flex-col gap-5
      relative overflow-hidden"
    >
      Hello
    </motion.div>
  );
}