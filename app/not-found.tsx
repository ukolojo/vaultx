import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-black flex flex-col 
        items-center justify-center px-4 text-center gap-8"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Broken chain SVG */}
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left chain link */}
          <rect
            x="5" y="25" width="40" height="30"
            rx="15"
            stroke="rgba(255,107,53,0.6)"
            strokeWidth="4"
            fill="none"
          />
          <rect
            x="13" y="33" width="24" height="14"
            rx="7"
            fill="rgba(0,0,0,1)"
            stroke="rgba(255,107,53,0.6)"
            strokeWidth="4"
          />
          {/* Break gap — orange spark */}
          <circle
            cx="60" cy="40" r="4"
            fill="#FF6B35"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.8;0.2;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <line
            x1="47" y1="38"
            x2="54" y2="42"
            stroke="rgba(255,107,53,0.4)"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <line
            x1="66" y1="38"
            x2="73" y2="42"
            stroke="rgba(255,107,53,0.4)"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          {/* Right chain link — rotated and dropped */}
          <g transform="translate(75, 8) rotate(15)">
            <rect
              x="0" y="17" width="40" height="30"
              rx="15"
              stroke="rgba(255,107,53,0.3)"
              strokeWidth="4"
              fill="none"
            />
            <rect
              x="8" y="25" width="24" height="14"
              rx="7"
              fill="rgba(0,0,0,1)"
              stroke="rgba(255,107,53,0.3)"
              strokeWidth="4"
            />
          </g>
        </svg>

        <div>
          <p
            className="text-[10px] uppercase tracking-[0.3em] 
              text-[#FF6B35]/50 mb-3"
          >
            Error 404
          </p>
          <h1
            className="text-4xl font-bold text-white 
              tracking-tight"
          >
            Vault<span className="text-[#FF6B35]">X</span>
          </h1>
          <p className="text-white/30 text-sm mt-2">
            This transaction block doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col gap-2 
          text-xs text-white/20">
          <p>The link may be invalid or expired.</p>
          <p>Check the payment URL and try again.</p>
        </div>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm 
            font-semibold bg-[#FF6B35]/10 
            border border-[#FF6B35]/30 text-[#FF6B35]
            hover:bg-[#FF6B35]/20
            hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]
            transition-all duration-200"
        >
          Return to VaultX
        </Link>
      </div>

      <p className="text-white/10 text-xs italic 
        absolute bottom-8">
        Don&apos;t trust — verify
      </p>
    </div>
  );
}