"use client";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";

export default function ScrambleText({
  text,
  className,
  trigger = "mount",
}: {
  text: string;
  className?: string;
  trigger?: "mount" | "hover";
}) {
  const [display, setDisplay] = useState(
    trigger === "mount" ? "" : text
  );
  const rafRef = useRef<ReturnType<typeof setTimeout>>();

  function scramble() {
    let iteration = 0;
    const totalFrames = text.length * 3;

    clearInterval(rafRef.current);
    rafRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration / 3) return char;
            return CHARS[
              Math.floor(Math.random() * CHARS.length)
            ];
          })
          .join("")
      );
      iteration++;
      if (iteration > totalFrames) {
        clearInterval(rafRef.current);
        setDisplay(text);
      }
    }, 40);
  }

  useEffect(() => {
    if (trigger === "mount") {
      const t = setTimeout(scramble, 400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <span
      className={className}
      onMouseEnter={
        trigger === "hover" ? scramble : undefined
      }
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display || text}
    </span>
  );
}