'use client';

// ─── KATANA FLOW — Loading Screen ────────────────────────────────────────────
// Absolute black. Controlled presence. Precise exit.
//
// Lifecycle:
//   1. Mount → progress bar fills as frames load (0→1)
//   2. At 100%: hold 400ms (let the user register completion)
//   3. Fade out over 800ms with easeInCubic (fast departure)
//   4. onComplete callback fires → ScrollCanvas becomes active
//
// The loading screen never abruptly vanishes. It dissolves.

import { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  progress: number;       // 0→1 from ScrollCanvas preloader
  isVisible: boolean;     // Controlled by parent — set false to begin fade
  onComplete: () => void; // Called after fade-out finishes
}

export function LoadingScreen({
  progress,
  isVisible,
  onComplete,
}: LoadingScreenProps) {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(true);
  const hasStartedFade = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible && !hasStartedFade.current) {
      hasStartedFade.current = true;

      // Hold at full opacity briefly — let 100% register
      const holdTimer = setTimeout(() => {
        setOpacity(0);

        // After CSS transition completes, fully unmount
        const unmountTimer = setTimeout(() => {
          setDisplay(false);
          onComplete();
        }, 900); // slightly longer than the 800ms transition

        return () => clearTimeout(unmountTimer);
      }, 400);

      return () => clearTimeout(holdTimer);
    }
  }, [isVisible, onComplete]);

  if (!display) return null;

  const displayProgress = Math.round(progress * 100);

  return (
    <div
      ref={containerRef}
      aria-label="Loading Katana Flow"
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        opacity,
        // easeInCubic via CSS cubic-bezier approximation — exits quickly
        transition: opacity === 0 ? 'opacity 0.8s cubic-bezier(0.55, 0, 1, 0.45)' : 'none',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      {/* Brand wordmark */}
      <span
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '22px',
          fontWeight: 300,
          letterSpacing: '0.35em',
          color: '#F5F5F5',
          textTransform: 'uppercase',
        }}
      >
        Katana Flow
      </span>

      {/* Progress bar container */}
      <div
        style={{
          width: '192px',    // w-48 equivalent
          height: '1px',
          backgroundColor: '#1C1C1C',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fill — no CSS transition, updated by React state from preloader */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${displayProgress}%`,
            backgroundColor: '#D9D9D9',
            transition: 'none',
            willChange: 'width',
          }}
        />
      </div>

      {/* Numeric progress — calm, informational */}
      <span
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          color: 'rgba(217, 217, 217, 0.35)',
          textTransform: 'uppercase',
        }}
      >
        {displayProgress}
      </span>
    </div>
  );
}
