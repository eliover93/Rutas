const UNSPLASH_API = 'https://api.unsplash.com';

export interface UnsplashResult {
  id: string;
  url: string;
  thumbUrl: string;
  credit: string;
  creditUrl: string;
}

export async function searchUnsplash(query: string): Promise<UnsplashResult[]> {
  const res = await fetch(
    `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
    {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      // Evita agotar el límite de 50 req/hora en modo Demo si varias
      // agencias buscan lo mismo en poco tiempo.
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error(`Unsplash respondió ${res.status}`);

  const data = await res.json();

  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    url: r.urls.regular,
    thumbUrl: r.urls.thumb,
    credit: r.user.name,
    creditUrl: `${r.user.links.html}?utm_source=rutas&utm_medium=referral`,
  }));
}

// Unsplash exige registrar cada vez que una foto se "usa" de verdad
// (no solo se busca) — ver https://help.unsplash.com/en/articles/2511258
export async function trackUnsplashDownload(photoId: string) {
  await fetch(`${UNSPLASH_API}/photos/${photoId}/download`, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  }).catch(() => {}); // no crítico: si falla, no bloquea al usuario
}
