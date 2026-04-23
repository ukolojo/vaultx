import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-vaultx-black px-6 text-vaultx-white">
      <div className="vaultx-glass max-w-md space-y-8 rounded-3xl p-10 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Solana · Devnet
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">VaultX</h1>
          <p className="text-sm leading-relaxed text-white/55">
            Stateless payment gateway. The ledger is the database; payment
            config travels in the URL.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/admin"
            className="vaultx-btn-primary vaultx-transition rounded-xl border border-white/15 bg-white/[0.1] px-6 py-3 text-sm font-medium hover:bg-white/[0.14]"
          >
            Open admin
          </Link>
          <Link
            href="/pay"
            className="vaultx-transition rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm text-white/70 hover:border-white/20 hover:text-white"
          >
            Pay (needs link)
          </Link>
        </div>
      </div>
    </div>
  );
}
