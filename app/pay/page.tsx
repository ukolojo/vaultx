import { Suspense } from "react";
import PayView from "./PayView";

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="rounded-2xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.04] backdrop-blur-xl px-8 py-6 text-sm text-[#FF6B35]/60">
            Loading
          </div>
        </div>
      }
    >
      <PayView />
    </Suspense>
  );
}