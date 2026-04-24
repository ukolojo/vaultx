import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="w-full sticky top-0 z-40 backdrop-blur-xl 
        border-b border-white/8 bg-black/80">
        <div className="max-w-4xl mx-auto px-6 py-4 flex 
          items-center justify-between">
          <span className="text-white font-semibold 
            tracking-tight text-lg">
            VaultX
          </span>
          <div className="flex items-center gap-6">
            <Link href="/admin"
              className="text-xs text-white/40 
              hover:text-white transition-colors duration-200">
              Admin →
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full 
                bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              <span className="text-xs text-white/20">Devnet</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center 
        px-4 py-16 sm:py-24 gap-20">

        {/* Hero */}
        <section className="w-full max-w-lg flex flex-col 
          items-center text-center gap-6 animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-[0.3em] 
              text-white/25">
              Solana · Devnet · Federal University Lokoja
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold 
              tracking-tight text-white">
              VaultX
            </h1>
            <p className="text-xs text-white/20 tracking-widest 
              uppercase">
              Don&apos;t trust — verify
            </p>
          </div>
          <p className="text-white/50 text-sm leading-relaxed 
            max-w-sm">
            A transparency-first payment gateway for campus 
            financial collections. Every transaction is recorded 
            permanently on the Solana blockchain — visible to 
            anyone, controlled by no one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 
            w-full sm:w-auto">
            <Link href="/admin"
              className="px-6 py-3 rounded-xl text-sm font-medium
              bg-white/10 border border-white/20 text-white
              hover:bg-white/15 transition-all duration-200
              text-center">
              Open Admin Dashboard
            </Link>
            <Link href="/pay"
              className="px-6 py-3 rounded-xl text-sm
              border border-white/8 text-white/50
              hover:border-white/15 hover:text-white
              transition-all duration-200 text-center">
              Payment Portal
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="w-full max-w-sm grid grid-cols-3 gap-3">
          {[
            { val: "0ms", lbl: "Server delay" },
            { val: "∞", lbl: "Audit trail" },
            { val: "$0", lbl: "Trust required" },
          ].map(item => (
            <div key={item.lbl}
              className="rounded-2xl border border-white/6 
              bg-white/[0.03] backdrop-blur-xl p-4 text-center">
              <p className="text-xl font-bold tracking-tight 
                text-white">{item.val}</p>
              <p className="text-xs text-white/25 mt-1">
                {item.lbl}
              </p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] 
            text-white/25 text-center mb-10">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Generate Link",
                body: "Admin creates a parameterised payment link or QR code with amount and purpose pre-configured.",
              },
              {
                step: "02",
                title: "Connect & Pay",
                body: "Students enter matric number, connect Phantom or Solflare, and approve the transaction in one click.",
              },
              {
                step: "03",
                title: "On-Chain Record",
                body: "Payment recorded permanently on Solana with a memo containing matric number and purpose.",
              },
              {
                step: "04",
                title: "Glass Pocket",
                body: "Anyone views real-time transaction history — no login, no permission, no trust needed.",
              },
            ].map(item => (
              <div key={item.step}
                className="rounded-2xl border border-white/6 
                bg-white/[0.03] backdrop-blur-xl p-6 
                flex flex-col gap-4 hover:border-white/12 
                hover:bg-white/[0.05] transition-all duration-300">
                <span className="text-white/20 font-mono text-xs">
                  {item.step}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-sm font-semibold">
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

        {/* Glass Box Principle */}
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-white/8 
            bg-white/[0.03] backdrop-blur-xl p-8 
            flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] 
              text-white/25 text-center">
              The Glass Box Principle
            </p>
            <p className="text-white/50 text-sm leading-relaxed 
              text-center">
              VaultX replaces personal bank accounts with an 
              on-chain vault. The record is public, permanent, 
              and requires no trust from any individual.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 
              gap-4 pt-2">
              {[
                {
                  label: "Non-Custodial",
                  desc: "No keys held. Payments go directly on-chain.",
                },
                {
                  label: "Immutable",
                  desc: "Cannot be reversed or deleted once confirmed.",
                },
                {
                  label: "No Backend",
                  desc: "Solana blockchain is the only source of truth.",
                },
              ].map(item => (
                <div key={item.label}
                  className="rounded-xl border border-white/6 
                  bg-white/[0.03] p-4 flex flex-col gap-2">
                  <p className="text-white/60 text-xs font-medium">
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

      {/* Footer */}
      <footer className="w-full border-t border-white/5 
        px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col 
          sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            VaultX · Academic Session 2024/2025
          </p>
          <p className="text-white/20 text-xs">
            Federal University Lokoja · Computer Science
          </p>
          <p className="text-white/10 text-xs italic">
            Don&apos;t trust — verify
          </p>
        </div>
      </footer>

    </div>
  );
}