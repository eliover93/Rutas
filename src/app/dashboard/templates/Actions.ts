'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

async function getAgencyId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
  if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');
  return profile.agency_id;
}

function newSlug() {
  return crypto.randomBytes(6).toString('hex');
}

// Crea una plantilla vacía y te lleva directo al editor de siempre para
// rellenarla — es una propuesta normal, solo que marcada como plantilla.
export async function createTemplate() {
  const supabase = await createClient();
  const agencyId = await getAgencyId(supabase);

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      agency_id: agencyId,
      client_name: 'Plantilla',
      title: 'Nueva plantilla',
      destination: 'Por definir',
      status: 'draft',
      public_slug: newSlug(),
      is_template: true,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/templates');
  redirect(`/dashboard/editor/${data.id}`);
}

// Copia el contenido de la plantilla (título, tema, precio, itinerario
// completo) a una propuesta real nueva, en Borrador, lista para ponerle
// nombre de cliente y enviar.
export async function duplicateTemplate(templateId: string) {
  const supabase = await createClient();
  const agencyId = await getAgencyId(supabase);

  const { data: template, error: templateError } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', templateId)
    .single();
  if (templateError || !template) throw new Error('No se encontró la plantilla');

  const { data: newProposal, error: insertError } = await supabase
    .from('proposals')
    .insert({
      agency_id: agencyId,
      client_name: '',
      title: template.title,
      destination: template.destination,
      theme_key: template.theme_key,
      cover_image_url: template.cover_image_url,
      cover_image_credit: template.cover_image_credit,
      cover_image_credit_url: template.cover_image_credit_url,
      client_message: template.client_message,
      price: template.price,
      price_includes: template.price_includes,
      price_excludes: template.price_excludes,
      price_breakdown: template.price_breakdown,
      status: 'draft',
      public_slug: newSlug(),
      is_template: false,
    })
    .select('id')
    .single();

  if (insertError) throw new Error(insertError.message);

  const { data: days } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('proposal_id', templateId)
    .order('order_index');

  if (days && days.length > 0) {
    const copies = days.map((d) => ({
      proposal_id: newProposal.id,
      day_number: d.day_number,
      title: d.title,
      description: d.description,
      accommodation: d.accommodation,
      image_url: d.image_url,
      image_credit: d.image_credit,
      image_credit_url: d.image_credit_url,
      category: d.category,
      order_index: d.order_index,
    }));
    const { error: daysError } = await supabase.from('itinerary_days').insert(copies);
    if (daysError) throw new Error(daysError.message);
  }

  revalidatePath('/dashboard');
  redirect(`/dashboard/editor/${newProposal.id}`);
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('proposals').delete().eq('id', templateId);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/templates');
}
