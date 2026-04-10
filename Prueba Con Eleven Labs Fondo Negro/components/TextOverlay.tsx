'use client';

// ─── KATANA FLOW — Text Overlay ───────────────────────────────────────────────
// Three text sections, each with a precise 4-point opacity envelope.
// Sections appear and dissolve based on scroll progress — never triggered,
// always a consequence of where the blade exists in its motion arc.
//
// CRITICAL: transition: 'none' on all animated properties.
// CSS transitions would compound with our programmatic easing, creating
// a double-easing artifact that breaks the continuity of motion.
//
// The translateY lift is NOT independently eased — it inherits the opacity
// curve by being derived from it: `(1 - opacity) * 12px`. Free easing.

import { envelopeOpacity } from '@/lib/easing';
import { TEXT_SECTIONS } from '@/lib/constants';

interface TextOverlayProps {
  progress: number; // Smoothed scroll progress 0→1
}

// Position map — exact placement per spec
const POSITION_STYLES: Record<typeof TEXT_SECTIONS[number]['position'], React.CSSProperties> = {
  'bottom-left': {
    position: 'fixed',
    bottom: '4rem',
    left: '3rem',
    textAlign: 'left',
  },
  'top-right': {
    position: 'fixed',
    top: '6rem',
    right: '3rem',
    textAlign: 'right',
  },
  'center': {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
};

export function TextOverlay({ progress }: TextOverlayProps) {
  return (
    <>
      {TEXT_SECTIONS.map((section) => {
        const opacity = envelopeOpacity(
          progress,
          [section.start, section.fadeInEnd],
          [section.fadeInEnd, section.fadeOutStart],
          [section.fadeOutStart, section.end]
        );

        // Skip render entirely when fully invisible — saves compositor work
        if (opacity === 0) return null;

        // Vertical lift: derived from opacity curve — inherits easing for free
        // Center section: lift is vertical (translateY) — override the transform
        const baseTransform = section.position === 'center'
          ? `translate(-50%, calc(-50% + ${(1 - opacity) * 12}px))`
          : `translateY(${(1 - opacity) * 12}px)`;

        return (
          <div
            key={section.id}
            aria-hidden={opacity < 0.05}
            style={{
              ...POSITION_STYLES[section.position],
              ...(section.position !== 'center' && { transform: baseTransform }),
              ...(section.position === 'center' && { transform: baseTransform }),
              opacity,
              transition: 'none',       // NEVER CSS-transition — we drive this
              willChange: 'opacity, transform',
              pointerEvents: 'none',    // Never intercept scroll events
              zIndex: 10,
              maxWidth: '520px',
            }}
          >
            {/* Headline — Cormorant Garamond, cinematic scale */}
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(48px, 6vw, 96px)',
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: '#F5F5F5',
                margin: 0,
                padding: 0,
              }}
            >
              {section.headline}
            </h2>

            {/* Body — Inter, quiet and clear */}
            <p
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                lineHeight: 1.6,
                letterSpacing: '0.1em',
                color: '#D9D9D9',
                textTransform: 'uppercase',
                marginTop: '1.25rem',
                marginBottom: 0,
                padding: 0,
                opacity: 0.7,
              }}
            >
              {section.body}
            </p>
          </div>
        );
      })}
    </>
  );
}
