// NETWORK: Solana Devnet — do not change without explicit instruction

"use client";

import type { WalletAdapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import {
  type ComponentType,
  type ReactNode,
  useMemo,
} from "react";

/** Solana wallet packages ship FC types aligned with React 19; bridge for React 18 + Next 14. */
const Conn = ConnectionProvider as ComponentType<{
  endpoint: string;
  children?: ReactNode;
}>;
const Wall = WalletProvider as ComponentType<{
  wallets: WalletAdapter[];
  autoConnect?: boolean;
  children?: ReactNode;
}>;
const Modal = WalletModalProvider as ComponentType<{ children?: ReactNode }>;

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <Conn endpoint={endpoint}>
      <Wall wallets={wallets} autoConnect>
        <Modal>{children}</Modal>
      </Wall>
    </Conn>
  );
}
