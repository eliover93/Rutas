import { createAdminClient } from '@/lib/supabase/admin';
import { extendTrial, setSubscriptionStatus } from './actions';

const STATUS_COLOR: Record<string, string> = {
  trialing: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  past_due: 'bg-orange-100 text-orange-700',
  expired: 'bg-slate-200 text-slate-600',
  canceled: 'bg-red-100 text-red-700',
};

export default async function AdminPage() {
  const supabase = createAdminClient();
  const { data: agencies } = await supabase.from('agencies').select('*').order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Agencias registradas</h1>

      <div className="space-y-3">
        {agencies?.map((a) => {
          const daysLeft = Math.ceil((new Date(a.trial_ends_at).getTime() - Date.now()) / 86_400_000);
          return (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-medium text-slate-900">{a.name}</p>
                <p className="text-xs text-slate-400">
                  Plan {a.plan}
                  {a.subscription_status === 'trialing' && ` · ${daysLeft > 0 ? `${daysLeft} días de trial restantes` : 'trial caducado'}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[a.subscription_status]}`}>
                  {a.subscription_status}
                </span>

                <form action={extendTrial.bind(null, a.id, 7)}>
                  <button type="submit" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">
                    +7 días trial
                  </button>
                </form>

                {a.subscription_status === 'active' ? (
                  <form action={setSubscriptionStatus.bind(null, a.id, 'canceled')}>
                    <button type="submit" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                      Bloquear
                    </button>
                  </form>
                ) : (
                  <form action={setSubscriptionStatus.bind(null, a.id, 'active')}>
                    <button type="submit" className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50">
                      Activar
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
