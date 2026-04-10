'use client';

// ─── KATANA FLOW — Page ───────────────────────────────────────────────────────
// Final assembly. Everything comes together here.
//
// Z-index stack (front to back):
//   Cursor        z-9999  — always above everything (in layout.tsx)
//   LoadingScreen z-40    — covers until frames are ready
//   GrainOverlay  z-30    — fixed texture over all content
//   Navbar        z-20    — fixed navigation
//   TextOverlay   z-10    — cinematic text sections
//   ScrollCanvas  z-0     — the katana
//
// State flow:
//   1. Page mounts — LoadingScreen visible, ScrollCanvas preloading
//   2. Frames load → onLoadProgress(0→1) fills progress bar
//   3. All frames loaded → isLoadingComplete = true → LoadingScreen fades out
//   4. LoadingScreen fade complete → onComplete() → isExperienceActive = true
//   5. Experience fully active — all components responsive to scroll

import { useState, useCallback } from 'react';
import { ScrollCanvas } from '@/components/ScrollCanvas';
import { TextOverlay } from '@/components/TextOverlay';
import { Navbar } from '@/components/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { GrainOverlay } from '@/components/GrainOverlay';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { SCROLL_HEIGHT_VH } from '@/lib/constants';

export default function Page() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isExperienceActive, setIsExperienceActive] = useState(false);

  const { smooth, raw, scrollY, velocity, direction } = useScrollProgress();

  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p);
    if (p >= 1) {
      setIsLoadingComplete(true);
    }
  }, []);

  const handleLoadComplete = useCallback(() => {
    setIsLoadingComplete(true);
  }, []);

  const handleLoadingScreenDone = useCallback(() => {
    setIsExperienceActive(true);
  }, []);

  return (
    <main>
      {/* ── Loading Screen ──────────────────────────────────────────────────
          Always rendered until fade-out completes (display: none after).
          Sits above all experience content. */}
      <LoadingScreen
        progress={loadProgress}
        isVisible={!isLoadingComplete}
        onComplete={handleLoadingScreenDone}
      />

      {/* ── Grain Texture ───────────────────────────────────────────────────
          Fixed, z-30 — present during loading and experience alike. */}
      <GrainOverlay />

      {/* ── Navbar ──────────────────────────────────────────────────────────
          Only meaningful after experience starts — passes raw pixel Y for
          threshold-based opacity calculation. */}
      {isExperienceActive && (
        <Navbar scrollY={scrollY} />
      )}

      {/* ── Scroll Container ────────────────────────────────────────────────
          500vh of scroll space. The sticky canvas anchors inside this.
          This is the only scrollable element on the page. */}
      <div
        style={{
          height: `${SCROLL_HEIGHT_VH}vh`,
          position: 'relative',
        }}
      >
        {/* Sticky canvas — stays in viewport while container scrolls past */}
        <ScrollCanvas
          smoothProgress={smooth}
          velocity={velocity}
          direction={direction}
          onLoadProgress={handleLoadProgress}
          onLoaded={handleLoadComplete}
        />
      </div>

      {/* ── Text Overlay ────────────────────────────────────────────────────
          Fixed, z-10 — positioned above the canvas, below grain.
          Only rendered once the experience is active to avoid flicker. */}
      {isExperienceActive && (
        <TextOverlay progress={smooth} />
      )}
    </main>
  );
}
