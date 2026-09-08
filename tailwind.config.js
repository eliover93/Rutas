/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.985 0.012 85)',
        foreground: 'oklch(0.22 0.035 250)',
        primary: {
          DEFAULT: 'oklch(0.6 0.17 45)',
          hover: 'oklch(0.53 0.17 45)',
          foreground: 'oklch(0.99 0.01 85)',
        },
        secondary: {
          DEFAULT: 'oklch(0.95 0.022 85)',
          foreground: 'oklch(0.24 0.035 250)',
        },
        surface: 'oklch(1 0 0)',
        border: 'oklch(0.84 0.022 85)',
        muted: {
          foreground: 'oklch(0.4 0.03 250)',
        },
        accent: {
          DEFAULT: 'oklch(0.72 0.11 200)',
          foreground: 'oklch(0.16 0.04 225)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
