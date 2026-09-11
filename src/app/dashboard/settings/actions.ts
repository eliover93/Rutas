'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDomainToProject, getDomainConfig, removeDomainFromProject } from '@/lib/vercel';

async function getAgencyId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
  if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');
  return profile.agency_id;
}

export async function updateBranding(formData: FormData) {
  try {
    const supabase = await createClient();
    const agencyId = await getAgencyId(supabase);

    let logoUrl = (formData.get('logo_url') as string) || null;

    const logoFile = formData.get('logo_file') as File | null;
    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split('.').pop() || 'png';
      const path = `${agencyId}/logo-${Date.now()}.${ext}`;

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
      })
      .eq('id', agencyId);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/settings');
    revalidatePath('/p', 'layout');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}`);
  }

  redirect('/dashboard/settings?saved=1');
}

// Conecta el dominio: lo añade en Vercel y guarda el dato — todavía sin
// verificar, hasta que el DNS de la agencia apunte bien.
export async function connectDomain(formData: FormData) {
  try {
    const supabase = await createClient();
    const agencyId = await getAgencyId(supabase);

    const domain = ((formData.get('domain') as string) || '').trim().toLowerCase();
    if (!domain) throw new Error('Escribe un dominio');

    await addDomainToProject(domain);

    const { error } = await supabase
      .from('agencies')
      .update({ custom_domain: domain, custom_domain_verified: false })
      .eq('id', agencyId);
    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/settings');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}#dominio`);
  }
  redirect('/dashboard/settings?saved=1#dominio');
}

// Vuelve a preguntarle a Vercel si el DNS ya está bien configurado.
export async function checkDomainStatus() {
  try {
    const supabase = await createClient();
    const agencyId = await getAgencyId(supabase);

    const { data: agency } = await supabase.from('agencies').select('custom_domain').eq('id', agencyId).single();
    if (!agency?.custom_domain) throw new Error('No hay dominio conectado');

    const config = await getDomainConfig(agency.custom_domain);
    const verified = !config.misconfigured;

    const { error } = await supabase
      .from('agencies')
      .update({ custom_domain_verified: verified })
      .eq('id', agencyId);
    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/settings');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}#dominio`);
  }
  redirect('/dashboard/settings?saved=1#dominio');
}

// Quita el dominio, tanto de Vercel como de la ficha de la agencia.
export async function disconnectDomain() {
  try {
    const supabase = await createClient();
    const agencyId = await getAgencyId(supabase);

    const { data: agency } = await supabase.from('agencies').select('custom_domain').eq('id', agencyId).single();
    if (agency?.custom_domain) {
      await removeDomainFromProject(agency.custom_domain);
    }

    const { error } = await supabase
      .from('agencies')
      .update({ custom_domain: null, custom_domain_verified: false })
      .eq('id', agencyId);
    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/settings');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}#dominio`);
  }
  redirect('/dashboard/settings?saved=1#dominio');
}
