import { Check, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { stripe, planFromPriceId, type PlanKey } from '@/lib/stripe';
import { createCheckoutSession, changePlan, cancelSubscription, resumeSubscription, createPortalSession } from './actions';
import { ConfirmButton } from '@/components/dashboard/ConfirmButton';

const PLANS = [
  {
    key: 'starter' as const,
    name: 'Starter',
    price: '29€/mes',
    desc: 'Para empezar a mandar propuestas con efecto wow',
    features: ['Hasta 10 propuestas activas/mes', 'Temas visuales automáticos por destino', 'Soporte por email'],
    popular: false,
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '59€/mes',
    desc: 'Para agencias que quieren su marca en cada propuesta',
    features: ['Propuestas ilimitadas', 'Marca blanca — tu logo y colores', 'Dominio personalizado'],
    popular: true,
  },
  {
    key: 'team' as const,
    name: 'Team',
    price: '99€/mes',
    desc: 'Para equipos que trabajan juntos sobre las mismas propuestas',
    features: ['Todo lo de Pro', 'Hasta 5 agentes colaboradores', 'Analíticas de visualización'],
    popular: false,
  },
];

const PLAN_ORDER: PlanKey[] = ['starter', 'pro', 'team'];

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

  // Estado en vivo directo de Stripe — nunca desincronizado, ni tenemos que
  // esperar a que llegue un webhook para reflejar un cambio reciente.
  let currentPlan: PlanKey | null = null;
  let cancelAtPeriodEnd = false;
  let periodEndLabel: string | null = null;

  if (hasActiveSubscription && agency.stripe_subscription_id) {
    const subscription = await stripe.subscriptions.retrieve(agency.stripe_subscription_id);
    currentPlan = planFromPriceId(subscription.items.data[0]?.price?.id);
    cancelAtPeriodEnd = subscription.cancel_at_period_end;
    periodEndLabel = new Date(subscription.current_period_end * 1000).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const currentInfo = PLANS.find((p) => p.key === currentPlan);
  const otherPlans = PLANS.filter((p) => p.key !== currentPlan);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 font-display text-2xl text-foreground">Facturación</h1>

      {hasActiveSubscription ? (
        <div className="space-y-8">
          {/* Estado actual — compacto */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tu plan actual</p>
                <p className="font-display text-xl text-foreground">
                  {currentInfo?.name ?? currentPlan} · {currentInfo?.price}
                </p>
              </div>
              <form action={createPortalSession}>
                <button
                  type="submit"
                  className="text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
                >
                  Ver facturas y método de pago
                </button>
              </form>
            </div>

            {cancelAtPeriodEnd ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                <p className="text-sm text-foreground">
                  Tu suscripción termina el <strong>{periodEndLabel}</strong> — hasta entonces sigues teniendo acceso
                  completo.
                </p>
                <form action={resumeSubscription}>
                  <button type="submit" className="whitespace-nowrap text-sm font-medium text-primary hover:underline">
                    Reactivar
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-4 flex justify-end">
                <form action={cancelSubscription}>
                  <ConfirmButton
                    confirmText={`¿Seguro que quieres cancelar tu suscripción? Conservarás el acceso hasta el ${periodEndLabel}, luego no se te volverá a cobrar.`}
                    className="text-sm text-muted-foreground underline-offset-2 hover:text-red-600 hover:underline"
                  >
                    Cancelar suscripción
                  </ConfirmButton>
                </form>
              </div>
            )}
          </div>

          {/* Cambiar de plan — directo por API, sin salir de Rutas */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="font-display text-xl text-foreground">Cambiar de plan</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {otherPlans.map((plan) => {
                const isUpgrade = PLAN_ORDER.indexOf(plan.key) > PLAN_ORDER.indexOf(currentPlan!);
                return (
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
                    <form action={changePlan.bind(null, plan.key)}>
                      <ConfirmButton
                        confirmText={
                          isUpgrade
                            ? `Vas a subir a ${plan.name}. Se te cobrará la diferencia prorrateada ahora mismo con tu método de pago guardado. ¿Confirmas?`
                            : `Vas a bajar a ${plan.name}. El cambio se aplica ahora, con el ajuste prorrateado correspondiente. ¿Confirmas?`
                        }
                        className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        {isUpgrade ? `Subir a ${plan.name}` : `Bajar a ${plan.name}`}
                      </ConfirmButton>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
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
