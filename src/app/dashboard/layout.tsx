import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user?.id)
    .single();

  const { data: agency } = await supabase
    .from('agencies')
    .select('trial_ends_at, subscription_status')
    .eq('id', profile?.agency_id)
    .single();

  const daysLeft = agency
    ? Math.ceil((new Date(agency.trial_ends_at).getTime() - Date.now()) / 86_400_000)
    : null;

  return (
    <div className="flex bg-background">
      <Sidebar />
      <div className="flex-1">
        {agency?.subscription_status === 'trialing' && daysLeft !== null && (
          <div className="bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
            {daysLeft > 0
              ? `Te quedan ${daysLeft} días de prueba gratuita`
              : 'Tu prueba ha terminado — activa un plan para seguir editando'}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
