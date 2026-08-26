import { Check, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, createPortalSession } from './actions';

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    price: '29€/mes',
    desc: 'Para empezar a mandar propuestas con efecto wow',
    features: ['Hasta 10 propuestas activas/mes', 'Temas visuales automáticos por destino', 'Soporte por email'],
    popular: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '59€/mes',
    desc: 'Para agencias que quieren su marca en cada propuesta',
    features: ['Propuestas ilimitadas', 'Marca blanca — tu logo y colores', 'Dominio personalizado'],
    popular: true,
  },
  {
    key: 'team',
    name: 'Team',
    price: '99€/mes',
    desc: 'Para equipos que trabajan juntos sobre las mismas propuestas',
    features: ['Todo lo de Pro', 'Hasta 5 agentes colaboradores', 'Analíticas de visualización'],
    popular: false,
  },
] as const;

const PLAN_ORDER = ['starter', 'pro', 'team'] as const;

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
  const currentIndex = PLAN_ORDER.indexOf((agency?.plan ?? 'starter') as (typeof PLAN_ORDER)[number]);
  const upgradePlans = PLANS.filter((_, i) => i > currentIndex);
  const currentPlan = PLANS.find((p) => p.key === agency?.plan);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 font-display text-2xl text-foreground">Facturación</h1>

      {hasActiveSubscription ? (
        <div className="space-y-8">
          {/* Estado actual — compacto, no es la estrella de la pantalla */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tu plan actual</p>
              <p className="font-display text-xl text-foreground">
                {currentPlan?.name ?? agency?.plan} · {currentPlan?.price}
              </p>
              <p className="text-xs text-muted-foreground">{STATUS_LABEL[agency!.subscription_status]}</p>
            </div>
            <form action={createPortalSession.bind(null, false)}>
              <button type="submit" className="text-sm font-medium text-muted-foreground underline-offset-2 hover:underline">
                Facturas, pago y cancelación
              </button>
            </form>
          </div>

          {/* Upsell — solo si hay algo por encima del plan actual */}
          {upgradePlans.length > 0 && (
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h2 className="font-display text-xl text-foreground">Saca más partido a Rutas</h2>
              </div>
              <div className={`grid grid-cols-1 gap-5 ${upgradePlans.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {upgradePlans.map((plan) => (
                  <div
                    key={plan.key}
                    className={`flex flex-col rounded-2xl border p-6 ${
                      plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
                    }`}
                  >
                    {plan.popular && (
                      <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Más popular
                      </span>
                    )}
                    <h3 className="text-lg text-foreground">{plan.name}</h3>
                    <p className="mb-1 font-display text-3xl text-foreground">{plan.price}</p>
                    <p className="mb-4 text-sm text-muted-foreground">{plan.desc}</p>
                    <ul className="mb-6 flex-1 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                          <Check size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <form action={createPortalSession.bind(null, true)}>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        Subir a {plan.name}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upgradePlans.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ya tienes nuestro plan más completo — gracias por confiar en Rutas.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <form
              key={plan.key}
              action={createCheckoutSession}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border bg-surface'
              }`}
            >
              <input type="hidden" name="plan" value={plan.key} />
              {plan.popular && (
                <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Más popular
                </span>
              )}
              <h2 className="text-lg text-foreground">{plan.name}</h2>
              <p className="mb-1 font-display text-3xl text-foreground">{plan.price}</p>
              <p className="mb-4 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
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
