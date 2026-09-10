import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const UPSELL: Record<string, { title: string; desc: string }> = {
  starter: { title: 'Sube a Pro', desc: 'Marca blanca y propuestas ilimitadas' },
  pro: { title: 'Sube a Team', desc: 'Hasta 5 agentes colaboradores' },
};

export function PlanUpsellCard({ plan }: { plan?: string | null }) {
  const upsell = plan ? UPSELL[plan] : null;
  if (!upsell) return null;

  return (
    <Link
      href="/dashboard/settings#plan"
      className="mx-3 mb-2 block rounded-xl border border-primary/20 bg-secondary/50 p-3 transition-colors hover:bg-secondary"
    >
      <div className="mb-1 flex items-center gap-1.5 text-primary">
        <Sparkles size={13} />
        <span className="text-xs font-semibold">{upsell.title}</span>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{upsell.desc}</p>
    </Link>
  );
}
