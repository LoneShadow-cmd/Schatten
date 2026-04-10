import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Cursor } from '@/components/Cursor';
import './globals.css';

// ─── Font Loading ─────────────────────────────────────────────────────────────
// next/font self-hosts fonts from the edge — no external Google Fonts request.
// Fonts are available at build time. display: 'swap' prevents FOIT.
// CSS variables are injected onto <html> and used throughout via Tailwind.

const cormorant = Cormorant_Garamond({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Katana Flow — Precision in Motion',
  description:
    'A cinematic scroll experience centered on control, motion, stillness, and mastery.',
  openGraph: {
    title: 'Katana Flow — Precision in Motion',
    description: 'A cinematic scroll experience centered on control, motion, stillness, and mastery.',
    type: 'website',
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Both font variables available to all descendants via CSS var()
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body>
        {/* Cursor renders above everything — fixed position, z-index 9999 */}
        <Cursor />
        {children}
      </body>
    </html>
  );
}
