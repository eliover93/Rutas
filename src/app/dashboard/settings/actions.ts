'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBranding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single();
  if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');

  const { error } = await supabase
    .from('agencies')
    .update({
      logo_url: (formData.get('logo_url') as string) || null,
      brand_color: (formData.get('brand_color') as string) || '#0ea5e9',
      custom_domain: (formData.get('custom_domain') as string) || null,
    })
    .eq('id', profile.agency_id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/settings');
  revalidatePath('/p', 'layout'); // el color/logo se ve en todos los micrositios de la agencia
}
