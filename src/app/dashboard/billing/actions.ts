'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe, PRICE_IDS, type PlanKey } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function getAgencyForBilling() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single();
  if (!profile?.agency_id) throw new Error('Usuario sin agencia asociada');

  const { data: agency } = await supabase
    .from('agencies')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('id', profile.agency_id)
    .single();

  return { supabase, agency, agencyId: profile.agency_id, userEmail: user.email };
}

// Primera suscripción: todavía no hay tarjeta guardada, así que esta sí
// tiene que pasar por el Checkout alojado de Stripe (es el único momento
// en que de verdad hace falta salir de Rutas).
export async function createCheckoutSession(formData: FormData) {
  const plan = formData.get('plan') as PlanKey;
  const { agency, agencyId, userEmail } = await getAgencyForBilling();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: agency?.stripe_customer_id ?? undefined,
    customer_email: agency?.stripe_customer_id ? undefined : userEmail ?? undefined,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
    metadata: { agency_id: agencyId, plan },
    subscription_data: { metadata: { agency_id: agencyId, plan } },
  });

  redirect(session.url!);
}

// Cambiar de plan con tarjeta YA guardada: se hace directo por API, sin
// salir de Rutas — Stripe cobra o abona la diferencia prorrateada sobre el
// mismo método de pago que ya tiene en el fichero.
export async function changePlan(newPlan: PlanKey) {
  const { agency } = await getAgencyForBilling();
  if (!agency?.stripe_subscription_id) throw new Error('No hay una suscripción activa que cambiar');

  const subscription = await stripe.subscriptions.retrieve(agency.stripe_subscription_id);
  const itemId = subscription.items.data[0]?.id;
  if (!itemId) throw new Error('No se encontró el ítem de la suscripción');

  await stripe.subscriptions.update(agency.stripe_subscription_id, {
    items: [{ id: itemId, price: PRICE_IDS[newPlan] }],
    proration_behavior: 'create_prorations',
    // Si venía marcada para cancelarse a fin de periodo, cambiar de plan
    // cancela esa cancelación — sigue siendo cliente.
    cancel_at_period_end: false,
  });

  revalidatePath('/dashboard/billing');
}

// Cancela al final del periodo ya pagado — el cliente conserva el acceso
// hasta esa fecha, no se le corta de golpe.
export async function cancelSubscription() {
  const { agency } = await getAgencyForBilling();
  if (!agency?.stripe_subscription_id) throw new Error('No hay una suscripción activa que cancelar');

  await stripe.subscriptions.update(agency.stripe_subscription_id, { cancel_at_period_end: true });
  revalidatePath('/dashboard/billing');
}

// Por si cambia de opinión antes de que termine el periodo.
export async function resumeSubscription() {
  const { agency } = await getAgencyForBilling();
  if (!agency?.stripe_subscription_id) throw new Error('No hay una suscripción que reactivar');

  await stripe.subscriptions.update(agency.stripe_subscription_id, { cancel_at_period_end: false });
  revalidatePath('/dashboard/billing');
}

// Para lo que sí conviene dejar en manos de Stripe: descargar facturas y
// cambiar el número de tarjeta. No tiene sentido reconstruir eso nosotros.
export async function createPortalSession() {
  const { agency } = await getAgencyForBilling();
  if (!agency?.stripe_customer_id) throw new Error('Esta agencia todavía no tiene suscripción');

  const session = await stripe.billingPortal.sessions.create({
    customer: agency.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  redirect(session.url);
}
