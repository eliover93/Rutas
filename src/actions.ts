'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { DayCategory } from '@/types/database.types';

function toArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

async function revalidateProposal(supabase: Awaited<ReturnType<typeof createClient>>, proposalId: string) {
  const { data } = await supabase.from('proposals').select('public_slug').eq('id', proposalId).single();
  revalidatePath(`/dashboard/editor/${proposalId}`);
  if (data?.public_slug) revalidatePath(`/p/${data.public_slug}`);
}

export async function updateProposalDetails(proposalId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('proposals')
    .update({
      title: formData.get('title'),
      theme_key: (formData.get('theme_key') as string) || null,
      client_message: (formData.get('client_message') as string) || null,
      cover_image_url: (formData.get('cover_image_url') as string) || null,
      cover_image_credit: (formData.get('cover_image_credit') as string) || null,
      cover_image_credit_url: (formData.get('cover_image_credit_url') as string) || null,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      hotel_name: (formData.get('hotel_name') as string) || null,
      hotel_stars: formData.get('hotel_stars') ? Number(formData.get('hotel_stars')) : null,
      hotel_image_url: (formData.get('hotel_image_url') as string) || null,
      hotel_image_credit: (formData.get('hotel_image_credit') as string) || null,
      hotel_image_credit_url: (formData.get('hotel_image_credit_url') as string) || null,
      price_includes: toArray(formData.get('price_includes')),
      price_excludes: toArray(formData.get('price_excludes')),
    })
    .eq('id', proposalId);

  if (error) throw new Error(error.message);
  await revalidateProposal(supabase, proposalId);
}

export async function upsertDay(proposalId: string, dayId: string | null, formData: FormData) {
  const supabase = await createClient();

  const dayNumber = Number(formData.get('day_number'));
  const payload = {
    proposal_id: proposalId,
    day_number: dayNumber,
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    category: ((formData.get('category') as string) || null) as DayCategory | null,
    image_url: (formData.get('image_url') as string) || null,
    image_credit: (formData.get('image_credit') as string) || null,
    image_credit_url: (formData.get('image_credit_url') as string) || null,
    order_index: dayNumber - 1,
  };

  const { error } = dayId
    ? await supabase.from('itinerary_days').update(payload).eq('id', dayId)
    : await supabase.from('itinerary_days').insert(payload);

  if (error) throw new Error(error.message);
  await revalidateProposal(supabase, proposalId);
}

export async function deleteDay(proposalId: string, dayId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('itinerary_days').delete().eq('id', dayId);
  if (error) throw new Error(error.message);
  await revalidateProposal(supabase, proposalId);
}
