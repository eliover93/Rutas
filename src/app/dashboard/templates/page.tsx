import Link from 'next/link';
import { Plus, LayoutTemplate, Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { resolveCoverImage } from '@/lib/coverImage';
import { detectTheme } from '@/lib/themes';
import { createTemplate, duplicateTemplate, deleteTemplate } from './actions';
import type { ThemeKey } from '@/types/database.types';

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from('proposals')
    .select('*')
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  const list = templates ?? [];

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Plantillas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guarda un viaje que repites a menudo y reutilízalo como punto de partida para cada cliente nuevo.
          </p>
        </div>
        <form action={createTemplate}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-transform hover:scale-[1.02]"
          >
            <Plus size={16} /> Nueva plantilla
          </button>
        </form>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <LayoutTemplate size={28} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aún no tienes plantillas. Crea la primera con un viaje que sueles repetir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => {
            const theme = (t.theme_key as ThemeKey) ?? detectTheme(t.destination);
            const cover = resolveCoverImage(t.cover_image_url, theme);
            return (
              <div key={t.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative h-32 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={t.destination} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="mb-0.5 text-xs text-muted-foreground">{t.destination}</p>
                  <h3 className="mb-3 truncate text-sm font-semibold text-foreground">{t.title}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <Link href={`/dashboard/editor/${t.id}`} className="font-medium text-muted-foreground hover:underline">
                      Editar
                    </Link>
                    <form action={duplicateTemplate.bind(null, t.id)}>
                      <button type="submit" className="flex items-center gap-1 font-medium text-primary hover:underline">
                        <Copy size={12} /> Usar como base
                      </button>
                    </form>
                    <form action={deleteTemplate.bind(null, t.id)} className="ml-auto">
                      <button type="submit" className="text-red-500 hover:underline">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
