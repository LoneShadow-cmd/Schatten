'use client';

// ─── KATANA FLOW — Scroll Progress Hook ──────────────────────────────────────
// The nervous system of the entire experience.
//
// Architecture:
//   scroll event → rawRef (immediate, no React overhead)
//   rAF loop     → lerps smoothRef toward rawRef every paint frame
//   React state  → updated only when change exceeds threshold (prevents churn)
//
// This separation is CRITICAL. Doing lerp inside the scroll event handler
// is wrong — scroll events fire off the main thread. Doing lerp in rAF
// syncs the smooth value to the browser paint cycle for true 60fps feel.

import { useEffect, useRef, useState } from 'react';
import { lerp, clamp } from '@/lib/easing';
import { SCROLL_LERP_FACTOR } from '@/lib/constants';

export interface ScrollProgressState {
  raw: number;          // Actual scroll position 0→1 (unsmoothed)
  smooth: number;       // Lerp-eased scroll position 0→1
  scrollY: number;      // Raw pixel scroll position (for navbar threshold)
  direction: 1 | -1;   // 1 = scrolling down, -1 = scrolling up
  velocity: number;     // Normalized absolute velocity 0→1
}

const INITIAL_STATE: ScrollProgressState = {
  raw: 0,
  smooth: 0,
  scrollY: 0,
  direction: 1,
  velocity: 0,
};

// Minimum meaningful change to trigger a React re-render.
// Filters sub-perceptual micro-updates that would waste render cycles.
const UPDATE_THRESHOLD = 0.0005;

export function useScrollProgress(): ScrollProgressState {
  // Refs hold the live values — refs never trigger re-renders
  const rawRef = useRef(0);
  const smoothRef = useRef(0);
  const scrollYRef = useRef(0);
  const prevRawRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number>(0);

  const [state, setState] = useState<ScrollProgressState>(INITIAL_STATE);

  useEffect(() => {
    // SSR guard — window does not exist during server render
    if (typeof window === 'undefined') return;

    const getMaxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      const raw = clamp(scrollTop / maxScroll);
      directionRef.current = raw >= rawRef.current ? 1 : -1;
      velocityRef.current = Math.abs(raw - rawRef.current);
      rawRef.current = raw;
      scrollYRef.current = scrollTop;
    };

    // rAF loop — runs independently of scroll events.
    // This is where all smoothing happens.
    const tick = () => {
      const target = rawRef.current;
      const prev = smoothRef.current;

      // Adaptive lerp: when the user jumps (keyboard, Page Down) or
      // scrolls very fast, catch up faster to avoid "stuck" feeling.
      const distance = Math.abs(target - prev);
      const factor = distance > 0.1
        ? SCROLL_LERP_FACTOR * 2.5  // aggressive catch-up for large jumps
        : SCROLL_LERP_FACTOR;

      smoothRef.current = lerp(prev, target, factor);

      // Only push to React state when the change is perceptible.
      // This prevents 60 state updates per second when scroll is idle.
      const changed =
        Math.abs(smoothRef.current - prev) > UPDATE_THRESHOLD ||
        prevRawRef.current !== rawRef.current;

      if (changed) {
        prevRawRef.current = rawRef.current;
        setState({
          raw: rawRef.current,
          smooth: smoothRef.current,
          scrollY: scrollYRef.current,
          direction: directionRef.current,
          velocity: velocityRef.current,
        });
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    // passive: true — browser can optimize scroll, we never call preventDefault
    window.addEventListener('scroll', handleScroll, { passive: true });
    // iOS: touchmove fires during momentum scroll where 'scroll' may not
    window.addEventListener('touchmove', handleScroll, { passive: true });

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return state;
}
