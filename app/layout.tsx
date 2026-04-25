import type { Metadata } from "next";
import localFont from "next/font/local";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { WalletContextProvider } from "./providers";
import BackgroundOrb from "@/components/BackgroundOrb";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedFavicon from "@/components/AnimatedFavicon";
import ScrollProgress from "@/components/ScrollProgress";
import TickerTape from "@/components/TickerTape";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  weight: "400 700",
  style: "normal",
  variable: "--font-geist",
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
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
        <CustomCursor />
        <LoadingScreen />
        <AnimatedFavicon />
        <ScrollProgress />
        <TickerTape />
        <BackgroundOrb />
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
