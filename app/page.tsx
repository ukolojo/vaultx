import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-vaultx-black text-vaultx-white flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
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

        {/* How It Works */}
        <section className="w-full max-w-4xl mx-auto mt-16 px-6">
          <div className="vaultx-glass rounded-3xl p-8">
            <h2 className="text-white/60 text-sm uppercase tracking-wider mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <span className="text-white text-lg font-bold">1</span>
                </div>
                <h3 className="text-white text-lg font-medium">Generate Link</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Admins create parameterized payment links or QR codes for specific collections.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
                <h3 className="text-white text-lg font-medium">Connect & Pay</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Students follow the link, connect a Solana wallet, and approve the pre-filled transaction.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <span className="text-white text-lg font-bold">3</span>
                </div>
                <h3 className="text-white text-lg font-medium">On-Chain Logging</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Payments are recorded on Solana, tagged with a memo containing the matriculation number and purpose.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <span className="text-white text-lg font-bold">4</span>
                </div>
                <h3 className="text-white text-lg font-medium">Verify Transparency</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Anyone can view the real-time vault balance and transaction history without a login.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="w-full max-w-2xl mx-auto mt-16 px-6 text-center">
          <div className="vaultx-glass rounded-3xl p-8 space-y-4">
            <h2 className="text-white/60 text-sm uppercase tracking-wider">
              Important Disclaimers
            </h2>
            <div className="space-y-3 text-white/40 text-sm">
              <p>
                <strong className="text-white/60">Non-Custodial:</strong> VaultX is a stateless gateway; we do not store private keys or bank details.
              </p>
              <p>
                <strong className="text-white/60">Blockchain Finality:</strong> All transactions are immutable and cannot be reversed or deleted once confirmed.
              </p>
              <p>
                <strong className="text-white/60">No Central Authority:</strong> The Solana blockchain serves as the sole, tamper-proof source of truth.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-white/10">
        <div className="max-w-md mx-auto text-center">
          <div className="vaultx-glass rounded-2xl p-6 space-y-3">
            <p className="text-white text-sm font-medium">
              VaultX v2 | A Glass Box for Campus Financials
            </p>
            <p className="text-white/60 text-xs">
              Academic Session 2024 / 2025 · Federal University Lokoja
            </p>
            <p className="text-white/40 text-xs italic">
              'Don't Trust, Verify.'
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
