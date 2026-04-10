'use client';

// ─── KATANA FLOW — ScrollCanvas ───────────────────────────────────────────────
// The heart of the experience.
//
// Responsibilities:
//   1. Preload ALL frames before signaling readiness
//   2. Maintain a cover-fit render loop synchronized to smoothed scroll progress
//   3. Apply micro-parallax based on scroll velocity and direction
//   4. Handle devicePixelRatio for Retina/HiDPI clarity
//   5. Respond correctly to viewport resize events
//
// Architecture notes:
//
//   Module-level frameCache — persists across React re-mounts.
//   Frames load once for the lifetime of the page, never again.
//
//   The rAF render loop reads from smoothProgressRef (a ref, not state).
//   This prevents the double-render artifact that occurs when React state
//   updates trigger component re-renders during the animation loop.
//
//   ImageBitmap is used where supported — pre-decoded into GPU-ready format.
//   On browsers without ImageBitmap support, falls back to HTMLImageElement.
//
//   Concurrency is capped at FRAME_LOAD_CONCURRENCY (20) to prevent
//   saturating the browser's connection pool during preload.

import { useCallback, useEffect, useRef } from 'react';
import { TOTAL_FRAMES, MOBILE_FRAME_SKIP, FRAME_LOAD_CONCURRENCY } from '@/lib/constants';

// ─── Module-Level Frame Cache ────────────────────────────────────────────────
// Indexed by frame number (1-based, matching ffmpeg output).
// Survives hot reloads and component re-mounts.

type FrameImage = HTMLImageElement | ImageBitmap;
const frameCache: Map<number, FrameImage> = new Map();
let cachePopulated = false;
let cachedFrameNumbers: number[] = [];

// Feature detection — runs once at module load
const supportsImageBitmap =
  typeof window !== 'undefined' && typeof createImageBitmap !== 'undefined';

// ─── Concurrency-Limited Loader ──────────────────────────────────────────────

async function loadFramesConcurrent(
  frameNumbers: number[],
  onProgress: (loaded: number, total: number) => void
): Promise<void> {
  if (cachePopulated) {
    onProgress(frameNumbers.length, frameNumbers.length);
    return;
  }

  let loaded = 0;
  const total = frameNumbers.length;
  let index = 0;

  // Worker: pulls tasks from the shared index counter
  const worker = async () => {
    while (true) {
      const i = index++;
      if (i >= total) break;

      const frameNum = frameNumbers[i];
      const padded = String(frameNum).padStart(4, '0');
      const src = `/frames/frame_${padded}.webp`;

      try {
        if (supportsImageBitmap) {
          const response = await fetch(src);
          const blob = await response.blob();
          const bitmap = await createImageBitmap(blob);
          frameCache.set(frameNum, bitmap);
        } else {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              frameCache.set(frameNum, img);
              resolve();
            };
            img.onerror = () => resolve(); // Missing frame — skip gracefully
            img.src = src;
          });
        }
      } catch {
        // Network error or missing frame — continue loading remaining frames
      }

      loaded++;
      onProgress(loaded, total);
    }
  };

  // Launch N workers in parallel, each pulling from the shared counter
  await Promise.all(
    Array.from({ length: FRAME_LOAD_CONCURRENCY }, () => worker())
  );

  cachePopulated = true;
}

// ─── Cover-Fit Draw ──────────────────────────────────────────────────────────

