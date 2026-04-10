'use client';

// ─── KATANA FLOW — Grain Overlay ─────────────────────────────────────────────
// A barely-perceptible film grain texture layered over the entire viewport.
// It must be felt, not seen. opacity: 0.03 is non-negotiable.
//
// Uses an inline SVG feTurbulence filter as a CSS background-image.
// No JavaScript overhead — pure CSS rendering, GPU-composited.

export function GrainOverlay() {
  // SVG noise filter — fractalNoise gives organic grain, not digital static
  // stitchTiles: stitch prevents visible seams at tile boundaries
  const svgNoise = encodeURIComponent(
    `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="1"/>
    </svg>`
  );

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svgNoise}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
        opacity: 0.03,
        mixBlendMode: 'overlay',
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        willChange: 'auto',
      }}
    />
  );
}
