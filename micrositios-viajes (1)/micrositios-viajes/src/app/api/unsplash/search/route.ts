import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchUnsplash } from '@/lib/unsplash';

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const query = new URL(req.url).searchParams.get('q');
  if (!query) return NextResponse.json({ results: [] });

  try {
    const results = await searchUnsplash(query);
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: 'Error buscando en Unsplash' }, { status: 502 });
  }
}