function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: FrameImage,
  cssW: number,
  cssH: number,
  parallaxY: number
): void {
  // Clear and fill with deep background (handles any transparent webp edges)
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, cssW, cssH);

  const srcW = 'naturalWidth' in frame ? frame.naturalWidth : (frame as ImageBitmap).width;
  const srcH = 'naturalHeight' in frame ? frame.naturalHeight : (frame as ImageBitmap).height;

  if (srcW === 0 || srcH === 0) return;

  // Cover-fit: scale to fill the viewport, maintain aspect ratio
  const scale = Math.max(cssW / srcW, cssH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;

  // Center the image; apply parallax offset (max ±8px vertical)
  const x = (cssW - drawW) / 2;
  const y = (cssH - drawH) / 2 + parallaxY;

  ctx.drawImage(frame as CanvasImageSource, x, y, drawW, drawH);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ScrollCanvasProps {
  smoothProgress: number;       // From useScrollProgress().smooth
  velocity: number;             // From useScrollProgress().velocity
  direction: 1 | -1;           // From useScrollProgress().direction
  onLoadProgress: (p: number) => void; // 0→1 loading progress
  onLoaded: () => void;         // Called when all frames are ready
}

export function ScrollCanvas({
  smoothProgress,
  velocity,
  direction,
  onLoadProgress,
  onLoaded,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothProgressRef = useRef(smoothProgress);
  const velocityRef = useRef(velocity);
  const directionRef = useRef(direction);
  const isLoadedRef = useRef(false);
  const cssWRef = useRef(0);
  const cssHRef = useRef(0);
  const onLoadedRef = useRef(onLoaded);

  // Sync callback ref — prevents stale closure in useEffect
  useEffect(() => { onLoadedRef.current = onLoaded; }, [onLoaded]);

  // Sync scroll values to refs — rAF loop reads these, not props
  useEffect(() => { smoothProgressRef.current = smoothProgress; }, [smoothProgress]);
  useEffect(() => { velocityRef.current = velocity; }, [velocity]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  // ─── Canvas Sizing ──────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;

    cssWRef.current = cssW;
    cssHRef.current = cssH;

    // Physical pixel dimensions — sharp on Retina/HiDPI displays
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    // CSS dimensions — canvas occupies full viewport in CSS space
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // Scale context to dpr — all drawImage calls use CSS pixel coords
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // ─── Resize Observer ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(document.documentElement);

    return () => observer.disconnect();
  }, [resizeCanvas]);

  // ─── Frame Preloading ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (cachePopulated) {
      onLoadProgress(1);
      onLoadedRef.current();
      isLoadedRef.current = true;
      return;
    }

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      navigator.maxTouchPoints > 0;

    const skip = isMobile ? MOBILE_FRAME_SKIP : 1;

    // Build frame number list (1-based, matching ffmpeg output frame_%04d)
    const frameNumbers: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += skip) {
      frameNumbers.push(i);
    }
    cachedFrameNumbers = frameNumbers;

    loadFramesConcurrent(frameNumbers, (loaded, total) => {
      const progress = loaded / total;
      onLoadProgress(progress);

      if (loaded === total) {
        isLoadedRef.current = true;
        onLoadedRef.current();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — runs once on mount

  // ─── Render Loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;

    const render = () => {
      if (!isLoadedRef.current || cachedFrameNumbers.length === 0) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const progress = smoothProgressRef.current;
      const total = cachedFrameNumbers.length;

      // Map progress to frame index — clamped to prevent out-of-bounds
      const frameIdx = Math.min(
        Math.floor(progress * (total - 1)),
        total - 1
      );
      const frameNum = cachedFrameNumbers[Math.max(0, frameIdx)];
      const frame = frameCache.get(frameNum);

      if (frame) {
        // Micro-parallax: subtle vertical shift based on scroll velocity
        // Max ±8px — barely perceptible, reinforces depth
        const parallax = velocityRef.current * directionRef.current * -800;
        // Clamp parallax to ±8px — never displace so far that edges show
        const clampedParallax = Math.max(-8, Math.min(8, parallax));

        drawFrame(ctx, frame, cssWRef.current, cssHRef.current, clampedParallax);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, []); // Intentionally empty — render loop is self-contained via refs

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'sticky',
        top: 0,
        display: 'block',
        backgroundColor: '#050505',
        zIndex: 0,
      }}
    />
  );
}
