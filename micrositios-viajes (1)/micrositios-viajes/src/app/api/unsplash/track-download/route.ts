import { NextResponse } from 'next/server';
import { trackUnsplashDownload } from '@/lib/unsplash';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (id) await trackUnsplashDownload(id);
  return NextResponse.json({ ok: true });
}
