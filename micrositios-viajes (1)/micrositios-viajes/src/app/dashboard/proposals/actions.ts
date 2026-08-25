'use server';

import { createClient } from '@/lib/supabase/server';
import { detectTheme } from '@/lib/themes';
import { revalidatePath } from 'next/cache';

export async function createProposal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single();
  if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');

  const destination = formData.get('destination') as string;

  const { error } = await supabase.from('proposals').insert({
    agency_id: profile.agency_id,
    client_name: formData.get('client_name') as string,
    title: formData.get('title') as string,
    destination,
    theme_key: detectTheme(destination),
    status: 'draft',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/proposals');
}

export async function updateProposalStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('proposals').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/proposals');
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('proposals').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/proposals');
}
