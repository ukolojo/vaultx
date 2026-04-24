"use client";

export default function BackgroundOrb() {
  return (
    <div className="pointer-events-none fixed inset-0
      z-0 overflow-hidden orb-container">

      {/* Main rotating sphere */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 35% 35%,
              rgba(40,40,40,1) 0%,
              rgba(15,15,15,1) 40%,
              rgba(0,0,0,1) 70%,
              rgba(0,0,0,1) 100%
            )
          `,
          boxShadow: `
            inset -20px -20px 60px rgba(255,107,53,0.04),
            inset 10px 10px 40px rgba(255,255,255,0.02),
            0 0 80px rgba(0,0,0,0.8),
            0 0 200px rgba(0,0,0,0.6)
          `,
          animation: 'orb-rotate 20s linear infinite',
          opacity: 0.6,
        }}
      >
        {/* Fine texture overlay using repeating SVG pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.4' fill='rgba(255,255,255,0.06)'/%3E%3C/svg%3E")`,
            backgroundSize: '4px 4px',
            animation: 'orb-rotate-reverse 30s linear infinite',
          }}
        />
        {/* Latitude lines texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 18px,
                rgba(255,255,255,0.015) 18px,
                rgba(255,255,255,0.015) 19px
              )
            `,
          }}
        />
        {/* Longitude lines texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 18px,
                rgba(255,255,255,0.015) 18px,
                rgba(255,255,255,0.015) 19px
              )
            `,
            animation: 'orb-rotate 25s linear infinite',
          }}
        />
        {/* Specular highlight */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '30%',
            height: '25%',
            borderRadius: '50%',
            background: `
              radial-gradient(ellipse,
                rgba(255,255,255,0.06) 0%,
                transparent 70%
              )
            `,
          }}
        />
        {/* Orange rim light */}
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '40%',
            height: '35%',
            borderRadius: '50%',
            background: `
              radial-gradient(ellipse,
                rgba(255,107,53,0.06) 0%,
                transparent 70%
              )
            `,
          }}
        />
      </div>

      {/* Outer glow ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: '0 0 120px rgba(255,107,53,0.03), 0 0 60px rgba(0,0,0,0.9)',
          opacity: 0.8,
        }}
      />

    </div>
  );
}