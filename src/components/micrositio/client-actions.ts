'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProposalStatus(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('proposals').update({ status: 'accepted' }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/p');
}
