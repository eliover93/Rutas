import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from './actions';

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Facturación</h1>
      <p className="mb-8 text-sm text-slate-500">
        Estado actual:{' '}
        <span className="font-medium text-slate-900">
          {agency ? STATUS_LABEL[agency.subscription_status] : '—'}
        </span>
        {agency?.plan && ` · Plan ${agency.plan}`}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <form key={plan.key} action={createCheckoutSession} className="flex flex-col rounded-2xl border border-slate-200 p-5">
            <input type="hidden" name="plan" value={plan.key} />
            <h2 className="font-semibold text-slate-900">{plan.name}</h2>
            <p className="mb-1 text-xl font-bold text-slate-900">{plan.price}</p>
            <p className="mb-4 flex-1 text-sm text-slate-500">{plan.desc}</p>
            <button
              type="submit"
              disabled={agency?.plan === plan.key && agency?.subscription_status === 'active'}
              className="rounded-lg bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              {agency?.plan === plan.key && agency?.subscription_status === 'active' ? 'Plan actual' : 'Suscribirse'}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
