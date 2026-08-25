'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const MotionLink = motion.create(Link);
const tap = { scale: 0.96 };
const hover = { scale: 1.04 };
const spring = { type: 'spring' as const, stiffness: 400, damping: 20 };

export function HeroCtas() {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <MotionLink
        href="/p/demo-kenia"
        target="_blank"
        whileHover={hover}
        whileTap={tap}
        transition={spring}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground"
      >
        Ver demo de cliente <ArrowRight size={16} />
      </MotionLink>
      <MotionLink
        href="/auth/signup"
        whileHover={hover}
        whileTap={tap}
        transition={spring}
        className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-medium text-white backdrop-blur"
      >
        Empezar prueba gratis
      </MotionLink>
    </div>
  );
}
