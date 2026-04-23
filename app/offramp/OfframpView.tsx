/* eslint-disable */
"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

// Mock PAJ SDK functions - in real implementation, import from paj_ramp
const initializeSDK = (env: string) => console.log("SDK initialized for", env);
const initiate = async (email: string, apiKey: string) => ({ email });
const verify = async (email: string, otp: string, device: any, apiKey: string) => ({ token: "mock-token" });
const createOnrampOrder = async (params: any, token: string) => ({
  id: "order-123",
  accountNumber: "1234567890",
  accountName: "PAJ Cash",
  bank: "GTBank",
  fiatAmount: params.fiatAmount,
  amount: params.fiatAmount / 1500, // mock conversion
  fee: 0.12,
});
const getTransaction = async (token: string, orderId: string) => ({
  id: orderId,
  status: "pending",
  transactionType: "onramp",
  mint: "So11111111111111111111111111111112",
  currency: "NGN",
  amount: 1,
  fiatAmount: 1500,
  rate: 1500,
  recipient: "mock-wallet",
  createdAt: new Date().toISOString(),
});



export default function OfframpView() {
  const { publicKey } = useWallet();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [recipient, setRecipient] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"init" | "verify" | "order" | "details">("init");

  useEffect(() => {
    const saved = localStorage.getItem("vaultx-onramp-recipient");
    if (saved) setRecipient(saved);
  }, []);

  const handleInitiate = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await initiate(email.trim(), "f9b7a118-f690-4cae-aa44-0c67f9f0bec4");
      alert(`OTP sent to ${email.trim()} (Demo: use 123456 as OTP)`);
      setStep("verify");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to initiate");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await verify(email.trim(), otp.trim(), {}, "f9b7a118-f690-4cae-aa44-0c67f9f0bec4");
      setSessionToken(result.token);
      alert("Email verified successfully!");
      setStep("order");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to verify");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!sessionToken || !recipient) return;
    setLoading(true);
    setError(null);
    try {
      const result = await createOnrampOrder(
        {
          fiatAmount: parseFloat(fiatAmount),
          currency,
          recipient,
          mint: "So11111111111111111111111111111112", // SOL mint
          chain: "SOLANA",
          webhookURL: "",
          fee: 0.12,
        },
        sessionToken
      );
      setOrder(result);
      alert("Onramp order created! Send fiat to the displayed account.");
      setStep("details");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTransaction = async () => {
    if (!sessionToken || !order) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTransaction(sessionToken, order.id);
      setTransaction(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vaultx-black text-vaultx-white px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              VaultX
            </p>
            <h1 className="text-xl font-medium tracking-tight">Onramp Fiat to Crypto</h1>
          </div>
            <div className="flex flex-wrap items-center gap-3">
              <WalletMultiButton className="!rounded-xl !border !border-white/15 !bg-white/[0.08] !font-sans !text-sm !text-white hover:!bg-white/[0.12] !h-auto !py-2 !px-4" />
            <Link
              href="/pay"
              className="vaultx-transition text-xs text-white/45 hover:text-white/70"
            >
              Pay
            </Link>
            <Link
              href="/offramp"
              className="vaultx-transition text-xs text-white/45 hover:text-white/70"
            >
              Onramp
            </Link>
            <Link
              href="/"
              className="vaultx-transition text-xs text-white/45 hover:text-white/70"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="vaultx-glass vaultx-transition space-y-6 rounded-2xl p-8">
          {step === "init" && (
            <>
              <div className="space-y-1">
                <h2 className="text-lg font-medium">Start Offramp</h2>
                <p className="text-sm text-white/70">
                  Convert your SOL to Nigerian Naira
                </p>
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vaultx-transition w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/25 focus:ring-1 focus:ring-white/20"
                placeholder="Enter your email"
              />
              <button
                onClick={handleInitiate}
                disabled={loading || !email}
                className="vaultx-btn-primary vaultx-transition w-full rounded-xl border border-white/15 bg-white/[0.1] py-3.5 text-sm font-medium text-white hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="space-y-1">
                <h2 className="text-lg font-medium">Verify Email</h2>
                <p className="text-sm text-white/70">
                  Enter the OTP sent to {email}
                </p>
              </div>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="vaultx-transition w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/25 focus:ring-1 focus:ring-white/20"
                placeholder="Enter OTP"
              />
              <button
                onClick={handleVerify}
                disabled={loading || !otp}
                className="vaultx-btn-primary vaultx-transition w-full rounded-xl border border-white/15 bg-white/[0.1] py-3.5 text-sm font-medium text-white hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </button>
            </>
          )}

          {step === "order" && (
            <>
              <div className="space-y-1">
                <h2 className="text-lg font-medium">Create Onramp Order</h2>
                <p className="text-sm text-white/70">
                  Enter fiat amount to buy crypto
                </p>
              </div>
              <input
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="vaultx-transition w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/25 focus:ring-1 focus:ring-white/20"
                placeholder="Fiat Amount (e.g. 1500)"
                type="number"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="vaultx-transition w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/25 focus:ring-1 focus:ring-white/20"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
              <button
                onClick={handleCreateOrder}
                disabled={loading || !fiatAmount || !recipient}
                className="vaultx-btn-primary vaultx-transition w-full rounded-xl border border-white/15 bg-white/[0.1] py-3.5 text-sm font-medium text-white hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Order"}
              </button>
              {!recipient && (
                <p className="text-sm text-amber-400/90">
                  Set onramp recipient wallet in admin first.
                </p>
              )}
            </>
          )}

          {step === "details" && order && (
            <>
              <div className="space-y-1">
                <h2 className="text-lg font-medium">Send Fiat</h2>
                <p className="text-sm text-white/70">
                  Send {order.fiatAmount} {currency} to the account below to receive {order.amount} SOL
                </p>
              </div>
              <div className="vaultx-glass rounded-xl p-4 space-y-2">
                <p><strong>Bank:</strong> {order.bank}</p>
                <p><strong>Account Name:</strong> {order.accountName}</p>
                <p><strong>Account Number:</strong> {order.accountNumber}</p>
                <p><strong>Amount:</strong> {order.fiatAmount} {currency}</p>
                <p><strong>Receive:</strong> {order.amount} SOL</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFetchTransaction}
                  disabled={loading}
                  className="vaultx-btn-primary vaultx-transition flex-1 rounded-xl border border-white/15 bg-white/[0.1] py-3.5 text-sm font-medium text-white hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Status"}
                </button>
                <button
                  onClick={() => {
                    setTransaction({ ...transaction, status: "completed" });
                    alert("Fiat transfer simulated! SOL should be received shortly.");
                  }}
                  className="vaultx-btn-primary vaultx-transition flex-1 rounded-xl border border-green-500/20 bg-green-500/10 py-3.5 text-sm font-medium text-green-400 hover:bg-green-500/20"
                >
                  Simulate Transfer
                </button>
              </div>
              {transaction && (
                <div className="vaultx-glass rounded-xl p-4 space-y-2">
                  <p><strong>Status:</strong> {transaction.status}</p>
                  <p><strong>Transaction ID:</strong> {transaction.id}</p>
                  <p><strong>Created:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-red-400/90">{error}</p>
          )}
        </section>
      </div>
    </div>
  );
}