import { Calendar, Clock, Users, MapPin } from 'lucide-react';

export function DemoHeroPreview() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://picsum.photos/seed/rutas-asiatico/1920/1080"
        alt="Japón Esencial — ejemplo de propuesta generada con Rutas"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 hero-veil" />
      <div className="absolute inset-x-0 bottom-0 h-40 hero-fade" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-[min(1120px,92vw)] flex-col justify-center pt-24">
        <p className="text-on-image text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
          Atlas Viajes · para Familia Serrano
        </p>
        <h1 className="text-on-image mt-4 max-w-3xl font-display text-6xl leading-[1.02] text-white md:text-7xl">
          Japón Esencial
        </h1>
        <p className="text-on-image mt-4 max-w-xl text-lg text-white/90">
          Doce días entre templos, neones y montañas sagradas
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { icon: Calendar, label: '12 – 23 de octubre de 2026' },
            { icon: Clock, label: '11 noches' },
            { icon: Users, label: '4 viajeros' },
            { icon: MapPin, label: 'Tokio · Hakone · Kioto · Osaka' },
          ].map((chip) => (
            <span
              key={chip.label}
              className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-foreground"
            >
              <chip.icon size={15} className="text-primary" />
              {chip.label}
            </span>
          ))}
        </div>

        <p className="text-on-image mt-8 max-w-lg text-sm text-white/70">
          Esto es exactamente lo que ve tu cliente — generado a partir de un formulario de 2 minutos.
        </p>
      </div>
    </>
  );
}
