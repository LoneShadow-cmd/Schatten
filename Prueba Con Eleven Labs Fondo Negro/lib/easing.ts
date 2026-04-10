// ─── KATANA FLOW — Easing Mathematics ────────────────────────────────────────
// Every eased value in the project flows through these functions.
// All functions: t ∈ [0, 1] → [0, 1] unless otherwise noted.
// NEVER use linear interpolation for visible motion — cubic minimum.

// ─── Primitives ──────────────────────────────────────────────────────────────

export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear lerp — used ONLY for:
 *   • cursor ring position chasing (frame-by-frame, imperceptibly small steps)
 *   • scroll smoothing (applied every rAF tick, cumulative effect is non-linear)
 *
 * Never use for a single-shot transition. The non-linear feel comes from
 * applying lerp repeatedly, not from a single call.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Easing Curves ───────────────────────────────────────────────────────────

/**
 * Cubic ease-in-out.
 * f(t) = t < 0.5 ? 4t³ : 1 - (-2t + 2)³ / 2
 *
 * Use for: text section opacity, navbar opacity.
 * Feels: symmetric, controlled acceleration and deceleration.
 */
export function easeInOutCubic(t: number): number {
  const c = clamp(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/**
 * Cubic ease-out — deceleration only.
 * f(t) = 1 - (1 - t)³
 *
 * Use for: secondary fade transitions.
 * Feels: fast start, gentle arrival.
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp(t), 3);
}

/**
 * Cubic ease-in — acceleration only.
 * f(t) = t³
 *
 * Use for: loading screen fade-out (exits quickly, not lingers).
 */
export function easeInCubic(t: number): number {
  return Math.pow(clamp(t), 3);
}

/**
 * Quintic ease-out — the "Katana curve".
 * f(t) = 1 - (1 - t)⁵
 *
 * Heavier tail than cubic — blade decelerates with authority.
 * Use for: the primary scroll-to-frame mapping via smoothed progress.
 * Feels: fast initial response, long graceful deceleration into stillness.
 */
export function easeKatana(t: number): number {
  return 1 - Math.pow(1 - clamp(t), 5);
}

// ─── Envelope & Section Utilities ────────────────────────────────────────────

/**
 * Maps a global progress value through a local window [start, end] → [0, 1].
 * Returns 0 outside the window.
 */
export function sectionProgress(
  globalProgress: number,
  start: number,
  end: number
): number {
  if (globalProgress <= start || globalProgress >= end) return 0;
  return clamp((globalProgress - start) / (end - start));
}

/**
 * 4-point trapezoidal opacity envelope.
 * Shape: 0 ──ramp-up──▶ 1 ──hold──▶ 1 ──ramp-down──▶ 0
 *
 * @param p           Global scroll progress (0–1)
 * @param fadeIn      [start, end] of the ramp-up phase
 * @param hold        [start, end] of the full-opacity hold phase
 * @param fadeOut     [start, end] of the ramp-down phase
 *
 * The ramps use easeInOutCubic — never linear.
 */
export function envelopeOpacity(
  p: number,
  fadeIn: [number, number],
  hold: [number, number],
  fadeOut: [number, number]
): number {
  // Outside all phases
  if (p < fadeIn[0] || p > fadeOut[1]) return 0;

  // Full opacity hold
  if (p >= hold[0] && p <= hold[1]) return 1;

  // Fade in ramp
  if (p >= fadeIn[0] && p < hold[0]) {
    const t = (p - fadeIn[0]) / (hold[0] - fadeIn[0]);
    return easeInOutCubic(t);
  }

  // Fade out ramp
  if (p > hold[1] && p <= fadeOut[1]) {
    const t = (p - hold[1]) / (fadeOut[1] - hold[1]);
    return easeInOutCubic(1 - t);
  }

  return 0;
}
