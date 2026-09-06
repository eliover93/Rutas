'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateBranding(formData: FormData) {
  // --- DEBUG TEMPORAL: nos dice exactamente qué llegó al servidor ---
  const logoFileDebug = formData.get('logo_file');
  const debugInfo =
    logoFileDebug instanceof File
      ? `Recibido como File: nombre="${logoFileDebug.name}", tamaño=${logoFileDebug.size} bytes, tipo="${logoFileDebug.type}"`
      : `NO es un File. Tipo real: ${typeof logoFileDebug}, valor: "${String(logoFileDebug)}"`;
  // -------------------------------------------------------------

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('agency_id')
      .eq('id', user.id)
      .single();
    if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');

    let logoUrl = (formData.get('logo_url') as string) || null;

    const logoFile = formData.get('logo_file') as File | null;
    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split('.').pop() || 'png';
      const path = `${profile.agency_id}/logo-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { contentType: logoFile.type, upsert: true });

      if (uploadError) throw new Error(`No se pudo subir el logo: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(path);
      logoUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from('agencies')
      .update({
        logo_url: logoUrl,
        brand_color: (formData.get('brand_color') as string) || '#0ea5e9',
        custom_domain: (formData.get('custom_domain') as string) || null,
      })
      .eq('id', profile.agency_id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/settings');
    revalidatePath('/p', 'layout');

    redirect(`/dashboard/settings?error=${encodeURIComponent('DEBUG (todo OK) — ' + debugInfo)}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) throw err;
    const message = err instanceof Error ? err.message : 'Error desconocido';
    redirect(`/dashboard/settings?error=${encodeURIComponent('DEBUG (con error) — ' + debugInfo + ' | Error real: ' + message)}`);
  }
}
