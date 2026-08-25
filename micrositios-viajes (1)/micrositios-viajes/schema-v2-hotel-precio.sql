-- Ejecutar después de schema.sql

alter table proposals
  add column hotel_name text,
  add column hotel_stars smallint check (hotel_stars between 1 and 5),
  add column hotel_image_url text,
  add column price_includes text[] default '{}',
  add column price_excludes text[] default '{}';

alter table itinerary_days
  add column category text check (category in ('naturaleza','gastronomia','cultura','aventura','playa','descanso'));
