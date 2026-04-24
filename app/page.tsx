import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar - Retained structure, updated colors for orange accents */}
      <nav className="w-full sticky top-0 z-40 backdrop-blur-xl border-b border-orange-500/20 bg-black/90">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-white font-semibold tracking-tight text-lg">
            VaultX
          </span>
          <Link
            href="/admin"
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            Admin →
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24 gap-20">

        {/* Hero Section - Centered layout like Nexaris, bold title, orange CTAs */}
        <section className="w-full max-w-lg flex flex-col items-center text-center gap-6 animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-orange-400">
              Solana · Devnet · Federal University Lokoja
            </p>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-white">
              VaultX
            </h1>
            <p className="text-orange-300 text-xs tracking-widest uppercase">
              Don&apos;t trust — verify
            </p>
          </div>

          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-sm">
            A transparency-first payment gateway for campus financial collections. Every transaction is recorded permanently on the Solana blockchain — visible to anyone, controlled by no one.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl text-sm font-medium bg-orange-500 border border-orange-600 text-black hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] transition-all duration-200 text-center"
            >
              Open Admin Dashboard
            </Link>
            <Link
              href="/pay"
              className="px-6 py-3 rounded-xl text-sm border border-orange-500/50 text-orange-400 hover:border-orange-400 hover:text-orange-300 hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all duration-200 text-center"
            >
              Payment Portal
            </Link>
          </div>
        </section>

        {/* Features/Steps Grid - Clean grid layout like Nexaris, orange hovers */}
        <section className="w-full max-w-4xl">
          <p className="text-orange-400 text-xs uppercase tracking-[0.3em] text-center mb-10">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Generate Link",
                body: "An admin creates a parameterised payment link or QR code for a specific collection — amount, purpose, and destination pre-configured.",
              },
              {
                step: "02",
                title: "Connect & Pay",
                body: "Students follow the link, enter their matric number, connect a Solana wallet, and approve the pre-filled transaction in one click.",
              },
              {
                step: "03",
                title: "On-Chain Record",
                body: "Every payment is recorded permanently on Solana, tagged with a memo containing the matric number and payment purpose.",
              },
              {
                step: "04",
                title: "Public Ledger",
                body: "Anyone can view the real-time Glass Pocket — the full transaction history — without a login or any permission.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-orange-500/10 bg-black/50 backdrop-blur-xl p-6 flex flex-col gap-4 hover:border-orange-500/30 hover:bg-orange-500/5 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-all duration-300"
              >
                <span className="text-orange-400 font-mono text-xs">
                  {item.step}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-sm font-medium">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition Section - Elegant blocks like Nexaris, orange accents */}
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-orange-500/10 bg-black/50 backdrop-blur-xl p-8 flex flex-col gap-6">
            <p className="text-orange-400 text-xs uppercase tracking-[0.3em] text-center">
              The Glass Box Principle
            </p>
            <p className="text-white/50 text-sm leading-relaxed text-center">
              VaultX replaces personal bank accounts and paper ledgers with an on-chain vault whose balance is publicly visible and whose history is permanently recorded. The system does not require trust — it makes trust irrelevant.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  label: "Non-Custodial",
                  desc: "We never hold your keys or funds. Payments go directly on-chain.",
                },
                {
                  label: "Immutable",
                  desc: "All transactions are final and cannot be reversed or deleted.",
                },
                {
                  label: "No Backend",
                  desc: "No server. No database. The Solana blockchain is the only source of truth.",
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2 p-4 rounded-lg border border-orange-500/20 bg-orange-500/5">
                  <p className="text-orange-400 text-xs font-medium">
                    {item.label}
                  </p>
                  <p className="text-white/30 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer - Retained, updated colors */}
      <footer className="w-full border-t border-orange-500/10 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            VaultX · Academic Session 2024/2025
          </p>
          <p className="text-white/20 text-xs">
            Federal University Lokoja · Dept. of Computer Science
          </p>
          <p className="text-orange-300 text-xs italic">
            Don&apos;t trust — verify
          </p>
        </div>
      </footer>

    </div>
  );
}