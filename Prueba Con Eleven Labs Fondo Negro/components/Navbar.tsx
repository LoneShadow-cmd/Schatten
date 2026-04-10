'use client';

// ─── KATANA FLOW — Navbar ─────────────────────────────────────────────────────
// Fixed navigation. Transparent at top, fades in with controlled opacity
// after the scroll threshold is crossed.
//
// Never competes with the first impression — invisible until the user commits.

import { easeInOutCubic, clamp } from '@/lib/easing';
import { NAVBAR_SCROLL_THRESHOLD } from '@/lib/constants';

interface NavbarProps {
  scrollY: number; // Raw pixel scroll position from useScrollProgress
}

export function Navbar({ scrollY }: NavbarProps) {
  // Opacity: 0 until threshold, then eases to 1 over the next 100px
  const opacity = easeInOutCubic(
    clamp((scrollY - NAVBAR_SCROLL_THRESHOLD) / 100)
  );

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        opacity,
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        // Frosted glass — integrates with the deep void background
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(5, 5, 5, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'none', // Opacity is driven by scroll math, not CSS transition
        willChange: 'opacity',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          padding: '0 3rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — Brand */}
        <span
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '15px',
            fontWeight: 300,
            letterSpacing: '0.25em',
            color: '#F5F5F5',
            textTransform: 'uppercase',
          }}
        >
          Katana Flow
        </span>

        {/* Right — Minimal links */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {['Craft', 'Philosophy', 'Contact'].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '11px',
                fontWeight: 300,
                letterSpacing: '0.15em',
                color: 'rgba(217, 217, 217, 0.6)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#F5F5F5';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  'rgba(217, 217, 217, 0.6)';
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
