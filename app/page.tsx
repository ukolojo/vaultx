import Link from "next/link";
import { brand } from "@/lib/brand";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="w-full sticky top-0 z-40 backdrop-blur-xl border-b border-orange-500/20 bg-black/90">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className={`${brand.typography.heading4} ${brand.colors.textPrimary}`}>
            VaultX
          </span>
          <Link
            href="/admin"
            className={`text-xs ${brand.colors.primaryText} hover:${brand.colors.primaryTextHover} transition-colors duration-200`}
          >
            Admin →
          </Link>
        </div>
      </nav>

      <main className={`flex-1 flex flex-col items-center ${brand.spacing.sectionPaddingLarge} ${brand.spacing.stackGapLarge}`}>

        {/* Hero Section */}
        <section className="w-full max-w-lg flex flex-col items-center text-center gap-6 animate-fade-in">
          <div className={`flex flex-col items-center ${brand.spacing.stackGapSmall}`}>
            <p className={`${brand.typography.labelWide} ${brand.colors.primaryText}`}>
              Solana · Devnet · Federal University Lokoja
            </p>
            <h1 className={`${brand.typography.heading1} ${brand.colors.textPrimary}`}>
              VaultX
            </h1>
            <p className={`${brand.typography.caption} ${brand.colors.primaryTextHover} tracking-widest uppercase`}>
              Don&apos;t trust — verify
            </p>
          </div>

          <p className={`${brand.colors.textMuted} ${brand.typography.body} max-w-sm`}>
            A transparency-first payment gateway for campus financial collections. Every transaction is recorded permanently on the Solana blockchain — visible to anyone, controlled by no one.
          </p>

          <div className={`flex flex-col sm:flex-row ${brand.spacing.stackGapSmall} w-full sm:w-auto`}>
            <Link
              href="/admin"
              className={`${brand.components.buttonPrimary} text-black ${brand.colors.primary} hover:${brand.colors.primaryHover} hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] text-center`}
            >
              Open Admin Dashboard
            </Link>
            <Link
              href="/pay"
              className={`${brand.components.buttonSecondary} text-center`}
            >
              Payment Portal
            </Link>
          </div>
        </section>

        {/* Features/Steps Grid */}
        <section className="w-full max-w-4xl">
          <p className={`${brand.typography.labelWide} ${brand.colors.primaryText} text-center mb-10`}>
            How It Works
          </p>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${brand.spacing.inlineGapSmall}`}>
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
                className={`${brand.components.cardSecondary} ${brand.spacing.cardPaddingSmall} flex flex-col ${brand.spacing.stackGapSmall} hover:border-orange-500/30 hover:bg-orange-500/5 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-all duration-300`}
              >
                <span className={`${brand.colors.primaryText} font-mono ${brand.typography.caption}`}>
                  {item.step}
                </span>
                <div className={`flex flex-col ${brand.spacing.inlineGapSmall}`}>
                  <h3 className={`${brand.typography.heading4} ${brand.colors.textPrimary}`}>
                    {item.title}
                  </h3>
                  <p className={`${brand.colors.textMuted} ${brand.typography.caption} leading-relaxed`}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="w-full max-w-2xl">
          <div className={`${brand.components.cardSecondary} ${brand.spacing.cardPadding} flex flex-col ${brand.spacing.stackGap}`}>
            <p className={`${brand.typography.labelWide} ${brand.colors.primaryText} text-center`}>
              The Glass Box Principle
            </p>
            <p className={`${brand.colors.textMuted} ${brand.typography.body} text-center`}>
              VaultX replaces personal bank accounts and paper ledgers with an on-chain vault whose balance is publicly visible and whose history is permanently recorded. The system does not require trust — it makes trust irrelevant.
            </p>
            <div className={`grid grid-cols-1 sm:grid-cols-3 ${brand.spacing.inlineGapSmall} pt-2`}>
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
                <div key={item.label} className={`flex flex-col ${brand.spacing.inlineGapSmall} ${brand.spacing.cardPaddingSmall} ${brand.radius.button} ${brand.components.badge}`}>
                  <p className={`${brand.colors.primaryText} ${brand.typography.caption} font-medium`}>
                    {item.label}
                  </p>
                  <p className={`${brand.colors.textCaption} ${brand.typography.caption} leading-relaxed`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-orange-500/10 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`${brand.colors.textCaption} ${brand.typography.caption}`}>
            VaultX · Academic Session 2024/2025
          </p>
          <p className={`${brand.colors.textCaption} ${brand.typography.caption}`}>
            Federal University Lokoja · Dept. of Computer Science
          </p>
          <p className={`${brand.colors.primaryTextHover} ${brand.typography.caption} italic`}>
            Don&apos;t trust — verify
          </p>
        </div>
      </footer>

    </div>
  );
}