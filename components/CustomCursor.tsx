"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    document.body.style.cursor = "none";

    function onMouseMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseDown() {
      if (dotRef.current) {
        dotRef.current.style.transform =
          "translate(-50%,-50%) scale(0.6)";
      }
    }

    function onMouseUp() {
      if (dotRef.current) {
        dotRef.current.style.transform =
          "translate(-50%,-50%) scale(1)";
      }
    }

    function onMouseEnterLink() {
      if (ringRef.current) {
        ringRef.current.style.width = "40px";
        ringRef.current.style.height = "40px";
        ringRef.current.style.borderColor =
          "rgba(255,107,53,0.8)";
        ringRef.current.style.backgroundColor =
          "rgba(255,107,53,0.05)";
      }
    }

    function onMouseLeaveLink() {
      if (ringRef.current) {
        ringRef.current.style.width = "24px";
        ringRef.current.style.height = "24px";
        ringRef.current.style.borderColor =
          "rgba(255,107,53,0.4)";
        ringRef.current.style.backgroundColor =
          "transparent";
      }
    }

    function animate() {
      ring.current.x +=
        (pos.current.x - ring.current.x) * 0.12;
      ring.current.y +=
        (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left =
          pos.current.x + "px";
        dotRef.current.style.top =
          pos.current.y + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left =
          ring.current.x + "px";
        ringRef.current.style.top =
          ring.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const links = document.querySelectorAll(
      "a, button, input, [role='button']"
    );
    links.forEach(el => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      document.body.style.cursor = "auto";
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#FF6B35",
          boxShadow: "0 0 8px rgba(255,107,53,0.8)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "transform 0.1s ease",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: "1px solid rgba(255,107,53,0.4)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 99998,
          transition:
            "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
        }}
      />
    </>
  );
}