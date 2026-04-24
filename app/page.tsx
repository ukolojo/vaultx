"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen text-white
      flex flex-col relative overflow-hidden">

      {/* Background orange glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute top-[-10%] right-[-5%] 
            w-[400px] h-[400px] rounded-full 
            bg-[#FF6B35]/[0.04] blur-[100px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-5%] 
            w-[300px] h-[300px] rounded-full 
            bg-[#FF6B35]/[0.03] blur-[80px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        className="w-full sticky top-0 z-40
          bg-white/[0.04] backdrop-blur-2xl
          border-b border-white/[0.08]
          hover:bg-white/[0.06] transition-all duration-300"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 
          flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
              <span className="text-white font-bold
                tracking-tight text-xl group-hover:text-white/90
                transition-colors duration-200">
                Vault<span className="text-[#FF6B35] group-hover:text-[#FF6B35]/80">X</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin"
              className="text-xs text-white/40
              hover:text-[#FF6B35] hover:bg-[#FF6B35]/10
              px-3 py-1.5 rounded-lg transition-all duration-200
              hover:shadow-[0_0_10px_rgba(255,107,53,0.2)]">
              Admin
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5
              rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20
              hover:bg-[#FF6B35]/20 transition-all duration-200">
              <span className="w-1.5 h-1.5 rounded-full
                bg-[#FF6B35]
                shadow-[0_0_6px_rgba(255,107,53,0.8)]
                animate-orange-pulse" />
              <span className="text-xs text-[#FF6B35]/80">
                Devnet
              </span>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.main
        className="flex-1 flex flex-col items-center 
          px-4 py-16 sm:py-24 gap-20 relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >

        {/* Hero */}
        <section className="w-full max-w-2xl flex flex-col 
          items-center text-center gap-8 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 
              px-3 py-1.5 rounded-full 
              bg-[#FF6B35]/10 border border-[#FF6B35]/20">
              <span className="w-1.5 h-1.5 rounded-full 
                bg-[#FF6B35] animate-orange-pulse" />
              <span className="text-[10px] text-[#FF6B35]/80 
                uppercase tracking-[0.2em] font-medium">
                Solana · Devnet · Live
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold 
              tracking-tight leading-none">
              Vault<span className="text-[#FF6B35]">X</span>
            </h1>
            <p className="text-xs text-white/20 tracking-[0.3em]
              uppercase overflow-hidden">
              <span className="typewriter">
                Don&apos;t trust — verify
              </span>
            </p>
          </div>
          <p className="text-white/50 text-base sm:text-lg 
            leading-relaxed max-w-lg">
            A transparency-first payment gateway for campus 
            financial collections. Every transaction recorded 
            permanently on-chain — visible to anyone, 
            controlled by no one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 
            w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-8 py-3.5 rounded-xl text-sm 
              font-semibold bg-[#FF6B35]/10 
              border border-[#FF6B35]/30 text-[#FF6B35]
              hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50
              hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
              transition-all duration-200 text-center"
            >
              <Link href="/admin" className="block">
                Open Admin Dashboard
              </Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="px-8 py-3.5 rounded-xl text-sm
              border border-white/[0.10] text-white/50
              hover:border-white/20 hover:text-white
              transition-all duration-200 text-center"
            >
              <Link href="/pay" className="block">
                Payment Portal
              </Link>
            </motion.button>
          </div>
        </section>

        {/* Stats */}
        <section className="w-full max-w-sm 
          grid grid-cols-3 gap-3">
          {[
            { val: "0ms", lbl: "Server delay" },
            { val: "∞", lbl: "Audit trail" },
            { val: "$0", lbl: "Trust required" },
          ].map(item => (
            <motion.div
              key={item.lbl}
              className="rounded-2xl border border-white/[0.06] 
              bg-white/[0.03] backdrop-blur-xl p-4 text-center
              hover:border-[#FF6B35]/20 hover:bg-[#FF6B35]/[0.03]
              transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="text-2xl font-bold tracking-tight 
                text-[#FF6B35]">{item.val}</p>
              <p className="text-[10px] text-white/25 mt-1 
                uppercase tracking-wider">{item.lbl}</p>
            </motion.div>
          ))}
        </section>

        {/* How It Works */}
        <section className="w-full max-w-4xl">
          <div className="flex items-center gap-3 
            justify-center mb-10">
            <div className="h-px flex-1 max-w-[80px] 
              bg-white/[0.06]" />
            <p className="text-[10px] uppercase 
              tracking-[0.3em] text-white/25">
              How It Works
            </p>
            <div className="h-px flex-1 max-w-[80px] 
              bg-white/[0.06]" />
          </div>
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
                body: "Students enter matric number, connect Phantom or Solflare, and approve the transaction.",
              },
              {
                step: "03",
                title: "On-Chain Record",
                body: "Payment recorded permanently on Solana with a memo: matric number and purpose.",
              },
              {
                step: "04",
                title: "Glass Pocket",
                body: "Anyone views real-time history — no login, no permission, no trust required.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="glow-border rounded-2xl border border-white/[0.06]
                bg-white/[0.03] backdrop-blur-xl p-6
                flex flex-col gap-4 group
                hover:border-[#FF6B35]/20
                hover:bg-[#FF6B35]/[0.03]
                hover:shadow-[0_0_20px_rgba(255,107,53,0.06)]
                transition-all duration-300"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  hover: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <span className="text-[#FF6B35]/50 font-mono 
                  text-xs font-bold">
                  {item.step}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-sm 
                    font-semibold group-hover:text-[#FF6B35] 
                    transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-white/35 text-xs 
                    leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Glass Box Principle */}
        <motion.section
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div className="glow-border rounded-2xl border border-white/[0.08]
            bg-white/[0.03] backdrop-blur-2xl p-8
            flex flex-col gap-6 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 
              bg-gradient-to-br from-[#FF6B35]/[0.04] 
              via-transparent to-transparent rounded-2xl" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3 
                justify-center">
                <div className="h-px flex-1 
                  bg-[#FF6B35]/10" />
                <p className="text-[10px] uppercase 
                  tracking-[0.3em] text-[#FF6B35]/50">
                  The Glass Box Principle
                </p>
                <div className="h-px flex-1 
                  bg-[#FF6B35]/10" />
              </div>
              <p className="text-white/50 text-sm 
                leading-relaxed text-center">
                VaultX replaces personal bank accounts with 
                an on-chain vault. The record is public, 
                permanent, and requires no trust from any 
                individual or institution.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 
                gap-3">
                {[
                  { label: "Non-Custodial", 
                    desc: "No keys held. Funds go directly on-chain." },
                  { label: "Immutable", 
                    desc: "Cannot be reversed or deleted once confirmed." },
                  { label: "No Backend", 
                    desc: "Solana is the only source of truth." },
                ].map(item => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl border
                    border-[#FF6B35]/10 bg-[#FF6B35]/[0.03]
                    p-4 flex flex-col gap-2 cursor-pointer
                    hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/[0.08]
                    hover:shadow-[0_0_15px_rgba(255,107,53,0.1)]
                    transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <p className="text-[#FF6B35]/70 text-xs 
                      font-semibold">
                      {item.label}
                    </p>
                    <p className="text-white/30 text-xs 
                      leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </motion.main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.08]
        bg-white/[0.02] backdrop-blur-xl
        px-6 py-8 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col
          sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="group">
            <span className="text-white font-bold text-base
              group-hover:text-white/90 transition-colors duration-200">
              Vault<span className="text-[#FF6B35] group-hover:text-[#FF6B35]/80">X</span>
            </span>
          </Link>
          <p className="text-white/20 text-xs">
            Federal University Lokoja · Computer Science · 2024/25
          </p>
          <p className="text-[#FF6B35]/30 text-xs italic">
            Don&apos;t trust — verify
          </p>
        </div>
      </footer>

    </div>
  );
}