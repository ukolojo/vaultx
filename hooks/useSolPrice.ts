"use client";

import { useCallback, useEffect, useState } from "react";

const JUP_PRICE_URL =
  "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const NGN_PER_USD = 1550;

type JupiterPriceV2Response = {
  data?: Record<string, { price?: string } | undefined>;
};

export function useSolPrice() {
  const [usdPerSol, setUsdPerSol] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(JUP_PRICE_URL);
        if (!res.ok) return;
        const json = (await res.json()) as JupiterPriceV2Response;
        const raw = json?.data?.[SOL_MINT]?.price;
        const n = raw != null ? parseFloat(raw) : NaN;
        if (!cancelled && Number.isFinite(n) && n > 0) {
          setUsdPerSol(n);
        }
      } catch {
        /* keep null */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getNairaEquivalent = useCallback(
    (solAmount: number): number | null => {
      if (usdPerSol == null || !Number.isFinite(solAmount)) return null;
      return solAmount * usdPerSol * NGN_PER_USD;
    },
    [usdPerSol]
  );

  return { getNairaEquivalent };
}
