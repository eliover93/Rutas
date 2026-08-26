'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe, PRICE_IDS, type PlanKey } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(formData: FormData) {
  const plan = formData.get('plan') as PlanKey;
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
    .select('stripe_customer_id')
    .eq('id', profile.agency_id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: agency?.stripe_customer_id ?? undefined,
    customer_email: agency?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
    // metadata en la sesión Y en la suscripción — el webhook puede necesitar
    // cualquiera de las dos según el evento que llegue primero.
    metadata: { agency_id: profile.agency_id, plan },
    subscription_data: { metadata: { agency_id: profile.agency_id, plan } },
  });

  redirect(session.url!);
}

// Para quien YA tiene una suscripción activa: cambiar/cancelar el plan pasa
// por el propio Portal de Stripe, nunca creando otro checkout — evitar así
// dos suscripciones activas en paralelo (y un doble cobro real).
// targetUpgrade=true lleva directo a la pantalla de cambio de plan dentro
// del portal (mejor conversión que el menú genérico del portal).
export async function createPortalSession(targetUpgrade: boolean) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single();

  const { data: agency } = await supabase
    .from('agencies')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('id', profile?.agency_id)
    .single();

  if (!agency?.stripe_customer_id) throw new Error('Esta agencia todavía no tiene suscripción');

  const session = await stripe.billingPortal.sessions.create({
    customer: agency.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    ...(targetUpgrade && agency.stripe_subscription_id
      ? {
          flow_data: {
            type: 'subscription_update' as const,
            subscription_update: { subscription: agency.stripe_subscription_id },
          },
        }
      : {}),
  });

  redirect(session.url);
}
