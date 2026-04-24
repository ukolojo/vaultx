"use client";

export default function WordFade({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: 0,
            display: "inline-block",
            marginRight: "0.25em",
            animation: `fade-in 0.4s ease forwards`,
            animationDelay: `${delay + i * 0.06}s`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}