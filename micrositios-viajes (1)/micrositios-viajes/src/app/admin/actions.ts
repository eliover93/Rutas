'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function extendTrial(agencyId: string, days: number) {
  const supabase = createAdminClient();

  const { data: agency } = await supabase.from('agencies').select('trial_ends_at').eq('id', agencyId).single();
  if (!agency) throw new Error('Agencia no encontrada');

  const base = new Date(agency.trial_ends_at) > new Date() ? new Date(agency.trial_ends_at) : new Date();
  base.setDate(base.getDate() + days);

  const { error } = await supabase
    .from('agencies')
    .update({ trial_ends_at: base.toISOString(), subscription_status: 'trialing' })
    .eq('id', agencyId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function setSubscriptionStatus(agencyId: string, status: 'active' | 'canceled' | 'expired') {
  const supabase = createAdminClient();
  const { error } = await supabase.from('agencies').update({ subscription_status: status }).eq('id', agencyId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}
