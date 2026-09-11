import { Lock, CheckCircle2, AlertCircle, Check, Sparkles, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateBranding, connectDomain, checkDomainStatus, disconnectDomain } from './actions';
import { LogoUploadField } from '@/components/dashboard/LogoUploadField';
import { stripe, planFromPriceId, type PlanKey } from '@/lib/stripe';
import {
  createCheckoutSession,
  changePlan,
  cancelSubscription,
  resumeSubscription,
  createPortalSession,
} from '../billing/actions';
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

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user?.id).single();
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile?.agency_id)
    .single();

  const hasBrandingAccess = agency?.plan === 'pro' || agency?.plan === 'team';
  const hasActiveSubscription = agency?.subscription_status === 'active' && agency?.stripe_customer_id;

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
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
      <h1 className="mb-2 font-display text-2xl text-foreground">Ajustes</h1>
      <p className="mb-8 text-sm text-muted-foreground">Tu marca y tu plan, todo en un solo sitio.</p>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Cambios guardados correctamente.
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} /> {decodeURIComponent(error)}
        </div>
      )}

      {/* Marca */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-foreground">Marca</h2>

        {hasBrandingAccess ? (
          <form action={updateBranding} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
            <LogoUploadField currentLogoUrl={agency?.logo_url} />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Color de marca</label>
              <div className="flex items-center gap-3">
                <input
                  name="brand_color"
                  type="color"
                  defaultValue={agency?.brand_color ?? '#0ea5e9'}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-background"
                />
                <input
                  type="text"
                  value={agency?.brand_color ?? '#0ea5e9'}
                  disabled
                  className="w-32 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-muted-foreground"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Reemplaza el color principal del tema visual en todos tus micrositios (el mismo tono, sea cual sea el
                destino).
              </p>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Guardar cambios
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Lock size={28} className="mx-auto mb-3 text-muted-foreground" />
            <p className="mb-1 font-medium text-foreground">Disponible en los planes Pro y Team</p>
            <p className="mb-5 text-sm text-muted-foreground">
              Tu logo, tu color de marca y un dominio propio en cada micrositio que compartas con tus clientes.
            </p>
            <a
              href="#plan"
              className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Ver planes
            </a>
          </div>
        )}
      </section>

      {/* Dominio personalizado */}
      {hasBrandingAccess && (
        <section id="dominio" className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-foreground">
            <Globe size={18} className="text-primary" /> Dominio personalizado
          </h2>

          <div className="rounded-2xl border border-border bg-surface p-6">
            {!agency?.custom_domain ? (
              <form action={connectDomain} className="space-y-3">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Tu dominio (ej. viajes.tuagencia.com)
                </label>
                <div className="flex gap-2">
                  <input
                    name="domain"
                    type="text"
                    placeholder="viajes.tuagencia.com"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    Conectar
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Después de conectarlo te diremos exactamente qué registro DNS añadir en tu proveedor de dominios.
                </p>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Dominio conectado</p>
                    <p className="font-display text-lg text-foreground">{agency.custom_domain}</p>
                  </div>
                  {agency.custom_domain_verified ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={13} /> Verificado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      Pendiente de DNS
                    </span>
                  )}
                </div>

                {!agency.custom_domain_verified && (
                  <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm text-foreground">
                    <p className="mb-2 font-medium">Añade uno de estos registros en tu proveedor de dominio:</p>
                    <p className="mb-1">
                      Si es un subdominio (ej. <code>viajes.tuagencia.com</code>): registro <strong>CNAME</strong> →{' '}
                      <code>cname.vercel-dns.com</code>
                    </p>
                    <p>
                      Si es tu dominio raíz (ej. <code>tuagencia.com</code>): registro <strong>A</strong> →{' '}
                      <code>76.76.21.21</code>
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      El cambio puede tardar desde minutos hasta varias horas en propagarse, según tu proveedor.
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <form action={checkDomainStatus}>
                    <button
                      type="submit"
                      className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50"
                    >
                      Verificar ahora
                    </button>
                  </form>
                  <form action={disconnectDomain}>
                    <ConfirmButton
                      confirmText="¿Seguro que quieres desconectar este dominio? Tus micrositios seguirán funcionando en el enlace de rutas-opal.vercel.app."
                      className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-red-600 hover:underline"
                    >
                      Desconectar
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Plan */}
      <section id="plan">
        <h2 className="mb-4 font-display text-xl text-foreground">Plan</h2>

        {hasActiveSubscription ? (
          <div className="space-y-8">
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
                    Tu suscripción termina el <strong>{periodEndLabel}</strong> — hasta entonces sigues teniendo
                    acceso completo.
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

            <div>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-display text-xl text-foreground">Cambiar de plan</h3>
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
      </section>
    </div>
  );
}
