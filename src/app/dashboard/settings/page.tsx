import Link from 'next/link';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateBranding } from './actions';
import { LogoUploadField } from '@/components/dashboard/LogoUploadField';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user?.id).single();
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile?.agency_id)
    .single();

  const hasBrandingAccess = agency?.plan === 'pro' || agency?.plan === 'team';

  if (!hasBrandingAccess) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="mb-2 font-display text-2xl text-foreground">Ajustes / Branding</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <Lock size={28} className="mx-auto mb-3 text-muted-foreground" />
          <p className="mb-1 font-medium text-foreground">Disponible en los planes Pro y Team</p>
          <p className="mb-5 text-sm text-muted-foreground">
            Tu logo, tu color de marca y un dominio propio en cada micrositio que compartas con tus clientes.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Ver planes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="mb-2 font-display text-2xl text-foreground">Ajustes / Branding</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Se aplica automáticamente en todos los micrositios que compartas con tus clientes.
      </p>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Cambios guardados correctamente.
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} /> {decodeURIComponent(error)}
        </div>
      )}

      <form action={updateBranding} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
        <LogoUploadField currentLogoUrl={agency?.logo_url} />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Color de marca</label>
          <div className="flex items-center gap-3">
            <input
              name="brand_color"
              type="color"
              defaultValue={agency?.brand_color ?? '#0ea5e9'}
              className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-background"
            />
            <input
              type="text"
              value={agency?.brand_color ?? '#0ea5e9'}
              disabled
              className="w-32 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-muted-foreground"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Reemplaza el color principal del tema visual en todos tus micrositios (el mismo tono, sea cual sea el destino).
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Dominio personalizado</label>
          <input
            name="custom_domain"
            type="text"
            placeholder="viajes.tuagencia.com"
            defaultValue={agency?.custom_domain ?? ''}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Guardamos tu preferencia ya — la conexión DNS real (para que ese dominio funcione de verdad) es la siguiente
            pieza que falta construir, todavía no está activa.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
