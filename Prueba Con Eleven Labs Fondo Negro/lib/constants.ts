// ─── KATANA FLOW — Constants ────────────────────────────────────────────────
// Single source of truth. No magic numbers anywhere else in the codebase.

// UPDATE this after running:
//   ffmpeg -i katana-animation.mp4 -vf fps=30 -q:v 80 public/frames/frame_%04d.webp
//   ls public/frames/ | wc -l
export const TOTAL_FRAMES = 363;

// Total scroll container height — stretches perception of time
export const SCROLL_HEIGHT_VH = 500;

// Lerp factor applied every rAF tick to smooth scroll progress.
// 0.06 ≈ 200ms of perceived inertia — heavy enough to feel weighted, not broken.
export const SCROLL_LERP_FACTOR = 0.06;

// Navbar becomes visible after this many pixels of scroll
export const NAVBAR_SCROLL_THRESHOLD = 100;

// On mobile, load every Nth frame (halves bandwidth, preserves perception)
export const MOBILE_FRAME_SKIP = 2;

// Lerp factor for cursor outer ring — higher = snappier, lower = more delay
export const CURSOR_RING_LERP = 0.12;

// Max concurrent frame fetches — prevents flooding connections
export const FRAME_LOAD_CONCURRENCY = 20;

// ─── Text Section Definitions ─────────────────────────────────────────────
// Each section: [start, fadeInEnd, fadeOutStart, end] in scroll progress units (0–1)
// Envelope shape: silent → ramp-up → hold → ramp-down → silent

export const TEXT_SECTIONS = [
  {
    id: 'section-1',
    start: 0.00,
    fadeInEnd: 0.04,
    fadeOutStart: 0.20,
    end: 0.25,
    position: 'bottom-left' as const,
    headline: 'Precision in motion.',
    body: 'Every movement follows intention.',
  },
  {
    id: 'section-2',
    start: 0.30,
    fadeInEnd: 0.34,
    fadeOutStart: 0.56,
    end: 0.60,
    position: 'top-right' as const,
    headline: 'Control without force.',
    body: 'Nothing is accidental.',
  },
  {
    id: 'section-3',
    start: 0.70,
    fadeInEnd: 0.74,
    fadeOutStart: 0.86,
    end: 0.90,
    position: 'center' as const,
    headline: 'Perfect stillness.',
    body: 'Total mastery.',
  },
] as const;

export type TextSectionPosition = 'bottom-left' | 'top-right' | 'center';
