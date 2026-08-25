import type { ThemeKey } from '@/types/database.types';

export interface ThemeStyle {
  label: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
  font: string;
  radius: string;
}

export const THEME_STYLES: Record<ThemeKey, ThemeStyle> = {
  mediterraneo: {
    label: 'Mediterráneo',
    primary: '#0891b2',
    accent: '#f0e6d2',
    bg: '#fdfbf7',
    text: '#0f172a',
    font: '"Poppins", sans-serif',
    radius: '1.25rem',
  },
  asiatico: {
    label: 'Asiático / Zen',
    primary: '#b91c1c',
    accent: '#e8ded0',
    bg: '#f5f0e6',
    text: '#1c1917',
    font: '"Noto Serif", serif',
    radius: '0.5rem',
  },
  tropical: {
    label: 'Tropical / Paradise',
    primary: '#059669',
    accent: '#fb923c',
    bg: '#f0fdf4',
    text: '#052e16',
    font: '"Baloo 2", sans-serif',
    radius: '1.5rem',
  },
  nordico: {
    label: 'Nórdico / Ártico',
    primary: '#0369a1',
    accent: '#e2e8f0',
    bg: '#f8fafc',
    text: '#0f172a',
    font: '"Inter", sans-serif',
    radius: '0.375rem',
  },
  safari: {
    label: 'Safari / Savanna',
    primary: '#b45309',
    accent: '#f3dfc0',
    bg: '#fef3c7',
    text: '#292524',
    font: '"Fraunces", serif',
    radius: '0.75rem',
  },
};

export function themeVars(theme: ThemeKey): React.CSSProperties {
  const t = THEME_STYLES[theme];
  return {
    '--color-primary': t.primary,
    '--color-accent': t.accent,
    '--color-bg': t.bg,
    '--color-text': t.text,
    '--font-theme': t.font,
    '--radius-theme': t.radius,
  } as React.CSSProperties;
}
