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

        {/* How It Works */}
        <div className="w-full max-w-md mx-auto mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
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
