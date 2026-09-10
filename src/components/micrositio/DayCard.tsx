'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Compass } from 'lucide-react';
import type { ItineraryDay, DayCategory } from '@/types/database.types';

const CATEGORY_LABEL: Record<DayCategory, string> = {
  naturaleza: 'Naturaleza',
  gastronomia: 'Gastronomía',
  cultura: 'Cultura',
  aventura: 'Aventura',
  playa: 'Playa',
  descanso: 'Descanso',
};

const CATEGORY_COLOR: Record<DayCategory, string> = {
  naturaleza: 'bg-emerald-500',
  gastronomia: 'bg-amber-500',
  cultura: 'bg-violet-500',
  aventura: 'bg-rose-500',
  playa: 'bg-sky-500',
  descanso: 'bg-indigo-400',
};

const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };

export function DayCard({ day }: { day: ItineraryDay }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Posición del ratón dentro de la tarjeta, de -0.5 a 0.5 en cada eje.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), springConfig);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), springConfig);
  const lift = useSpring(hovered ? -8 : 0, springConfig);
  const scale = useSpring(hovered ? 1.02 : 1, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, y: lift, scale, transformStyle: 'preserve-3d' }}
        className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
      >
        <div className="relative h-48 w-full" style={{ background: 'var(--color-accent)' }}>
          {day.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={day.image_url} alt={day.title ?? ''} className="photo-vivid absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Compass size={28} style={{ color: 'var(--color-primary)' }} className="opacity-50" />
            </div>
          )}

          {day.category && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm ${CATEGORY_COLOR[day.category]}`}
            >
              {CATEGORY_LABEL[day.category]}
            </span>
          )}

          {day.image_credit && (
            <a href={day.image_credit_url ?? '#'} target="_blank" className="absolute bottom-1 right-1 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white/80 backdrop-blur-sm hover:text-white">
              {day.image_credit} / Unsplash
            </a>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
            Día {day.day_number}
          </span>
          <h3 className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {day.title}
          </h3>
          {day.description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{day.description}</p>}
        </div>
      </motion.div>
    </div>
  );
}
