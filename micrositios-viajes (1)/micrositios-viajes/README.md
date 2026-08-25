# Micrositios de Viajes — MVP base

## Arranque

1. `npm install`
2. Crea `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...       # solo servidor — webhook y /admin
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_SECRET_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_PRO=price_...
   STRIPE_PRICE_TEAM=price_...
   UNSPLASH_ACCESS_KEY=...             # solo servidor — buscador de fotos en el editor
   ```
3. Ejecuta en orden en el SQL Editor de Supabase: `schema.sql` → `schema-v2-hotel-precio.sql` → `schema-v3-stripe.sql` → `schema-v4-signup-fixes.sql` → `schema-v5-trigger-crea-agencia.sql` → `schema-v6-vistas.sql` → `schema-v7-unsplash-credito.sql` → `schema-v8-personalizacion.sql` → `schema-v9-itinerary-rls.sql` → `seed-demo-data.sql`.
4. Para probar el webhook en local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
5. Para acceder a `/admin`, pon `role = 'superadmin'` manualmente en tu fila de `profiles`.
6. `npm run dev`

## Lo que ya funciona
- Registro (crea usuario; la agencia y el perfil los crea un trigger en la BD, `security definer`, funcione o no la confirmación de email) → `/auth/signup`
- Login → `/auth/login`
- Middleware protege `/dashboard` y `/admin`
- CRUD de propuestas (crear, listar, eliminar) → `/dashboard/proposals`
- Detección automática de tema por destino al crear la propuesta
- Banner de días de trial restantes en el dashboard

- Dashboard con sidebar (Propuestas / Plantillas / Ajustes / Facturación), métricas reales (total, vistas, ratio de aceptación) y grid de propuestas con miniatura y estado (`/dashboard`)
- Micrositio público en formato revista de escritorio (`max-w-5xl`, sombra, hero de impacto, grid de días, hotel con icono, precio destacado) con contador de vistas real (`increment_proposal_views`, RPC security definer)
- Fallback de portada corregido: ya no depende de `source.unsplash.com` (discontinuado) — usa directamente fotos fijas estables
- 4 propuestas de ejemplo con contenido real (`seed-demo-data.sql`): Kenia, Islandia, Alicante, Japón

- Editor completo en el dashboard (`/dashboard/editor/[id]`): portada, hotel + estrellas, precio, incluye/no incluye, y alta/edición/borrado de días con categoría e imagen — al guardar revalida al instante tanto el editor como el micrositio público (`/p/[slug]`)
- Trial automático de 15 días al registrarse (default en la tabla `agencies`, sin código adicional)
- Stripe: checkout por plan (`/dashboard/billing`), webhook que sincroniza `trialing` / `active` / `past_due` / `canceled` automáticamente según los eventos de Stripe
- Bloqueo automático de acceso al dashboard si el trial caduca o la suscripción se cancela (middleware), redirigiendo a `/dashboard/billing`
- Panel `/admin` (solo `role = 'superadmin'`): lista de agencias, estado, botón +7 días de trial, activar/bloquear acceso manual

- Landing pública en `/` (hero a pantalla completa, features, "cómo funciona", precios, CTA) — con animaciones de scroll (`Reveal`, respeta `prefers-reduced-motion`) y nav flotante en cápsula con efecto cristal. Si ya tienes sesión, `/` redirige directo al dashboard.
- Contraste de texto sobre foto garantizado en todo el proyecto (`.text-on-image`, combina overlay uniforme + text-shadow) — importante porque las agencias suben sus propias fotos, no se puede confiar en que el degradado solo baste
- Animaciones con física de resorte real (`motion`, sucesor de Framer Motion) — `Reveal` reescrito sobre `whileInView`, y feedback táctil (`whileTap`/`whileHover`) en los CTA principales de landing y login. Sustituye el enfoque anterior con `IntersectionObserver` + CSS lineal, que se sentía más mecánico.
- `Reveal` se usa también en el micrositio del cliente: mensaje personalizado, itinerario, hotel y precio aparecen con el mismo fade-in + deslizamiento que la landing

- Personalización completa por propuesta: tema visual editable a mano (no solo automático por destino), mensaje personalizado para el cliente destacado en el micrositio, foto con buscador de Unsplash y atribución en portada, hotel **y cada día del itinerario**

- Paleta de color real portada desde el proyecto de referencia Voyara (tokens `oklch` exactos): naranja vivo como primario (antes un oro apagado), acento jade secundario, texto negro-azulado en vez de negro-marrón — más enérgico, menos formal
- Técnicas de degradado de Voyara: velo diagonal (`hero-veil`) en vez de negro plano, difuminado inferior que funde la foto con el fondo de página (`hero-fade`), texto sobre imagen en 3 niveles (`text-on-image` / `-accent` / `-muted`)
- Landing: el hero ya no es un titular de marketing — es una demo real de propuesta (estilo "Japón Esencial"), con nav centrada y los 3 clics clave (demo cliente / acceso agencias / precio)

## Pendiente (siguiente iteración)
- Registrar el webhook en el Dashboard de Stripe (producción) y `stripe listen` en local
- Branding personalizado (logo/colores propios) para planes Pro/Team
- Analíticas de visualización para el plan Team
