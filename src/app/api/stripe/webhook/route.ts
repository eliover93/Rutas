import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, planFromPriceId } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

function mapStripeStatus(status: Stripe.Subscription.Status): 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired' {
  switch (status) {
    case 'trialing':
      return 'trialing';
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled';
    default:
      return 'expired';
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    // Primer pago: vincula el customer/subscription de Stripe a la agencia
    // y registra qué plan compró (venía en los metadatos que pusimos al
    // crear la sesión de checkout).
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const agencyId = session.metadata?.agency_id;
      const plan = session.metadata?.plan;

      if (agencyId && session.subscription) {
        await supabase
          .from('agencies')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
            ...(plan ? { plan } : {}),
          })
          .eq('id', agencyId);
      }
      break;
    }

    // Cualquier cambio de estado O de plan de la suscripción — incluye los
    // cambios hechos desde el Portal de Facturación de Stripe, no solo los
    // que pasan por nuestro propio checkout.
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object as Stripe.Subscription;
      const status = mapStripeStatus(sub.status);
      const agencyId = sub.metadata?.agency_id;
      const plan = planFromPriceId(sub.items.data[0]?.price?.id);

      const query = supabase
        .from('agencies')
        .update({ subscription_status: status, ...(plan ? { plan } : {}) });
      await (agencyId ? query.eq('id', agencyId) : query.eq('stripe_subscription_id', sub.id));
      break;
    }

    // Cancelación definitiva (fin de periodo o inmediata)
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from('agencies')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
