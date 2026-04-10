'use client';

// ─── KATANA FLOW — Custom Cursor ─────────────────────────────────────────────
// Two-layer cursor:
//   Dot  — 4px, tracks mouse exactly, immediate
//   Ring — 20px, lerp-chases the dot with a 0.12 factor delay
//
// CRITICAL: Position is set via direct DOM manipulation (el.style.transform),
// NOT via React state. React state updates on mousemove would trigger re-renders
// 60+ times per second and destroy performance.
//
// Not rendered on touch devices (no physical cursor exists).

import { useEffect, useRef } from 'react';
import { lerp } from '@/lib/easing';
import { CURSOR_RING_LERP } from '@/lib/constants';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Touch-only devices have no physical cursor — unmount gracefully
    if (navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    // Live position refs — never trigger React renders
    const dot = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: dot.x, y: dot.y };
    let isVisible = false;

    const handleMove = (e: MouseEvent) => {
      dot.x = e.clientX;
      dot.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dotRef.current!.style.opacity = '1';
        ringRef.current!.style.opacity = '1';
      }
    };

    const handleLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const tick = () => {
      // Ring lerps toward dot — delay creates the softness and continuity
      ring.x = lerp(ring.x, dot.x, CURSOR_RING_LERP);
      ring.y = lerp(ring.y, dot.y, CURSOR_RING_LERP);

      // Direct DOM transform — bypasses React entirely
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.x - 2}px, ${dot.y - 2}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 10}px, ${ring.y - 10}px)`;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot — exact mouse position, immediate */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: '#F5F5F5',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Ring — delayed, diffused, elegant */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1px solid rgba(245, 245, 245, 0.35)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  );
}
