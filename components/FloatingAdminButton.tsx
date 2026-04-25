"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingAdminButton() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;

  return (
    <Link
      href="/admin"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9000,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "rgba(255,107,53,0.12)",
        border: "1px solid rgba(255,107,53,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(255,107,53,0.15)",
        transition: "all 0.2s ease",
        color: "#FF6B35",
        fontSize: "18px",
        fontWeight: 700,
        textDecoration: "none",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = "rgba(255,107,53,0.2)";
        el.style.boxShadow =
          "0 0 30px rgba(255,107,53,0.3)";
        el.style.transform = "scale(1.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = "rgba(255,107,53,0.12)";
        el.style.boxShadow =
          "0 0 20px rgba(255,107,53,0.15)";
        el.style.transform = "scale(1)";
      }}
      title="Admin Dashboard"
    >
      ⚡
    </Link>
  );
}