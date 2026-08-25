import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isBilling = request.nextUrl.pathname.startsWith('/dashboard/billing');
  const isAdmin = request.nextUrl.pathname.startsWith('/admin');

  if ((isDashboard || isAdmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Bloqueo automático por trial caducado o suscripción cancelada.
  // past_due se permite pasar (periodo de gracia habitual de Stripe).
  if (isDashboard && !isBilling && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('agency_id')
      .eq('id', user.id)
      .single();

    if (profile?.agency_id) {
      const { data: agency } = await supabase
        .from('agencies')
        .select('subscription_status, trial_ends_at')
        .eq('id', profile.agency_id)
        .single();

      const trialExpired =
        agency?.subscription_status === 'trialing' && new Date(agency.trial_ends_at) < new Date();
      const blocked = agency && (['expired', 'canceled'].includes(agency.subscription_status) || trialExpired);

      if (blocked) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/billing';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
