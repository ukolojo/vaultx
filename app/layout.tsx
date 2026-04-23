import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { WalletContextProvider } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VaultX",
  description: "Serverless Solana payment gateway — devnet ledger as source of truth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
