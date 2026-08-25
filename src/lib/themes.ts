export const THEME_MAP: Record<string, string[]> = {
  mediterraneo: ['alicante', 'ibiza', 'grecia', 'santorini', 'mallorca', 'malta'],
  asiatico: ['japon', 'tailandia', 'china', 'vietnam', 'corea'],
  tropical: ['caribe', 'cancun', 'bali', 'maldivas', 'republica dominicana'],
  nordico: ['islandia', 'noruega', 'suecia', 'finlandia'],
  safari: ['kenia', 'sudafrica', 'tanzania', 'namibia'],
};

export function detectTheme(destination: string): keyof typeof THEME_MAP {
  const d = destination.toLowerCase();
  for (const [theme, keywords] of Object.entries(THEME_MAP)) {
    if (keywords.some((k) => d.includes(k))) return theme as keyof typeof THEME_MAP;
  }
  return 'mediterraneo';
}
