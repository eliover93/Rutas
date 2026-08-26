import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, createPortalSession } from './actions';

const PLANS = [
  { key: 'starter', name: 'Starter', price: '29€/mes', desc: 'Hasta 10 itinerarios activos/mes' },
  { key: 'pro', name: 'Pro', price: '59€/mes', desc: 'Itinerarios ilimitados + marca blanca' },
  { key: 'team', name: 'Team', price: '99€/mes', desc: 'Todo Pro + 5 agentes colaboradores' },
] as const;

const STATUS_LABEL: Record<string, string> = {
  trialing: 'En prueba gratuita',
  active: 'Activa',
  past_due: 'Pago pendiente',
  expired: 'Prueba caducada',
  canceled: 'Cancelada',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user?.id).single();
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile?.agency_id)
    .single();

  const hasActiveSubscription = agency?.subscription_status === 'active' && agency?.stripe_customer_id;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl text-foreground">Facturación</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Estado actual:{' '}
        <span className="font-medium text-foreground">
          {agency ? STATUS_LABEL[agency.subscription_status] : '—'}
        </span>
        {agency?.plan && ` · Plan ${agency.plan}`}
      </p>

      {hasActiveSubscription ? (
        // Ya tiene suscripción activa: cambiar de plan o cancelar pasa por
        // el Portal de Stripe — nunca por otro checkout, evita duplicados.
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Para cambiar de plan, actualizar tu método de pago o cancelar, usa el portal seguro de Stripe.
          </p>
          <form action={createPortalSession}>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Gestionar suscripción
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <form key={plan.key} action={createCheckoutSession} className="flex flex-col rounded-2xl border border-border bg-surface p-5">
              <input type="hidden" name="plan" value={plan.key} />
              <h2 className="font-medium text-foreground">{plan.name}</h2>
              <p className="mb-1 font-display text-xl text-foreground">{plan.price}</p>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{plan.desc}</p>
              <button
                type="submit"
                className="rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Suscribirse
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
