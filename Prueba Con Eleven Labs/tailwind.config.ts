import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // CSS variables injected by next/font in layout.tsx
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        'bg-deep': '#050505',
        'bg-soft': '#0A0A0A',
        'steel-dark': '#1C1C1C',
        'steel-light': '#D9D9D9',
        'accent': '#F5F5F5',
        'subtle-glow': 'rgba(255, 255, 255, 0.06)',
      },
      fontSize: {
        // Display scale per CLAUDE.md spec
        'display': ['96px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'h1': ['64px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '300' }],
        'h2': ['40px', { lineHeight: '1.1', fontWeight: '400' }],
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};

export default config;
