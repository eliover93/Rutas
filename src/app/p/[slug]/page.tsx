import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { detectTheme } from '@/lib/themes';
import { themeVars } from '@/lib/themeStyles';
import { Hero } from '@/components/micrositio/Hero';
import { ClientMessage } from '@/components/micrositio/ClientMessage';
import { QuickFacts } from '@/components/micrositio/QuickFacts';
import { DayCard } from '@/components/micrositio/DayCard';
import { HotelBlock } from '@/components/micrositio/HotelBlock';
import { PriceBreakdown } from '@/components/micrositio/PriceBreakdown';
import { CtaBar } from '@/components/micrositio/CtaBar';
import { Reveal } from '@/components/shared/Reveal';
import type { ThemeKey } from '@/types/database.types';

export default async function MicrositioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('public_slug', slug)
    .single();

  if (!proposal) notFound();

  const { data: days } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('proposal_id', proposal.id)
    .order('order_index');

  // Fire-and-forget: no bloquea el render por una métrica.
  supabase.rpc('increment_proposal_views', { p_slug: slug });

  const theme: ThemeKey = (proposal.theme_key as ThemeKey) ?? detectTheme(proposal.destination);

  const { data: agency } = await supabase
    .from('agencies')
    .select('plan, brand_color, logo_url')
    .eq('id', proposal.agency_id)
    .single();

  const hasBranding = agency?.plan === 'pro' || agency?.plan === 'team';
  const themeStyle = {
    ...themeVars(theme),
    ...(hasBranding && agency?.brand_color ? { '--color-primary': agency.brand_color } : {}),
  };

  return (
    <div className="min-h-screen bg-background py-0 sm:py-10">
      <div
        className="mx-auto max-w-5xl overflow-hidden bg-white pb-24 shadow-none sm:rounded-3xl sm:shadow-2xl sm:pb-8 font-[var(--font-theme)]"
        style={{ ...themeStyle, color: 'var(--color-text)' }}
      >
        <Hero proposal={proposal} theme={theme} agencyLogoUrl={hasBranding ? agency?.logo_url : null} />
        {proposal.client_message && (
          <Reveal>
            <ClientMessage message={proposal.client_message} />
          </Reveal>
        )}
        <QuickFacts proposal={proposal} days={days ?? []} />

        <div className="space-y-10 p-8">
          {(days ?? []).length > 0 && (
            <section>
              <h2 className="mb-4 font-[var(--font-theme)] text-lg font-semibold">Itinerario día a día</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(days ?? []).map((day, i) => (
                  <Reveal key={day.id} delay={(i % 3) * 100}>
                    <DayCard day={day} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <Reveal>
            <HotelBlock days={days ?? []} destination={proposal.destination} />
          </Reveal>
        </div>

        <Reveal>
          <PriceBreakdown proposal={proposal} />
        </Reveal>
      </div>

      <CtaBar proposal={proposal} />
    </div>
  );
}
