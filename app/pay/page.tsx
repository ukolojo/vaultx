import { Suspense } from "react";
import PayView from "./PayView";

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center 
          justify-center bg-black">
          <div className="rounded-2xl border border-white/10 
            bg-white/5 backdrop-blur-xl px-8 py-6 
            text-sm text-white/50">
            Loading…
          </div>
        </div>
      }
    >
      <PayView />
    </Suspense>
  );
}