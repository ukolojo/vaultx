"use client";
import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "mid" | "low";

export function useDevicePerformance(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTouch = navigator.maxTouchPoints > 0;
    
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency ?? 4;
    
    // Check device memory if available
    const memory = 
      (navigator as any).deviceMemory ?? 8;
    
    // Check if reduced motion is preferred
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setTier("low");
      return;
    }

    if (isMobile && isTouch) {
      if (cores <= 4 || memory <= 4) {
        setTier("low");
      } else {
        setTier("mid");
      }
      return;
    }

    setTier("high");
  }, []);

  return tier;
}