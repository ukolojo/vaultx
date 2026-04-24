"use client";
import { useRef } from "react";

export default function TiltCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    card.style.boxShadow =
      `0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(255,107,53,0.08)`;
  }

  function handleMouseLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transform =
      `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    card.style.boxShadow =
      `0 8px 32px rgba(0,0,0,0.4)`;
  }

  return (
    <div
      ref={ref}
      className={"tilt-card " + (className ?? "")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}