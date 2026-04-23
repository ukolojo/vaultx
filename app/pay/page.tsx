import { Suspense } from "react";
import PayView from "./PayView";

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-vaultx-black text-vaultx-white">
          <div className="vaultx-glass rounded-2xl px-8 py-6 text-sm text-white/70">
            Loading…
          </div>
        </div>
      }
    >
      <PayView />
    </Suspense>
  );
}
