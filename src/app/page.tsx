import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, LayoutDashboard, Sparkles, Wallet, Palette, Share2, Earth } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { DemoHeroPreview } from '@/components/marketing/DemoHeroPreview';
import { Reveal } from '@/components/shared/Reveal';

const STATS = [
  { value: 'Minutos', label: 'para montar una propuesta completa (no horas de PDF)' },
  { value: 'Un enlace', label: 'el cliente la abre en el móvil, sin instalar nada' },
  { value: '100%', label: 'adaptable a la marca de cada agencia' },
];

const FEATURES = [
  { icon: LayoutDashboard, title: 'Backoffice sin curva de aprendizaje', desc: 'Formularios claros: datos del viaje, itinerario día a día, hotel y presupuesto. Sin manuales.' },
  { icon: Sparkles, title: 'Presentación con efecto wow', desc: 'Tema visual y fotografía que cambian solos según el destino. El cliente se enamora antes de leer el precio.' },
  { icon: Wallet, title: 'Presupuestos transparentes', desc: 'Desglose por conceptos, incluido / no incluido, total y precio por persona automático.' },
  { icon: Palette, title: 'Marca blanca por agencia', desc: 'Logo y colores propios en el plan Pro. El mismo motor, cada agencia con su identidad.' },
  { icon: Share2, title: 'Comparte con un enlace', desc: 'Cada propuesta vive en su propia URL: se abre en el móvil del cliente sin fricción.' },
  { icon: Earth, title: 'Reutilizable y escalable', desc: 'Duplica un viaje, cambia cuatro campos y tienes una propuesta nueva en minutos.' },
];

const STEPS = [
  { n: '01', title: 'Rellena el viaje', desc: 'Tu equipo carga destino, días, actividades y precios.' },
  { n: '02', title: 'Rutas lo monta', desc: 'Se genera la propuesta con tema visual, itinerario y mapa.' },
  { n: '03', title: 'El cliente dice sí', desc: 'Comparte el enlace y recibe la confirmación desde el móvil.' },
];

const PLANS = [
  { name: 'Starter', price: '29€/mes', desc: 'Hasta 10 itinerarios activos/mes' },
  { name: 'Pro', price: '59€/mes', desc: 'Itinerarios ilimitados + marca blanca', popular: true },
  { name: 'Team', price: '99€/mes', desc: 'Todo Pro + 5 agentes colaboradores' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="bg-background" suppressHydrationWarning>
      <SiteHeader />

      <main>
        {/* HERO — demo real, no un titular de marketing */}
        <section className="relative min-h-dvh overflow-hidden">
          <DemoHeroPreview />
        </section>

        {/* STATS */}
        <section className="mx-auto w-[min(1120px,92vw)] py-24">
          <div className="grid gap-4 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.value} delay={i * 100}>
                <div className="rounded-2xl border border-border bg-surface p-7">
                  <p className="text-gradient-gold font-display text-4xl">{s.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="producto" className="border-y border-border bg-secondary/40 py-24">
          <div className="mx-auto w-[min(1120px,92vw)]">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl text-foreground md:text-5xl">
                Un producto, dos caras: la agencia trabaja rápido y el cliente se emociona
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 100}>
                  <article className="group h-full rounded-2xl border border-border bg-background p-7 transition-colors hover:border-primary/50">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-110">
                      <f.icon size={20} />
                    </span>
                    <h3 className="mt-5 text-xl text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="mx-auto w-[min(1120px,92vw)] py-24">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Cómo funciona</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="rounded-2xl border border-border p-7">
                  <span className="font-display text-5xl text-muted-foreground/50">{s.n}</span>
                  <h3 className="mt-4 text-2xl text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="border-y border-border bg-secondary/40 py-24">
          <div className="mx-auto w-[min(1120px,92vw)]">
            <Reveal>
              <h2 className="font-display text-4xl text-foreground md:text-5xl">Un plan para cada tamaño de agencia</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 100}>
                  <div
                    className={`flex h-full flex-col rounded-2xl border bg-background p-7 ${
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
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">{plan.desc}</p>
                    <Link
                      href="/auth/signup"
                      className="rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                      Empezar prueba gratis
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto w-[min(1120px,92vw)] pb-28 pt-24">
          <Reveal>
            <div className="rounded-3xl border border-primary/30 bg-surface p-10 text-center shadow-xl shadow-primary/5 md:p-16">
              <h2 className="mx-auto max-w-2xl font-display text-4xl text-foreground md:text-5xl">
                Enseña la demo a tu próximo cliente esta misma semana
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                15 días de prueba gratis, marca blanca incluida en Pro, propuestas ilimitadas.
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Empezar prueba gratis <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Reveal>
        <footer className="border-t border-border py-10">
          <div className="mx-auto flex w-[min(1120px,92vw)] flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>© 2026 Rutas · Propuestas de viaje para agencias</span>
            <span>Software para agencias de viaje</span>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}
