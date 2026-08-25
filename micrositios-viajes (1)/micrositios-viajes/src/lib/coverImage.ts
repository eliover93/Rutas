import type { ThemeKey } from '@/types/database.types';

// picsum.photos con seed fija: a diferencia de URLs concretas de Unsplash
// (que apuntan a una foto exacta y pueden no existir o desaparecer),
// picsum.photos/seed/<algo> SIEMPRE devuelve una imagen válida — es un
// servicio de imágenes de relleno diseñado para no romperse nunca.
// La seed fija garantiza que el mismo tema muestre siempre la misma foto.
const FALLBACK_BY_THEME: Record<ThemeKey, string> = {
  mediterraneo: 'https://picsum.photos/seed/rutas-mediterraneo/1600/900',
  asiatico: 'https://picsum.photos/seed/rutas-asiatico/1600/900',
  tropical: 'https://picsum.photos/seed/rutas-tropical/1600/900',
  nordico: 'https://picsum.photos/seed/rutas-nordico/1600/900',
  safari: 'https://picsum.photos/seed/rutas-safari/1600/900',
};

/**
 * Orden de resolución:
 * 1. Foto subida por la agencia (cover_image_url)
 * 2. Foto fija de fallback por tema — garantizada por el servicio, nunca 404.
 */
export function resolveCoverImage(coverImageUrl: string | null, theme: ThemeKey): string {
  return coverImageUrl || FALLBACK_BY_THEME[theme];
}

export function fallbackCoverImage(theme: ThemeKey): string {
  return FALLBACK_BY_THEME[theme];
}
