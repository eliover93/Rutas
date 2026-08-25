-- Datos de prueba coherentes por destino.
-- Sustituye <AGENCY_ID> por el id real de tu agencia antes de ejecutar.
-- Fotos vía picsum.photos con seed fija: a diferencia de URLs concretas de
-- Unsplash, este servicio garantiza que la imagen siempre carga (nunca 404).

-- KENIA — Safari
with p as (
  insert into proposals (agency_id, client_name, title, destination, theme_key, price, status, public_slug,
    hotel_name, hotel_stars, hotel_image_url, price_includes, price_excludes)
  values ('<AGENCY_ID>', 'Familia Torres', 'Safari fotográfico por la sabana keniata',
    'Kenia', 'safari', 2450, 'sent', 'demo-kenia',
    'Angama Mara', 5, 'https://picsum.photos/seed/rutas-kenia-hotel/1200/800',
    array['Vuelos internacionales', 'Pensión completa en el safari', 'Guía y vehículo 4x4 privado', 'Seguro de viaje'],
    array['Visado de entrada a Kenia', 'Propinas', 'Excursiones opcionales'])
  returning id
)
insert into itinerary_days (proposal_id, day_number, title, description, category, image_url, order_index)
select id, day_number, title, description, category, image_url, order_index from p, (values
  (1, 'Llegada y Parque Nacional de Nairobi', 'Recepción en el aeropuerto y primer contacto con la fauna a las puertas de la capital.', 'naturaleza', 'https://picsum.photos/seed/rutas-kenia-d1/800/600', 0),
  (2, 'Avistamiento en Masái Mara', 'Salida al amanecer en 4x4 para ver la Gran Migración: leones, elefantes y jirafas.', 'aventura', 'https://picsum.photos/seed/rutas-kenia-d2/800/600', 1),
  (3, 'Visita a un poblado masái', 'Inmersión cultural con la comunidad local: danzas tradicionales y artesanía.', 'cultura', 'https://picsum.photos/seed/rutas-kenia-d3/800/600', 2),
  (4, 'Globo aerostático al amanecer', 'Vuelo sobre la sabana seguido de desayuno champán en plena reserva.', 'aventura', 'https://picsum.photos/seed/rutas-kenia-d4/800/600', 3),
  (5, 'Regreso y despedida', 'Última mañana de safari y traslado al aeropuerto de Nairobi.', 'descanso', null, 4)
) as t(day_number, title, description, category, image_url, order_index);

-- ISLANDIA — Auroras y glaciares
with p as (
  insert into proposals (agency_id, client_name, title, destination, theme_key, price, status,
    hotel_name, hotel_stars, hotel_image_url, price_includes, price_excludes)
  values ('<AGENCY_ID>', 'Marta y Pau', 'Auroras boreales y glaciares del sur de Islandia',
    'Islandia', 'nordico', 1980, 'sent',
    'Hotel Rangá', 4, 'https://picsum.photos/seed/rutas-islandia-hotel/1200/800',
    array['Coche de alquiler 4x4', 'Alojamiento con desayuno', 'Entrada a la Laguna Azul', 'Excursión guiada al glaciar'],
    array['Vuelos internacionales', 'Comidas y cenas', 'Actividades no listadas'])
  returning id
)
insert into itinerary_days (proposal_id, day_number, title, description, category, image_url, order_index)
select id, day_number, title, description, category, image_url, order_index from p, (values
  (1, 'Reikiavik y Círculo Dorado', 'Cascada de Gullfoss, géiser de Strokkur y el parque nacional de Þingvellir.', 'naturaleza', 'https://picsum.photos/seed/rutas-islandia-d1/800/600', 0),
  (2, 'Playa negra de Reynisfjara', 'Costa sur volcánica, columnas de basalto y acantilados de aves marinas.', 'naturaleza', 'https://picsum.photos/seed/rutas-islandia-d2/800/600', 1),
  (3, 'Glaciar Vatnajökull y laguna Jökulsárlón', 'Excursión sobre hielo milenario y paseo entre icebergs flotantes.', 'aventura', 'https://picsum.photos/seed/rutas-islandia-d3/800/600', 2),
  (4, 'Caza de auroras boreales', 'Noche guiada lejos de la contaminación lumínica para ver el cielo verde en movimiento.', 'naturaleza', 'https://picsum.photos/seed/rutas-islandia-d4/800/600', 3)
) as t(day_number, title, description, category, image_url, order_index);

