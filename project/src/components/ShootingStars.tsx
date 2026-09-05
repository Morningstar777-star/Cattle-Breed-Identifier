import React, { useMemo } from 'react';

interface ShootingStarsProps {
  count?: number;
  className?: string; // extra classes, e.g. z-index overrides
  fixed?: boolean;    // if true, use fixed full-viewport overlay
  style?: React.CSSProperties; // allow setting CSS vars like --primary-color
}

// A lightweight, CSS-powered shooting stars overlay with a dark gradient.
// Use pointer-events-none so it never blocks clicks.
const ShootingStars: React.FC<ShootingStarsProps> = ({ count = 50, className = '', fixed = true, style }) => {
  const stars = useMemo(() => {
    const arr = [] as Array<{ top: number; length: number; duration: number; delay: number }>;
    for (let i = 0; i < count; i++) {
      // Tail length between 5em and 7.5em
      const length = 5 + Math.random() * 2.5;
      // Top offset between 0vh and 100vh
      const top = Math.random() * 100;
      // Fall duration between 6s and 12s
      const duration = 6 + Math.random() * 6;
      // Delay between 0s and 10s
      const delay = Math.random() * 10;
      arr.push({ top, length, duration, delay });
    }
    return arr;
  }, [count]);

  const positionClass = fixed ? 'fixed inset-0' : 'absolute inset-0';

  return (
    <div className={`pointer-events-none ${positionClass} ${className}`} aria-hidden style={style}>
      {/* Dark gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#0d1d31_0%,_#0c0d13_100%)] opacity-85" />

      {/* Rotated stars field */}
      <div className="absolute inset-0 -rotate-45">
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              // CSS variables consumed by the style tag below
              // @ts-ignore custom properties allowed
              '--top-offset': `${s.top}vh`,
              // @ts-ignore
              '--star-tail-length': `${s.length}em`,
              // @ts-ignore
              '--fall-duration': `${s.duration}s`,
              // @ts-ignore
              '--fall-delay': `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Component-scoped CSS */}
      <style>{`
        .star {
          /* Use the color from CSS var if provided, else soft icy blue */
          --star-color: var(--primary-color, #b8d6ff);
          --star-tail-height: 2px;
          --star-width: calc(var(--star-tail-length) / 6);

          position: absolute;
          top: var(--top-offset);
          left: 0;
          width: var(--star-tail-length);
          height: var(--star-tail-height);
          color: var(--star-color);
          background: linear-gradient(45deg, currentColor, transparent);
          border-radius: 9999px;
          filter: drop-shadow(0 0 6px currentColor);
          transform: translate3d(104em, 0, 0);
          animation: fall var(--fall-duration) var(--fall-delay) linear infinite, tail-fade var(--fall-duration) var(--fall-delay) ease-out infinite;
        }

        .star::before, .star::after {
          position: absolute;
          content: '';
          top: 0;
          left: calc(var(--star-width) / -2);
          width: var(--star-width);
          height: 100%;
          background: linear-gradient(45deg, transparent, currentColor, transparent);
          border-radius: inherit;
          animation: blink 2s linear infinite;
        }
        .star::before { transform: rotate(45deg); }
        .star::after { transform: rotate(-45deg); }

        @keyframes fall {
          to { transform: translate3d(-30em, 0, 0); }
        }
        @keyframes tail-fade {
          0%, 50% { width: var(--star-tail-length); opacity: 1; }
          70%, 80% { width: 0; opacity: 0.4; }
          100% { width: 0; opacity: 0; }
        }
        @keyframes blink { 50% { opacity: 0.6; } }

        /* Motion reduction */
        @media (prefers-reduced-motion: reduce) {
          .star { animation: none; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default ShootingStars;
