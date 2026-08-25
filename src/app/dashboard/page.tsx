import Link from 'next/link';
import { Plus, Eye, FileText, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { resolveCoverImage } from '@/lib/coverImage';
import { detectTheme } from '@/lib/themes';
import type { ThemeKey } from '@/types/database.types';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
};

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-secondary text-muted-foreground',
  sent: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  const list = proposals ?? [];
  const total = list.length;
  const totalViews = list.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const accepted = list.filter((p) => p.status === 'accepted').length;
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const metrics = [
    { label: 'Total propuestas', value: total, icon: FileText },
    { label: 'Vistas totales', value: totalViews, icon: Eye },
    { label: 'Ratio de aceptación', value: `${acceptanceRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Propuestas</h1>
        <Link
          href="/dashboard/proposals"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-transform hover:scale-[1.02]"
        >
          <Plus size={16} /> Nueva propuesta
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-surface p-7">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <m.icon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">{m.label}</span>
            </div>
            <p className="text-gradient-gold font-display text-4xl">{m.value}</p>
          </div>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Aún no hay propuestas. Crea la primera para empezar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const theme = (p.theme_key as ThemeKey) ?? detectTheme(p.destination);
            const cover = resolveCoverImage(p.cover_image_url, theme);

            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40">
                <div className="relative h-32 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={p.destination} className="absolute inset-0 h-full w-full object-cover" />
                  <span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <div className="p-4">
                  <p className="mb-0.5 text-xs text-muted-foreground">{p.destination}</p>
                  <h3 className="mb-1 truncate text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="mb-3 text-xs text-muted-foreground">{p.client_name}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <Link href={`/dashboard/editor/${p.id}`} className="font-medium text-muted-foreground hover:underline">
                      Editar
                    </Link>
                    <a href={`/p/${p.public_slug}`} target="_blank" className="font-medium text-primary hover:underline">
                      Ver micrositio
                    </a>
                    <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                      <Eye size={12} /> {p.views ?? 0}
                    </span>
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