-- ALICANTE — Mediterráneo
with p as (
  insert into proposals (agency_id, client_name, title, destination, theme_key, price, status,
    hotel_name, hotel_stars, hotel_image_url, price_includes, price_excludes)
  values ('<AGENCY_ID>', 'Grupo Oficina Norte', 'Escapada mediterránea en Alicante',
    'Alicante', 'mediterraneo', 690, 'draft',
    'Hospes Amérigo', 5, 'https://picsum.photos/seed/rutas-alicante-hotel/1200/800',
    array['Alojamiento 4 noches', 'Desayuno buffet', 'Ruta guiada por el casco antiguo'],
    array['Vuelos', 'Comidas', 'Entradas a museos'])
  returning id
)
insert into itinerary_days (proposal_id, day_number, title, description, category, image_url, order_index)
select id, day_number, title, description, category, image_url, order_index from p, (values
  (1, 'Castillo de Santa Bárbara', 'Subida al castillo con vistas panorámicas de la bahía y el casco antiguo.', 'cultura', 'https://picsum.photos/seed/rutas-alicante-d1/800/600', 0),
  (2, 'Playa del Postiguet', 'Día de playa y paseo por la Explanada de España.', 'playa', 'https://picsum.photos/seed/rutas-alicante-d2/800/600', 1),
  (3, 'Ruta gastronómica por el Mercado Central', 'Tapas, arroces y productos de la huerta alicantina.', 'gastronomia', 'https://picsum.photos/seed/rutas-alicante-d3/800/600', 2)
) as t(day_number, title, description, category, image_url, order_index);

-- JAPÓN — Zen
with p as (
  insert into proposals (agency_id, client_name, title, destination, theme_key, price, status,
    hotel_name, hotel_stars, hotel_image_url, price_includes, price_excludes)
  values ('<AGENCY_ID>', 'Sofía Marín', 'Ruta zen por templos y el Monte Fuji',
    'Japón', 'asiatico', 3200, 'accepted',
    'Hoshinoya Tokyo', 5, 'https://picsum.photos/seed/rutas-japon-hotel/1200/800',
    array['Vuelos internacionales', 'JR Pass 7 días', 'Alojamiento con desayuno', 'Guía de habla hispana en Kioto'],
    array['Comidas no especificadas', 'Compras personales', 'Seguro de viaje'])
  returning id
)
insert into itinerary_days (proposal_id, day_number, title, description, category, image_url, order_index)
select id, day_number, title, description, category, image_url, order_index from p, (values
  (1, 'Templos de Kioto', 'Fushimi Inari y sus miles de torii, seguido del pabellón dorado Kinkaku-ji.', 'cultura', 'https://picsum.photos/seed/rutas-japon-d1/800/600', 0),
  (2, 'Monte Fuji y lago Kawaguchiko', 'Vistas del volcán sagrado desde el lago, con paseo en teleférico.', 'naturaleza', 'https://picsum.photos/seed/rutas-japon-d2/800/600', 1),
  (3, 'Tokio: tradición y neón', 'Del santuario Meiji al cruce de Shibuya, contraste entre lo antiguo y lo moderno.', 'cultura', 'https://picsum.photos/seed/rutas-japon-d3/800/600', 2),
  (4, 'Ceremonia del té y cocina kaiseki', 'Experiencia gastronómica tradicional con un maestro del té.', 'gastronomia', 'https://picsum.photos/seed/rutas-japon-d4/800/600', 3)
) as t(day_number, title, description, category, image_url, order_index);
