import { Suspense } from "react";
import OfframpView from "./OfframpView";
import { brand } from "@/lib/brand";

export default function OfframpPage() {
  return (
    <Suspense
      fallback={
        <div className={`flex min-h-screen items-center justify-center ${brand.colors.background} ${brand.colors.textPrimary}`}>
          <div className={`${brand.components.card} px-8 py-6 text-sm ${brand.colors.textSecondary}`}>
            Loading…
          </div>
        </div>
      }
    >
      <OfframpView />
    </Suspense>
  );
}